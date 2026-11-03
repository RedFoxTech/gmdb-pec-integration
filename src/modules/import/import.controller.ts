import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ApiKeyGuard } from "src/common/guards/api-key.guard";
import { ImportService } from "./import.service";

@ApiTags("import")
@Controller("import")
@UseGuards(ApiKeyGuard)
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post()
  @ApiOperation({ summary: "Import city hall data" })
  @ApiResponse({
    status: 200,
    description: "Import city hall data.",
  })
  getAllAcs(): Promise<any> {
    return this.importService.import();
  }

  @Post("version")
  @ApiOperation({ summary: "Generate a new import version" })
  @ApiResponse({
    status: 200,
    description: "Generate a new import version.",
  })
  generateImportVersion(): Promise<any> {
    return this.importService.generateImportVersion();
  }

  @Get("version")
  @ApiOperation({ summary: "Get the current version" })
  @ApiResponse({
    status: 200,
    description: "Get the current version.",
  })
  getImportVersion(): Promise<any> {
    return this.importService.getCurrentImportVersion();
  }
}
