import { Module } from "@nestjs/common";
import { ExamService } from "./exam.service";
import { ExamController } from "./exam.controller";
import { PrismaModule as CityHallPrismaModule } from "../../prisma/city-hall/prisma.module";
import { PrismaModule as SourcePrismaModule } from "../../prisma/source/prisma.module";

@Module({
  imports: [CityHallPrismaModule, SourcePrismaModule],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}
