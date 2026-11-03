export interface ExamEvaluatedQueryEntity {
  id_atend_avaliado: number;
  id_paciente: number;
  dt_avaliado: string;
  filtro_procedimento?: string;
}
