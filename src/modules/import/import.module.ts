import { Module } from "@nestjs/common";
import { ImportService } from "./import.service";
import { ImportController } from "./import.controller";
import { PrismaModule as CityHallPrismaModule } from "../../prisma/city-hall/prisma.module";
import { PrismaModule as SourcePrismaModule } from "../../prisma/source/prisma.module";

@Module({
  imports: [CityHallPrismaModule, SourcePrismaModule],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
