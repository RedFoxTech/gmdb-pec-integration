import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { UnitService } from "./unit.service";
import { UnitEntity } from "./unit.entity";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { ApiKeyGuard } from "src/common/guards/api-key.guard";
import { UnitsByIdDto } from "./dto/findById-dto";
import { UnitByRankingFindAllDto } from "./dto/findAllByRanking-dto";
import { UnitVaccinationRanking } from "./unit-vaccination-ranking.entity";
import { Paginated } from "src/common/paginated.interface";

@ApiTags("unit")
@Controller("unit")
@UseGuards(ApiKeyGuard)
export class AcsController {
  constructor(private readonly unitService: UnitService) {}

  @Get()
  @ApiOperation({ summary: "Get all Units" })
  @ApiResponse({
    status: 200,
    description: "List of all units.",
    type: [UnitEntity],
  })
  getAllUnits(): Promise<UnitEntity[]> {
    return this.unitService.getAllUnits();
  }

  @Get("by-id")
  @ApiOperation({ summary: "Get Units by id" })
  @ApiResponse({
    status: 200,
    description: "List of units by id.",
    type: [UnitEntity],
  })
  @ApiQuery({
    name: "ids",
    required: false,
    description: "Ids for search",
    type: String,
  })
  getUnitsById(@Query() params: UnitsByIdDto): Promise<UnitEntity[]> {
    return this.unitService.getUnitsById(params);
  }

  @Get("by-vaccination-ranking")
  @ApiOperation({ summary: "Get Units by ranking" })
  @ApiResponse({
    status: 200,
    description: "List of units by ranking.",
    type: [UnitVaccinationRanking],
  })
  getUnitsByVaccinationRanking(
    @Query() params: UnitByRankingFindAllDto
  ): Promise<Paginated<UnitVaccinationRanking>> {
    return this.unitService.getUnitsByVaccinationRanking(params);
  }
}
