export interface ExamRequestedQueryEntity {
  id_atend_solicitacao: number;
  id_paciente: number;
  id_profissional_solicitacao?: number;
  st_conduta_consulta_agendada: number;
  st_conduta_cuidd_conti_program: number;
  dt_solicitado: string;
  filtro_procedimento?: string;
}
