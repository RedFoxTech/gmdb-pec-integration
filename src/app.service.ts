import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "./prisma/city-hall/prisma.service";

@Injectable()
export class AppService implements OnModuleInit {
  private logger = new Logger(AppService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.createUnaccentExtension();
  }

  private async createUnaccentExtension() {
    try {
      await this.prisma.$executeRawUnsafe(
        `CREATE EXTENSION IF NOT EXISTS unaccent;`
      );
      this.logger.log("✅ Extensão unaccent verificada/criada com sucesso");
    } catch (error) {
      this.logger.error("❌ Erro ao criar extensão unaccent:", error);
    }
  }

  getHello(): string {
    return "Hello World!";
  }
}
