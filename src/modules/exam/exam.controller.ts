import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ExamService } from "./exam.service";
import { ExamEntity } from "./exam.entity";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { ApiKeyGuard } from "src/common/guards/api-key.guard";
import { Paginated } from "src/common/paginated.interface";
import { ExamFindAllDto } from "./dto/findAll-dto";
import { ExamAppointmentEntity } from "./exam-appointment.entity";

@ApiTags("exam")
@Controller("exam")
@UseGuards(ApiKeyGuard)
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  @ApiOperation({ summary: "Get all Exams with pagination, sorting" })
  @ApiResponse({
    status: 200,
    description: "List of all Exams.",
    type: ExamEntity,
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number for pagination",
    type: Number,
  })
  @ApiQuery({
    name: "pageSize",
    required: false,
    description: "Number of items per page",
    type: Number,
  })
  @ApiQuery({
    name: "sortBy",
    required: false,
    description: "Field to sort by",
    type: String,
  })
  @ApiQuery({
    name: "sortOrder",
    required: false,
    description: "Order of sorting (asc or desc)",
    type: String,
  })
  getAll(
    @Query() paginationDto: ExamFindAllDto
  ): Promise<Paginated<ExamEntity>> {
    return this.examService.getAll(paginationDto);
  }

  @Get(":id/appointments")
  @ApiOperation({
    summary: "Get exam appointments by id with pagination, sorting",
  })
  @ApiResponse({
    status: 200,
    description: "List of exam appointments by id.",
    type: ExamAppointmentEntity,
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number for pagination",
    type: Number,
  })
  @ApiQuery({
    name: "pageSize",
    required: false,
    description: "Number of items per page",
    type: Number,
  })
  @ApiQuery({
    name: "sortBy",
    required: false,
    description: "Field to sort by",
    type: String,
  })
  @ApiQuery({
    name: "sortOrder",
    required: false,
    description: "Order of sorting (asc or desc)",
    type: String,
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "The ID of the patient to find",
  })
  getAppointmentsByPatientId(
    @Param("id") id: string,
    @Query() paginationDto: ExamFindAllDto
  ): Promise<Paginated<ExamAppointmentEntity>> {
    return this.examService.getAppointmentsByPatientId(id, paginationDto);
  }
}
