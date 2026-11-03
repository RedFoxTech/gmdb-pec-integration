import { Injectable, Logger } from "@nestjs/common";
import { PrismaService as CityHallPrismaService } from "../../prisma/city-hall/prisma.service";
import {
  queryPatientLength,
  queryVaccinationLength,
  queryDoseLength,
  queryImmunobiologicalLength,
} from "./query";
import { CityHallStatus } from "./city-hall-status.entity";
import { CheckCityHallDbStatusDto } from "./dto/check-city-hall-db-status.dto";
import { PgService } from "src/pg/pg.service";
import { queryVaccination } from "src/query";

@Injectable()
export class StatusService {
  private logger = new Logger(StatusService.name);

  constructor(
    private readonly cityHallPrismaService: CityHallPrismaService,
    private readonly pgService: PgService
  ) {}

  async tableStatus(query: string) {
    try {
      const result = await this.cityHallPrismaService.$queryRawUnsafe(query);

      return {
        length: result[0].count,
      };
    } catch (error) {
      this.logger.error(error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        error: errorMessage,
      };
    }
  }

  async checkCityHallDbConnection() {
    try {
      await this.cityHallPrismaService.$queryRaw`SELECT 1`;
      const test = await this.tableStatus(queryVaccinationLength);
      const test2 = await this.tableStatus(queryVaccination);

      this.logger.log("✅ Connected to the database successfully with prisma!");
      this.logger.log(test);
      this.logger.log(JSON.stringify(test2));

      return {
        status: "ok",
        message: "Connected to database with prisma ✅",
      };
    } catch (error) {
      this.logger.error(
        "❌ Failed to connect to the database with prisma:",
        error
      );
      return {
        status: "error",
        message: "Database connection failed with prisma",
        error,
      };
    }
  }

  async checkCityHallDbPgConnection() {
    try {
      await this.pgService.query("SELECT NOW()");
      const a = await this.pgService.query(queryVaccination);
      this.logger.log("✅ Connected to the database successfully with PG!");
      this.logger.log("Vacinações from PG: " + JSON.stringify(a));
      return {
        status: "ok",
        message: "Connected to database with PG ✅",
      };
    } catch (error) {
      this.logger.error("❌ Failed to connect to the database with PG:", error);
      return {
        status: "error",
        message: "Database connection failed with PG",
        error,
      };
    }
  }

  async checkCityHallDbStatus(
    params: CheckCityHallDbStatusDto
  ): Promise<CityHallStatus> {
    try {
      return {
        patients: await this.tableStatus(queryPatientLength),
        vaccinations: await this.tableStatus(queryVaccinationLength),
        immunobiologicals: await this.tableStatus(queryImmunobiologicalLength),
        doses: await this.tableStatus(queryDoseLength),
        vaccinatedPatiends: 0,
        notVaccinatedPatiends: 0,
      };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
