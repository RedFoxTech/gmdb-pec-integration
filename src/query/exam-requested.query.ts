export const queryExamRequested = `
  SELECT 
    solicitado.co_fat_cidadao_pec as id_paciente,
    solicitado.co_dim_profissional_1 as id_profissional_solicitacao,
    solicitado.co_seq_fat_atd_ind as id_atend_solicitacao,
    solicitado.st_conduta_consulta_agendada,
    solicitado.st_conduta_cuidd_conti_program,
    MAX(TO_DATE(solicitado.co_dim_tempo::text, 'YYYYMMDD')) AS dt_solicitado,
    solicitado.ds_filtro_proced_solicitados as filtro_procedimento
  FROM 
    public.tb_fat_atendimento_individual solicitado
  LEFT JOIN tb_dim_cbo ON tb_dim_cbo.co_seq_dim_cbo = solicitado.co_dim_cbo_1        
  WHERE         
    solicitado.ds_filtro_proced_solicitados ILIKE ANY (ARRAY['%0201020033%', '%0203010086%', '%0203010019%', '%0201020076%', '%0201020084%', '%ABPG010%'])
    and solicitado.co_fat_cidadao_pec is not null
  GROUP BY 
    solicitado.co_fat_cidadao_pec, solicitado.co_dim_profissional_1, solicitado.co_seq_fat_atd_ind, solicitado.st_conduta_consulta_agendada, solicitado.st_conduta_cuidd_conti_program, solicitado.ds_filtro_proced_solicitados
`;
