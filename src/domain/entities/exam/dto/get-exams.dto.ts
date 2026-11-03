import { GenderEnum } from "@/domain/consts";
import { PaginationDto } from "../../common";

export interface GetExamsDto extends PaginationDto {
  units?: string;
  acs?: string;
  patientBeginAgeDate?: string;
  patientEndAgeDate?: string;
  patientName?: string;
  examStatus?: string;
  examAppointmentStatus?: string;
  gender?: GenderEnum;
  collectionYear?: number;
}
