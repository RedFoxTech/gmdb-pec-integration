export const queryExamEvaluated = `
SELECT 
  avaliado.co_fat_cidadao_pec as id_paciente,
  avaliado.co_seq_fat_atd_ind as id_atend_avaliado,
  MAX(TO_DATE(avaliado.co_dim_tempo::text, 'YYYYMMDD')) AS dt_avaliado,
  avaliado.ds_filtro_proced_avaliados as filtro_procedimento
FROM 
  public.tb_fat_atendimento_individual avaliado
LEFT JOIN tb_dim_cbo ON tb_dim_cbo.co_seq_dim_cbo = avaliado.co_dim_cbo_1        
WHERE 
  avaliado.ds_filtro_proced_avaliados ILIKE ANY (ARRAY['%0201020033%', '%0203010086%', '%0203010019%', '%0201020076%', '%0201020084%', '%ABPG010%'])        
  and avaliado.co_fat_cidadao_pec is not null
GROUP BY 
  avaliado.co_fat_cidadao_pec, avaliado.co_seq_fat_atd_ind, avaliado.ds_filtro_proced_avaliados
`;
