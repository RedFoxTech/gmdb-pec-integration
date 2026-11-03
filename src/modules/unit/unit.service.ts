import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService as SourcePrismaService } from "../../prisma/source/prisma.service";
import {
  queryUnitsByVaccinationRanking,
  queryAllUnit,
  queryUnitsById,
} from "./query";
import { UnitEntity } from "./unit.entity";
import { UnitsByIdDto } from "./dto/findById-dto";
import { UnitByRankingFindAllDto } from "./dto/findAllByRanking-dto";
import { Utils } from "src/common/utils";
import { Paginated } from "src/common/paginated.interface";
import { UnitVaccinationRanking } from "./unit-vaccination-ranking.entity";

@Injectable()
export class UnitService {
  private logger = new Logger(UnitService.name);

  constructor(private readonly sourcePrismaService: SourcePrismaService) {}

  async getAllUnits(): Promise<UnitEntity[]> {
    try {
      return this.sourcePrismaService.$queryRawUnsafe(queryAllUnit());
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getUnitsById(params: UnitsByIdDto): Promise<UnitEntity[]> {
    try {
      return this.sourcePrismaService.$queryRawUnsafe(queryUnitsById(params));
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getUnitsByVaccinationRanking(
    params: UnitByRankingFindAllDto
  ): Promise<Paginated<UnitVaccinationRanking>> {
    try {
      return await new Utils().findAllByQueryResponse<any>(
        this.sourcePrismaService,
        queryUnitsByVaccinationRanking(params),
        params
      );
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
