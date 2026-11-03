export const queryExamCollected = `
  SELECT 
    coletado.co_fat_cidadao_pec as id_paciente,
    coletado.co_fat_procedimento id_atend_coleta,
    coletado.co_dim_profissional as id_profissional_coleta,
    MAX(TO_DATE(coletado.co_dim_tempo::text, 'YYYYMMDD')) AS dt_coleta,
    coletado.ds_filtro_procedimento as filtro_procedimento
  FROM 
    public.tb_fat_proced_atend coletado
  LEFT JOIN tb_dim_cbo ON tb_dim_cbo.co_seq_dim_cbo = coletado.co_dim_cbo 
  WHERE 
    coletado.ds_filtro_procedimento ILIKE ANY (ARRAY['%0201020033%', '%0203010086%', '%0203010019%', '%0201020076%', '%0201020084%', '%ABPG010%'])
    and coletado.co_fat_cidadao_pec is not null
  GROUP BY 
      coletado.co_fat_cidadao_pec, coletado.co_fat_procedimento, coletado.co_dim_profissional, coletado.ds_filtro_procedimento
`;
