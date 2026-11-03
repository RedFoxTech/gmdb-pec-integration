import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService as JuntosPrismaService } from "../../prisma/juntos/prisma.service";
import { PrismaService as SourcePrismaService } from "../../prisma/source/prisma.service";
import {
  queryAllPatientsByImmunobiological,
  queryAllPatientsByImmunobiologicalForExport,
  queryGetPatientsTest,
  queryPatientByIdOrCpf,
  queryPatientsById,
} from "./query";
import { PatientByImmunobiologicalFindAllDto } from "./dto/findAllByImmunobiological-dto";
import { Utils } from "src/common/utils";
import { Paginated } from "src/common/paginated.interface";
import { PatientEntity } from "./patient.entity";
import { FindManyByIdDto } from "./dto/findMany-dto";
import { PatientByImmunobiologicalFindAllForExportDto } from "./dto/findAllByImmunobiologicalForExport-dto";
import { PatientForExportEntity } from "./patient-for-export.entity";
import { CityHallIbgeCode } from "src/common/cityHallIbgeCode.enum";

const HPV_IMMUNO_CODE_LIST = ["60", "67", "68", "93"];
const PNI_CITY_HALL_LIST = [CityHallIbgeCode.SAO_GONCALO];

@Injectable()
export class PatientService {
  private logger = new Logger(PatientService.name);
  private readonly IBGE_CODE = process.env.IBGE_CODE as CityHallIbgeCode;

  constructor(
    private readonly juntosPrismaService: JuntosPrismaService,
    private readonly sourcePrismaService: SourcePrismaService
  ) {}

  async findOne(idOrCpf: string): Promise<any> {
    // Patient ids and CPFs are digits only; anything else never reaches the database
    if (!/^\d{1,18}$/.test(idOrCpf)) {
      throw new BadRequestException("Invalid patient id or CPF");
    }
    const start = Date.now();
    try {
      const patient = await this.sourcePrismaService.$queryRawUnsafe<
        PatientEntity[]
      >(queryPatientByIdOrCpf(), idOrCpf, idOrCpf);
      return patient?.[0] ?? null;
    } catch (error) {
      const duration = Date.now() - start;
      this.logger.error(`Error after ${duration}ms`, error);
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async findMany(params: FindManyByIdDto): Promise<PatientEntity[]> {
    try {
      const patient = await this.sourcePrismaService.$queryRawUnsafe<
        PatientEntity[]
      >(queryPatientsById(params));
      return patient ?? [];
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getPniData(immunobiologicalIds: string) {
    const pniData = {
      names: [],
      ages: [],
      applicationDates: [],
    };

    const allowPni =
      PNI_CITY_HALL_LIST.includes(this.IBGE_CODE) &&
      immunobiologicalIds
        .split("|")
        .some((val) => HPV_IMMUNO_CODE_LIST.includes(val));

    if (!allowPni) {
      return {
        hasPni: false,
      };
    }

    const patientsPni = await this.juntosPrismaService.pni.findMany({
      distinct: ["noCidadao", "dtNascimento"],
    });
    patientsPni.forEach((item) => {
      // pniData.names.push(normalize(item.noCidadao)); TODO - uncomment after allow unaccent into DB
      pniData.names.push(item.noCidadao.toLowerCase());
      pniData.ages.push(item.dtNascimento.toISOString().substring(0, 10));
      pniData.applicationDates.push(
        item.dtAplicacao.toISOString().substring(0, 10)
      );
    });

    if (
      pniData.names.length !== pniData.ages.length ||
      pniData.names.length !== pniData.applicationDates.length
    ) {
      this.logger.error("PNI items array parameters must have the same length");
      throw new Error("PNI items array parameters must have the same length");
    }

    return {
      hasPni: true,
      data: pniData,
    };
  }

  async getPatientsByImmunobiological(
    paginationDto: PatientByImmunobiologicalFindAllDto
  ): Promise<Paginated<PatientEntity>> {
    const start = Date.now();
    try {
      const pni = await this.getPniData(paginationDto.immunobiologicalIds);

      const formattedQuery = queryAllPatientsByImmunobiological(
        paginationDto,
        pni.hasPni
      );

      return await new Utils().findAllByQueryResponse<PatientEntity>(
        this.sourcePrismaService,
        formattedQuery,
        paginationDto,
        pni.data
          ? [pni.data.names, pni.data.ages, pni.data.applicationDates]
          : undefined
      );
    } catch (error) {
      const duration = Date.now() - start;
      this.logger.error(`Error after ${duration}ms`, error);
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getPatientsSizeByImmunobiological(
    paginationDto: PatientByImmunobiologicalFindAllDto
  ): Promise<number> {
    try {
      const pni = await this.getPniData(paginationDto.immunobiologicalIds);

      const formattedQuery = queryAllPatientsByImmunobiological(
        paginationDto,
        pni.hasPni
      );

      const countData = (await this.sourcePrismaService.$queryRawUnsafe(
        `SELECT COUNT(*) FROM (${queryAllPatientsByImmunobiological(paginationDto, pni.hasPni)}) as count`,
        ...(pni.data
          ? [pni.data.names, pni.data.ages, pni.data.applicationDates]
          : [])
      )) as Array<{ count: string }>;

      return parseInt(countData[0]?.count, 10);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getPatientsByImmunobiologicalForExport(
    paramsDto: PatientByImmunobiologicalFindAllForExportDto
  ): Promise<PatientForExportEntity[]> {
    try {
      const pni = await this.getPniData(paramsDto.immunobiologicalIds);

      return this.sourcePrismaService.$queryRawUnsafe(
        queryAllPatientsByImmunobiologicalForExport(paramsDto, pni.hasPni),
        ...(pni.data
          ? [pni.data.names, pni.data.ages, pni.data.applicationDates]
          : [])
      );
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getPatientsTest(params: any): Promise<any> {
    try {
      return this.sourcePrismaService.$queryRawUnsafe(
        queryGetPatientsTest(params)
      );
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
