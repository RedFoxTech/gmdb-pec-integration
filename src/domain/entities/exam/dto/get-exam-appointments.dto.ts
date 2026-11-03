import { PaginationDto } from "../../common";

export type GetExamAppointmentsDataDto = PaginationDto;

export interface GetExamAppointmentsDto {
  patientId: string;
  data?: GetExamAppointmentsDataDto;
}
