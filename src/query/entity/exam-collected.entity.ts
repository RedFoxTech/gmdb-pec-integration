export interface ExamCollectedQueryEntity {
  id_atend_coleta: number;
  id_paciente: number;
  id_profissional_coleta: number;
  dt_coleta: string;
  filtro_procedimento?: string;
}
