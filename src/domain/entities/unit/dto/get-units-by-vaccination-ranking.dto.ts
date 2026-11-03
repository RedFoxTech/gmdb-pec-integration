import { PaginationDto } from "@/domain/entities/common";

export interface GetUnitByVaccinationRankingDto extends PaginationDto {
  immunobiologicalIds: string;
  units?: string;
  position?: string;
  beginPatientAgeDate?: string;
  endPatientAgeDate?: string;
}
