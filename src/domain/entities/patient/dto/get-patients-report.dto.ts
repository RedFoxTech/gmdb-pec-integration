export interface GetPatientsReportDto {
  immunobiologicalIds: string;
  vaccinated?: boolean;
  segmentsIds?: string;
  units?: string;
  acs?: string;
  beginAgeDate?: string;
  endAgeDate?: string;
  consentStatus?: string;
  tags?: string;
  segments?: string;
  patientName?: string;
}
