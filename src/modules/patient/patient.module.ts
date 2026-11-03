import { Module } from "@nestjs/common";
import { PatientService } from "./patient.service";
import { PatientController } from "./patient.controller";
import { PrismaModule as JuntosPrismaModule } from "../../prisma/juntos/prisma.module";
import { PrismaModule as SourcePrismaModule } from "../../prisma/source/prisma.module";

@Module({
  imports: [JuntosPrismaModule, SourcePrismaModule],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
