export const queryDose = `
SELECT 
	tb_dim_dose_imunobiologico.co_seq_dim_dose_imunobiologico as id_dose, --id de relacionamento
	tb_dim_dose_imunobiologico.nu_identificador as nu_dose_ms, -- numero utilizado pelo ministério da saúde, geralmente pode se o mesmo do id_dose mas deixo aqui pois alguns bancos pode ser diferente
	tb_dim_dose_imunobiologico.sg_dose_imunobiologico as sg_imuno, -- sigla que representa a dose
	tb_dim_dose_imunobiologico.no_dose_imunobiologico -- nome da dose
FROM tb_dim_dose_imunobiologico
`;
