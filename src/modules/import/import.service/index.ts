import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService as CityHallPrismaService } from "../../../prisma/city-hall/prisma.service";
import { PrismaService as SourcePrismaService } from "../../../prisma/source/prisma.service";
import { ImportVersionStatusEnum } from "../import-version-status-enum";
import { ImportPatient } from "./import-patient";
import { ImportAppointment } from "./import-appointments";
import { ImportDose } from "./import-dose";
import { ImportImmunobiological } from "./import-immunobiological";
import { ImportProfessional } from "./import-professional";
import { ImportUnit } from "./import-unit";
import { ImportVaccination } from "./import-vaccination";
import { ImportExamRequested } from "./import-exam-requested";
import { ImportExamCollected } from "./import-exam-collected";
import { ImportExamEvaluated } from "./import-exam-evaluated";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class ImportService {
  private logger = new Logger(ImportService.name);
  private IBGE_CODE = parseInt(process.env.IBGE_CODE, 10);

  constructor(
    private readonly cityHallPrismaService: CityHallPrismaService,
    private readonly sourceHallPrismaService: SourcePrismaService,
  ) {}

  async import(): Promise<any> {
    try {
      let importVersion = await this.getCurrentImportVersion();

      if (!importVersion) {
        importVersion = await this.generateImportVersion();
      }

      const importPatient = new ImportPatient(
        this.cityHallPrismaService,
        this.sourceHallPrismaService,
      );

      const importAppointment = new ImportAppointment(
        this.cityHallPrismaService,
        this.sourceHallPrismaService,
      );

      const importDose = new ImportDose(
        this.cityHallPrismaService,
        this.sourceHallPrismaService,
      );

      const importImmunobiological = new ImportImmunobiological(
        this.cityHallPrismaService,
        this.sourceHallPrismaService,
      );

      const importProfessional = new ImportProfessional(
        this.cityHallPrismaService,
        this.sourceHallPrismaService,
      );

      const importUnit = new ImportUnit(
        this.cityHallPrismaService,
        this.sourceHallPrismaService,
      );

      const importVaccination = new ImportVaccination(
        this.cityHallPrismaService,
        this.sourceHallPrismaService,
      );

      const importExamRequested = new ImportExamRequested(
        this.cityHallPrismaService,
        this.sourceHallPrismaService,
      );

      const importExamCollected = new ImportExamCollected(
        this.cityHallPrismaService,
        this.sourceHallPrismaService,
      );

      const importExamEvaluated = new ImportExamEvaluated(
        this.cityHallPrismaService,
        this.sourceHallPrismaService,
      );

      await importPatient.import(importVersion.id);
      await importAppointment.import(importVersion.id);
      await importDose.import(importVersion.id);
      await importImmunobiological.import(importVersion.id);
      await importProfessional.import(importVersion.id);
      await importUnit.import(importVersion.id);
      await importVaccination.import(importVersion.id);
      await importExamRequested.import(importVersion.id);
      await importExamCollected.import(importVersion.id);
      await importExamEvaluated.import(importVersion.id);

      await this.sourceHallPrismaService.importVersion.update({
        where: { id: importVersion.id },
        data: {
          status: ImportVersionStatusEnum.DONE,
        },
      });

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async generateImportVersion(): Promise<any> {
    try {
      const data = await this.sourceHallPrismaService.importVersion.create({
        data: {
          status: ImportVersionStatusEnum.STARTED,
          cityHallId: this.IBGE_CODE,
        },
      });

      return data;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getCurrentImportVersion() {
    return this.sourceHallPrismaService.importVersion.findFirst({
      where: {
        cityHallId: this.IBGE_CODE,
        status: ImportVersionStatusEnum.STARTED,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  @Cron(
    process.env.CRON_EXPRESSION
      ? process.env.CRON_EXPRESSION
      : CronExpression.EVERY_DAY_AT_5AM,
    {
      name: "importCityHallData",
      disabled: process.env.ENABLE_CRON == "true" ? false : true,
    },
  )
  async importDaily(): Promise<void> {
    try {
      await this.generateImportVersion();
      await this.import();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
