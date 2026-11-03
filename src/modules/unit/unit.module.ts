import { Module } from "@nestjs/common";
import { UnitService } from "./unit.service";
import { AcsController } from "./unit.controller";
import { PrismaModule as SourcePrismaModule } from "../../prisma/source/prisma.module";

@Module({
  imports: [SourcePrismaModule],
  controllers: [AcsController],
  providers: [UnitService],
})
export class UnitModule {}
