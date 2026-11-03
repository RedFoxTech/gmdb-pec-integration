import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { PatientService } from "./patient.service";
import { PatientEntity } from "./patient.entity";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { ApiKeyGuard } from "src/common/guards/api-key.guard";
import { PatientByImmunobiologicalFindAllDto } from "./dto/findAllByImmunobiological-dto";
import { Paginated } from "src/common/paginated.interface";
import { FindManyByIdDto } from "./dto/findMany-dto";
import { PatientByImmunobiologicalFindAllForExportDto } from "./dto/findAllByImmunobiologicalForExport-dto";
import { PatientForExportEntity } from "./patient-for-export.entity";

@ApiTags("patient")
@Controller("patient")
@UseGuards(ApiKeyGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get("test")
  test(@Query() testDto): Promise<any> {
    return this.patientService.getPatientsTest(testDto);
  }

  @Get("by-immunobiological")
  @ApiOperation({ summary: "Get all Patients with pagination, sorting" })
  @ApiResponse({
    status: 200,
    description: "List of all patients.",
    type: PatientEntity,
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
  getPatientsByImmunobiological(
    @Query() paginationDto: PatientByImmunobiologicalFindAllDto
  ): Promise<Paginated<PatientEntity>> {
    return this.patientService.getPatientsByImmunobiological(paginationDto);
  }

  @Get("size-by-immunobiological")
  @ApiOperation({ summary: "Get all Patients size" })
  @ApiResponse({
    status: 200,
    description: "Size of all patients.",
    type: PatientEntity,
  })
  getPatientsSizeByImmunobiological(
    @Query() paginationDto: PatientByImmunobiologicalFindAllDto
  ): Promise<number> {
    return this.patientService.getPatientsSizeByImmunobiological(paginationDto);
  }

  @Get("by-immunobiological-for-export")
  @ApiOperation({ summary: "Get all Patients with pagination, sorting" })
  @ApiResponse({
    status: 200,
    description: "List of all patients.",
    type: PatientEntity,
  })
  getPatientsByImmunobiologicalForExport(
    @Query() paramsDto: PatientByImmunobiologicalFindAllForExportDto
  ): Promise<PatientForExportEntity[]> {
    return this.patientService.getPatientsByImmunobiologicalForExport(
      paramsDto
    );
  }

  @Get("by-id")
  @ApiOperation({ summary: "Get Patient by ID" })
  @ApiResponse({
    status: 200,
    description: "Patients found.",
    type: PatientEntity,
  })
  @ApiQuery({
    name: "ids",
    required: false,
    description: "ids to search",
    type: String,
  })
  findMany(
    @Query() findManyByIdDto: FindManyByIdDto
  ): Promise<PatientEntity[]> {
    return this.patientService.findMany(findManyByIdDto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single Patient by ID" })
  @ApiResponse({
    status: 200,
    description: "Patient found.",
    type: PatientEntity,
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "The ID of the Patient to retrieve",
  })
  findOne(@Param("id") idOrCpf: string): Promise<PatientEntity | null> {
    return this.patientService.findOne(idOrCpf);
  }
}
