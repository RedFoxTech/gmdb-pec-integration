import { Exclude, Expose, Transform } from "class-transformer";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Exclude()
export class FindExamAppointmentByIdDto extends PaginationDto {}
