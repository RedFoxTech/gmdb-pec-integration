import { sqlText } from "src/common/sql";
export const queryExamsAppointments = (currentData?: string) => {
  const now = currentData ? `'${sqlText(currentData)}'::DATE` : "CURRENT_DATE";
  return `
WITH citopatologico_coletado AS (
    SELECT 
        coletado.co_fat_cidadao_pec,
        coletado.co_dim_profissional,
        MAX(TO_DATE(coletado.co_dim_tempo::text, 'YYYYMMDD')) AS dt_coleta  
    FROM 
        public.tb_fat_proced_atend coletado
    LEFT JOIN tb_dim_cbo ON tb_dim_cbo.co_seq_dim_cbo = coletado.co_dim_cbo 
    WHERE 
        coletado.ds_filtro_procedimento ILIKE ANY (ARRAY['%0201020033%', '%0203010086%', '%0203010019%', '%0201020076%', '%0201020084%', '%ABPG010%'])
        AND coletado.co_fat_cidadao_pec is not null
    GROUP BY 
        coletado.co_fat_cidadao_pec, coletado.co_dim_profissional
    HAVING 
        MAX(TO_DATE(coletado.co_dim_tempo::text, 'YYYYMMDD')) BETWEEN ${now} - INTERVAL '3 years' AND ${now}
),
citopatologico_solicitado AS (
    SELECT 
        solicitado.co_fat_cidadao_pec,
        solicitado.co_dim_profissional_1,
        solicitado.st_conduta_consulta_agendada,
        solicitado.st_conduta_cuidd_conti_program,
        MAX(TO_DATE(solicitado.co_dim_tempo::text, 'YYYYMMDD')) AS dt_solicitado 
    FROM 
        public.tb_fat_atendimento_individual solicitado
    LEFT JOIN tb_dim_cbo ON tb_dim_cbo.co_seq_dim_cbo = solicitado.co_dim_cbo_1        
    WHERE         
        solicitado.ds_filtro_proced_solicitados ILIKE ANY (ARRAY['%0201020033%', '%0203010086%', '%0203010019%', '%0201020076%', '%0201020084%', '%ABPG010%'])
        AND solicitado.co_fat_cidadao_pec is not null
    GROUP BY 
        solicitado.co_fat_cidadao_pec, solicitado.co_dim_profissional_1, solicitado.st_conduta_consulta_agendada, solicitado.st_conduta_cuidd_conti_program
    HAVING 
        MAX(TO_DATE(solicitado.co_dim_tempo::text, 'YYYYMMDD')) BETWEEN ${now} - INTERVAL '3 years' AND ${now}
),
citopatologico_avaliado AS (
    SELECT 
        avaliado.co_fat_cidadao_pec,
        MAX(TO_DATE(avaliado.co_dim_tempo::text, 'YYYYMMDD')) AS dt_avaliado  
    FROM 
        public.tb_fat_atendimento_individual avaliado
    LEFT JOIN tb_dim_cbo ON tb_dim_cbo.co_seq_dim_cbo = avaliado.co_dim_cbo_1        
    WHERE 
        avaliado.ds_filtro_proced_avaliados ILIKE ANY (ARRAY['%0201020033%', '%0203010086%', '%0203010019%', '%0201020076%', '%0201020084%', '%ABPG010%'])
        AND avaliado.co_fat_cidadao_pec is not null
    GROUP BY 
        avaliado.co_fat_cidadao_pec
    HAVING 
        MAX(TO_DATE(avaliado.co_dim_tempo::text, 'YYYYMMDD')) BETWEEN ${now} - INTERVAL '3 years' AND ${now}
)
select
    distinct on(tb_cidadao.co_seq_cidadao)
    tb_fat_cidadao_pec.co_seq_fat_cidadao_pec as id_paciente,     
	citopatologico_coletado.co_dim_profissional as id_profissional_coleta,
    citopatologico_coletado.dt_coleta, -- data que foi coletado material para exaame
    citopatologico_solicitado.co_dim_profissional_1 as id_profissional_solicitacao, -- profissional da consulta
	citopatologico_solicitado.dt_solicitado, -- caso tenha sido solicitado e não coletado na unidade terá a data da solicitação
	CASE
	    WHEN citopatologico_solicitado.st_conduta_consulta_agendada = 1 or citopatologico_solicitado.st_conduta_cuidd_conti_program = 1 THEN 1
	    ELSE 0
	END AS agendado, -- informa que teve um agendamento ou se foi um cuidado continuado 
	citopatologico_avaliado.dt_avaliado
FROM tb_cidadao
	LEFT JOIN tb_fat_cidadao_pec ON tb_fat_cidadao_pec.co_cidadao = tb_cidadao.co_seq_cidadao
	LEFT JOIN tb_cds_cad_individual ON tb_cidadao.co_unico_ultima_ficha = tb_cds_cad_individual.co_unico_ficha
	LEFT JOIN citopatologico_coletado ON citopatologico_coletado.co_fat_cidadao_pec = tb_fat_cidadao_pec.co_seq_fat_cidadao_pec
	LEFT JOIN citopatologico_solicitado ON citopatologico_solicitado.co_fat_cidadao_pec = tb_fat_cidadao_pec.co_seq_fat_cidadao_pec
	LEFT JOIN citopatologico_avaliado ON citopatologico_avaliado.co_fat_cidadao_pec = tb_fat_cidadao_pec.co_seq_fat_cidadao_pec
WHERE
    tb_cidadao.st_ativo = 1
    AND tb_cidadao.st_ativo_para_exibicao = 1
    AND tb_cidadao.dt_nascimento > ${now} - INTERVAL '64 years' -- filtra idade relacionada ao exame
	AND tb_cidadao.dt_nascimento <=  ${now} - INTERVAL '25 years' 
	AND tb_cds_cad_individual.co_sexo = 1 -- busca apenas sexo feminino
    AND tb_cidadao.st_faleceu = 0 -- exclui os falecidos
`;
};
