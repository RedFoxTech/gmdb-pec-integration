export const queryImmunobiological = `
SELECT 
  co_seq_dim_imunobiologico::bigint id_imuno, --id presente na tabela de vacinação
  sg_imunobiologico AS sg_imuno, -- Sigla utilizada
  no_imunobiologico, -- nome do imuno
  nu_identificador::int AS nu_ms -- identificador utilizado pelo minitério da saúde
FROM 
  public.tb_dim_imunobiologico
ORDER BY 
  nu_identificador::int ASC
`;
