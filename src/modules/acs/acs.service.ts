import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService as CityHallPrismaService } from "../../prisma/city-hall/prisma.service";
import { PrismaService as SourcePrismaService } from "../../prisma//source/prisma.service";
import { queryAcsByVaccinationRanking, queryAllAcs } from "./query";
import { AcsEntity } from "./acs.entity";
import { AcsByRankingFindAllDto } from "./dto/findAllByRanking-dto";
import { Paginated } from "src/common/paginated.interface";
import { Utils } from "src/common/utils";
import { AcsVaccinationRanking } from "./acs-vaccination-ranking.entity";
import { AcsFindAllDto } from "./dto/findAll-dto";

@Injectable()
export class AcsService {
  private logger = new Logger(AcsService.name);

  constructor(
    private readonly cityHallPrismaService: CityHallPrismaService,
    private readonly sourcePrismaService: SourcePrismaService
  ) {}

  async getAllAcs(params: AcsFindAllDto): Promise<AcsEntity[]> {
    try {
      return this.sourcePrismaService.$queryRawUnsafe(queryAllAcs(params));
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getAcsByVaccinationRanking(
    params: AcsByRankingFindAllDto
  ): Promise<Paginated<AcsVaccinationRanking>> {
    try {
      return await new Utils().findAllByQueryResponse<any>(
        this.sourcePrismaService,
        queryAcsByVaccinationRanking(params),
        params
      );
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
