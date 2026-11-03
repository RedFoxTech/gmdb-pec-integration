import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ApiKeyGuard } from "./common/guards/api-key.guard";
import { ScheduleModule } from "@nestjs/schedule";

// Modules
import { HealthModule } from "./modules/health/health.module";
import { StatusModule } from "./modules/status/status.module";
import { PatientModule } from "./modules/patient/patient.module";
import { AcsModule } from "./modules/acs/acs.module";
import { UnitModule } from "./modules/unit/unit.module";
import { ExamModule } from "./modules/exam/exam.module";
import { ImportModule } from "./modules/import/import.module";
import { PrismaModule } from "./prisma/city-hall/prisma.module";

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : ".env",
    }),
    ScheduleModule.forRoot(),
    StatusModule,
    AcsModule,
    PatientModule,
    UnitModule,
    ExamModule,
    ImportModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {}
}
