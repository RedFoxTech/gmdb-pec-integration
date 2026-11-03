export const queryPatient = `
SELECT
    DISTINCT ON (tb_fat_cidadao_pec.co_seq_fat_cidadao_pec)
    tb_fat_cidadao_pec.co_seq_fat_cidadao_pec AS id_paciente, --ID do paciente onde sempre estará relacionadadas nas tabelas de atendimentos
    tb_cidadao.co_seq_cidadao AS co_cidadao, -- ID do cidadao na tabela cidadao não usamos para relacionamento com atendimentos
    tb_cidadao.no_cidadao,
    tb_cidadao.dt_nascimento,
    CASE
        WHEN age(public.tb_cidadao.dt_nascimento) >= interval '1 year' THEN
            concat(
                extract(year from age(public.tb_cidadao.dt_nascimento))::int,
                'a ',
                extract(month from age(public.tb_cidadao.dt_nascimento))::int,
                'm ',
                extract(day from age(public.tb_cidadao.dt_nascimento))::int,
                'd'
            )
        WHEN age(public.tb_cidadao.dt_nascimento) >= interval '1 month' THEN
            concat(
                extract(month from age(public.tb_cidadao.dt_nascimento))::int,
                'm ',
                extract(day from age(public.tb_cidadao.dt_nascimento))::int,
                'd'
            )
        ELSE
            concat(
                extract(day from age(public.tb_cidadao.dt_nascimento))::int,
                'd'
            )
    END AS idade,
    SUBSTRING(public.tb_cidadao.no_sexo FROM 1 FOR 1) AS sexo,
    tb_cidadao.nu_cns AS cns,
    tb_cidadao.nu_cpf AS cpf,
    UPPER(tb_cidadao.no_mae) as no_mae,
    COALESCE(tb_acomp_cidadaos_vinculados.st_possui_fci, 2) AS status_cadastro, -- aqui é a informação se o cidadão possui ficha de cadastro individual: INCOSSISTÊNCIA = 0, ATIVO = 1, MUDANÇA DE TERRITÓRIO / SEM EQUIPE = 2,
    CASE
	    WHEN tb_cidadao.co_unico_ultima_ficha IS NOT NULL THEN 1
	    ELSE 0
	END AS fci, --informa se possue ficha de cadastro individual caso seja = 0 só possui o cadastro rápido sem vinculo com ACS
    UPPER(tb_acomp_cidadaos_vinculados.no_responsavel) AS resp_familiar,
    UPPER(COALESCE(tb_acomp_cidadaos_vinculados.ds_logradouro_domicilio, tb_cidadao.ds_logradouro)) AS logradouro,
    COALESCE(tb_acomp_cidadaos_vinculados.nu_numero_domicilio, tb_cidadao.nu_numero) AS nu_logradouro,
    UPPER(COALESCE(tb_acomp_cidadaos_vinculados.no_bairro_domicilio, tb_cidadao.no_bairro)) AS bairro,
    UPPER(COALESCE(tb_acomp_cidadaos_vinculados.ds_cep_domicilio, tb_cidadao.ds_cep)) AS cep,
    COALESCE(tb_cidadao.nu_telefone_celular, tb_cidadao.nu_telefone_residencial, tb_cidadao.nu_telefone_contato) as contato, -- busca um dos três
    COALESCE(tb_cds_cad_individual.nu_micro_area, 'FA') as nu_micro_area,
    tb_dim_profissional.co_seq_dim_profissional AS id_profissional, --ID do profissional do cadastras, esse é o mesmo do relacionamento dos atendimentos
    UPPER(tb_dim_profissional.no_profissional) AS no_prof_cad, --Deixei a coluna apenas pra validação da informação mas acima a id do profissional que terá relacionamento com a tabela de profissionais
    CASE
	    WHEN tb_cds_prof.nu_cbo_2002 ILIKE ANY (ARRAY['515105', '322255']) THEN 1
	    ELSE 0
	END AS cbo_acs, -- Validacao pra saber se o cadastros foi realizado por ACS
	tb_dim_unidade_saude.co_seq_dim_unidade_saude as id_ubs,
	tb_dim_equipe.co_seq_dim_equipe as id_equipe, --caso esteja null é porque o ACS informou mudança de territorio (ativou no cadastro mudou-se)
    tb_dim_equipe.no_equipe, --Deixei a coluna apenas pra validação da informação mas acima a id do profissional que terá relacionamento com a tabela de equipes
    case -- Aqui está a busca de cadastros duplicados
    WHEN EXISTS (
        SELECT 1
        FROM tb_cidadao duplicado
        WHERE
            duplicado.no_cidadao = tb_cidadao.no_cidadao
            AND duplicado.dt_nascimento = tb_cidadao.dt_nascimento
            -- AND duplicado.no_mae = tb_cidadao.no_mae -- caso queira deixar a busca mais refinada ativar
            AND duplicado.st_ativo_para_exibicao = 1
            AND duplicado.co_seq_cidadao <> tb_cidadao.co_seq_cidadao -- Garante que é outro registro
    )
    THEN 1
    ELSE 0
	END AS duplicado,
	tb_cidadao.st_unificado, -- Aqui informo quais cadastros já pussuem unificação
	tb_dim_unidade_saude.nu_cnes
FROM public.tb_cidadao
	LEFT JOIN tb_fat_cidadao_pec
		ON tb_cidadao.co_seq_cidadao = tb_fat_cidadao_pec.co_cidadao
	LEFT JOIN tb_acomp_cidadaos_vinculados
		ON tb_cidadao.co_seq_cidadao = tb_acomp_cidadaos_vinculados.co_cidadao
	LEFT JOIN tb_cds_cad_individual
    	ON tb_cidadao.co_unico_ultima_ficha = tb_cds_cad_individual.co_unico_ficha
    LEFT JOIN tb_cds_prof
    	ON tb_cds_cad_individual.co_cds_prof_cadastrante = tb_cds_prof.co_seq_cds_prof
    LEFT JOIN tb_dim_profissional
    	ON tb_cds_prof.nu_cns = tb_dim_profissional.nu_cns
    LEFT JOIN tb_dim_equipe
   		 ON tb_acomp_cidadaos_vinculados.nu_ine_vinc_equipe = tb_dim_equipe.nu_ine
    LEFT JOIN tb_dim_unidade_saude
   		 ON tb_acomp_cidadaos_vinculados.nu_cnes_vinc_equipe = tb_dim_unidade_saude.nu_cnes
where
	 tb_cidadao.st_ativo = 1
	 AND tb_cidadao.st_faleceu = 0
	 AND tb_cidadao.st_ativo_para_exibicao = 1
`;
