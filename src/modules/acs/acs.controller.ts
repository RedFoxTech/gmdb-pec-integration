import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AcsService } from "./acs.service";
import { AcsEntity } from "./acs.entity";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ApiKeyGuard } from "src/common/guards/api-key.guard";
import { AcsVaccinationRanking } from "./acs-vaccination-ranking.entity";
import { Paginated } from "src/common/paginated.interface";
import { AcsByRankingFindAllDto } from "./dto/findAllByRanking-dto";
import { AcsFindAllDto } from "./dto/findAll-dto";

@ApiTags("acs")
@Controller("acs")
@UseGuards(ApiKeyGuard)
export class AcsController {
  constructor(private readonly acsService: AcsService) {}

  @Get()
  @ApiOperation({ summary: "Get all Acs" })
  @ApiResponse({
    status: 200,
    description: "List of all acs.",
    type: [AcsEntity],
  })
  getAllAcs(@Query() params: AcsFindAllDto): Promise<AcsEntity[]> {
    return this.acsService.getAllAcs(params);
  }

  @Get("by-vaccination-ranking")
  @ApiOperation({ summary: "Get Acs's by ranking" })
  @ApiResponse({
    status: 200,
    description: "List of Acs's by ranking.",
    type: [AcsVaccinationRanking],
  })
  getAcsByVaccinationRanking(
    @Query() params: AcsByRankingFindAllDto
  ): Promise<Paginated<AcsVaccinationRanking>> {
    return this.acsService.getAcsByVaccinationRanking(params);
  }
}
