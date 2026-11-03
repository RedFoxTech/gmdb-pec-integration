import { Module } from "@nestjs/common";
import { AcsService } from "./acs.service";
import { AcsController } from "./acs.controller";
import { PrismaModule as CityHallPrismaModule } from "../../prisma/city-hall/prisma.module";
import { PrismaModule as SourcePrismaModule } from "../../prisma/source/prisma.module";

@Module({
  imports: [CityHallPrismaModule, SourcePrismaModule],
  controllers: [AcsController],
  providers: [AcsService],
})
export class AcsModule {}
