import { PaginationDto } from "@/domain/entities/common";

export interface GetAcsByVaccinationRankingDto extends PaginationDto {
  immunobiologicalIds: string;
  acs?: string;
  units?: string;
  position?: string;
  beginPatientAgeDate?: string;
  endPatientAgeDate?: string;
}
