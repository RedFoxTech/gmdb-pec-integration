import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { StatusService } from "./status.service";
import { CityHallStatus } from "./city-hall-status.entity";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { ApiKeyGuard } from "src/common/guards/api-key.guard";
import { CheckCityHallDbStatusDto } from "./dto/check-city-hall-db-status.dto";

@ApiTags("status")
@Controller("status")
@UseGuards(ApiKeyGuard)
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get("city-hall-db")
  @ApiOperation({ summary: "Get city hall data base status" })
  @ApiResponse({
    status: 200,
    description: "Db status found.",
    type: CityHallStatus,
  })
  @ApiQuery({
    name: "immunobiologicalIds",
    required: false,
    description: "immunobiologicals id for search",
    type: Number,
  })
  checkCityHallDbStatus(
    @Query() params: CheckCityHallDbStatusDto
  ): Promise<CityHallStatus> {
    return this.statusService.checkCityHallDbStatus(params);
  }

  @Get("city-hall-db-connection")
  checkCityHallDbConnection() {
    return this.statusService.checkCityHallDbConnection();
  }

  @Get("city-hall-db-pg-connection")
  checkCityHallDbPgConnection() {
    return this.statusService.checkCityHallDbPgConnection();
  }
}
