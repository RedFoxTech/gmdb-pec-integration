import { PaginationDto } from "../../common";

export interface GetPatientsDto extends PaginationDto {
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
  beginVaccinationDate?: string;
  endVaccinationDate?: string;
}
