import { Module } from "@nestjs/common";
import { StatusService } from "./status.service";
import { StatusController } from "./status.controller";
import { PrismaModule as CityHallPrismaModule } from "../../prisma/city-hall/prisma.module";
import { PgModule } from "src/pg/pg.module";

@Module({
  imports: [CityHallPrismaModule, PgModule],
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatusModule {}
