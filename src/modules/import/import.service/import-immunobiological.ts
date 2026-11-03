import { Logger } from "@nestjs/common";
import { PrismaService as CityHallPrismaService } from "../../../prisma/city-hall/prisma.service";
import { PrismaService as SourcePrismaService } from "../../../prisma/source/prisma.service";
import { queryImmunobiological } from "src/query";
import { ImmunobiologicalQueryEntity } from "src/query/entity";
import { Prisma as PrismaSource } from "prisma/generated/source";
import { queryCountBuilder } from "src/common/query-builder/count";
import { queryPaginationByWhereBuilder } from "src/common/query-builder/paginationByWhere";

export class ImportImmunobiological {
  private logger = new Logger(ImportImmunobiological.name);
  private IBGE_CODE = parseInt(process.env.IBGE_CODE, 10);
  private readonly PAGE_SIZE = 10000;

  constructor(
    private readonly cityHallPrismaService: CityHallPrismaService,
    private readonly sourceHallPrismaService: SourcePrismaService,
  ) {}

  private async register(
    data: ImmunobiologicalQueryEntity[],
    importVersionId: string,
  ): Promise<{ imported: number; fail: number }> {
    let imported = 0;
    let fail = 0;
    for (const item of data) {
      try {
        if (item.id_imuno !== null && item.id_imuno !== undefined) {
          const data: Omit<
            PrismaSource.ImmunobiologicalCreateInput,
            "idImuno" | "cityHallId"
          > = {
            importVersionId,
            sgImuno: item.sg_imuno,
            noImunobiologico: item.no_imunobiologico,
            nuMs: item.nu_ms,
          };

          await this.sourceHallPrismaService.immunobiological.upsert({
            where: {
              idImuno: item.id_imuno,
              cityHallId: this.IBGE_CODE,
            },
            update: {
              ...data,
              updatedAt: new Date(),
            },
            create: {
              ...data,
              idImuno: item.id_imuno,
              cityHallId: this.IBGE_CODE,
            },
          });
          imported++;
        } else {
          this.logger.warn(`id_imuno invalid: ${item.id_imuno}`);
          fail++;
        }
      } catch (err) {
        this.logger.error(
          "immunobiological: " +
            JSON.stringify(item, (_, value) =>
              typeof value === "bigint" ? value.toString() : value,
            ),
        );
        this.logger.error(err);
        fail++;
      }
    }

    return { imported, fail };
  }

  private async deleteOutdatedItems(importVersionId: string) {
    return this.sourceHallPrismaService.immunobiological.deleteMany({
      where: {
        cityHallId: this.IBGE_CODE,
        importVersionId: {
          not: importVersionId,
        },
      },
    });
  }

  public async import(importVersionId: string): Promise<void> {
    let run = true;
    let page = 1;
    let importedTotal = 0;
    let failTotal = 0;
    let nextMilestone = 25;

    this.logger.log("Start import immunobiologicals");

    const [{ count, min, max }] =
      (await this.cityHallPrismaService.$queryRawUnsafe(
        queryCountBuilder(queryImmunobiological, "id_imuno"),
      )) as Array<{ count: string; min: number; max: number }>;

    const totalToImport = parseInt(count, 10);
    let remainingItems = totalToImport;

    page = min ? Math.floor(Number(min) / this.PAGE_SIZE) + 1 : 1;
    const maxPage = max ? Math.ceil(Number(max) / this.PAGE_SIZE) : 1;

    this.logger.log(`Total records found in source: ${totalToImport}`);

    do {
      let retry = 0;
      while (retry < 3) {
        try {
          const data = (await this.cityHallPrismaService.$queryRawUnsafe(
            queryPaginationByWhereBuilder(queryImmunobiological, "id_imuno", {
              page,
              pageSize: this.PAGE_SIZE,
            }),
          )) as ImmunobiologicalQueryEntity[];

          this.logger.log("Data length: " + data.length);

          if (data.length === 0) {
            page++;
            run = remainingItems > 0 && page <= maxPage;
            break;
          }

          const res = await this.register(data, importVersionId);

          importedTotal += res.imported;
          failTotal += res.fail;
          remainingItems -= data.length;

          const progressNumeric =
            ((importedTotal + failTotal) / totalToImport) * 100;
          const progress = progressNumeric.toFixed(2);

          this.logger.log(
            `[Page ${page}] Processed: ${data.length} | ` +
              `Total Progress: ${progress}% (${importedTotal + failTotal}/${totalToImport}) | ` +
              `Fails: ${failTotal}`,
          );

          while (progressNumeric >= nextMilestone && nextMilestone <= 100) {
            const processados = importedTotal + failTotal;
            const faltantes = totalToImport - processados;
            this.logger.log(
              `[import-immunobiological] Progresso: ${nextMilestone}% Processados: ${processados} - Faltantes: ${faltantes}.`,
            );
            nextMilestone += 25;
          }

          page++;
          run = remainingItems > 0 && page <= maxPage;
          break;
        } catch (err) {
          retry++;
          if (/statement timeout/i.test(err.message)) {
            this.logger.error(`Timeout on page ${page}. Retry ${retry}/3...`);
            await new Promise((resolve) => setTimeout(resolve, 10000));
          } else {
            this.logger.error(`Fatal error on page ${page}: ${err.message}`);
            run = false;
            break;
          }
        }
      }
    } while (run);

    this.logger.log("--- Import Finished ---");
    this.logger.log(`Successfully imported/updated: ${importedTotal}`);
    this.logger.log(`Failed records: ${failTotal}`);

    this.logger.log("Cleaning up outdated records...");
    const deleted = await this.deleteOutdatedItems(importVersionId);
    this.logger.log(`Deleted outdated immunobiologicals: ${deleted.count}`);
  }
}

