export interface GetVaccinationChartOptions {
  immunobiologicalIds: string;
  beginAgeDate?: string;
  endAgeDate?: string;
  consentStatus?: string;
  units?: string;
  acs?: string;
  patientName?: string;
  segmentsIds?: string;
  beginVaccinationDate?: string;
  endVaccinationDate?: string;
}
