import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService as CityHallPrismaService } from "../../prisma/city-hall/prisma.service";
import { PrismaService as SourcePrismaService } from "../../prisma/source/prisma.service";
import { queryAll, queryExamAppointments } from "./query";
import {
  queryAll as queryAllTest,
  queryExamAppointments as queryExamAppointmentsTeste,
} from "./query/direct";
import { ExamEntity } from "./exam.entity";
import { ExamFindAllDto } from "./dto/findAll-dto";
import { Utils } from "src/common/utils";
import { Paginated } from "src/common/paginated.interface";
import { ExamAppointmentEntity } from "./exam-appointment.entity";
import { FindExamAppointmentByIdDto } from "./dto/findExamAppointmentById-dto";

@Injectable()
export class ExamService {
  private logger = new Logger(ExamService.name);

  constructor(
    private readonly cityHallPrismaService: CityHallPrismaService,
    private readonly sourcePrismaService: SourcePrismaService
  ) {}

  async getAll(findAllDto: ExamFindAllDto): Promise<Paginated<ExamEntity>> {
    try {
      console.log('ExamService:getAll:findAllDto', findAllDto)
      const formattedQuery = queryAll(findAllDto);
      console.log('ExamService:getAll:formattedQuery', formattedQuery)
      return await new Utils().findAllByQueryResponse<ExamEntity>(
        this.sourcePrismaService,
        formattedQuery,
        findAllDto
      );
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getAppointmentsByPatientId(
    patientId: string,
    findAllDto: FindExamAppointmentByIdDto
  ): Promise<Paginated<ExamAppointmentEntity>> {
    try {
      const formattedQuery = queryExamAppointments(patientId);
      return await new Utils().findAllByQueryResponse<ExamAppointmentEntity>(
        this.sourcePrismaService,
        formattedQuery,
        findAllDto
      );
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
