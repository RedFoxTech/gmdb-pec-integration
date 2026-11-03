export const queryVaccination = `
SELECT
    tb_fat_vacinacao.co_seq_fat_vacinacao as vaccination_id,
    tb_fat_vacinacao_vacina.co_seq_fat_vacinacao_vacina as id,
    tb_fat_vacinacao.co_fat_cidadao_pec AS id_paciente, --ID do paciente precente na query pacientes
    tb_fat_vacinacao_vacina.co_dim_imunobiologico AS co_seq_imuno, --codigo sequencia criado pelo banco
    tb_dim_imunobiologico.nu_identificador::int AS id_imuno, -- numero utilizado pelo ministério da saúde
    tb_dim_imunobiologico.no_imunobiologico, --adcionei apenas para validar mas como tem relacionamento pode remnover se necessário for
    tb_fat_vacinacao_vacina.co_dim_dose_imunobiologico id_dose,
    tb_dim_dose_imunobiologico.nu_identificador AS nu_dose_ms,
    tb_dim_dose_imunobiologico.sg_dose_imunobiologico AS dose, --adcionei apenas para validar mas como tem relacionamento pode remnover se necessário for
    tb_dim_dose_imunobiologico.no_dose_imunobiologico AS no_dose, --adcionei apenas para validar mas como tem relacionamento pode remnover se necessário for
    tb_fat_vacinacao_vacina.co_dim_equipe AS id_equipe, --equipe responsável pela aplicação
    tb_fat_vacinacao_vacina.co_dim_equipe AS id_profissional, -- id do profissional responsavel pela aplicação
    tb_fat_vacinacao_vacina.co_dim_cbo as id_cbo, --id do cbo do profissional
    TO_DATE(tb_fat_vacinacao_vacina.co_dim_tempo::text, 'YYYYMMDD') AS dt_aplicacao, -- data da aplicação
    -- tb_fat_vacinacao_vacina.no_fabricante AS fabricante, --Fabricante informado pelo responsavel da aplicação da dose
    tb_fat_vacinacao_vacina.no_lote AS lote, --lote informado pelo responsavel da aplicação da dose
    tb_dim_unidade_saude.nu_cnes,
    tb_fat_vacinacao.co_dim_unidade_saude
FROM tb_fat_vacinacao
    LEFT JOIN tb_fat_vacinacao_vacina ON tb_fat_vacinacao.co_seq_fat_vacinacao = tb_fat_vacinacao_vacina.co_fat_vacinacao
    LEFT JOIN tb_dim_imunobiologico ON tb_fat_vacinacao_vacina.co_dim_imunobiologico = tb_dim_imunobiologico.co_seq_dim_imunobiologico
    LEFT JOIN tb_dim_dose_imunobiologico ON tb_fat_vacinacao_vacina.co_dim_dose_imunobiologico = tb_dim_dose_imunobiologico.co_seq_dim_dose_imunobiologico
    LEFT JOIN tb_dim_unidade_saude ON tb_fat_vacinacao.co_dim_unidade_saude = tb_dim_unidade_saude.co_seq_dim_unidade_saude
where
	tb_fat_vacinacao.co_fat_cidadao_pec is not null
	--AND tb_dim_imunobiologico.nu_identificador in ('60', '67', '68', '93') --caso queira buscar apenas as vacinas relacionadas a HPV desconetar
`;
