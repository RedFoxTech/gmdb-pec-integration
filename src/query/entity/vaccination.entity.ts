export interface VaccinationQueryEntity {
  id: number;
  id_paciente: number;
  co_seq_imuno?: number;
  id_imuno?: number;
  no_imunobiologico?: string;
  id_dose?: number;
  nu_dose_ms?: string;
  dose?: string;
  no_dose?: string;
  id_equipe?: number;
  nu_cnes?: string;
  id_profissional?: number;
  id_cbo?: number;
  dt_aplicacao?: string;
  fabricante?: string;
  lote?: string;
}
