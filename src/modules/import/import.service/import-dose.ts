import { Logger } from "@nestjs/common";
import { PrismaService as CityHallPrismaService } from "../../../prisma/city-hall/prisma.service";
import { PrismaService as SourcePrismaService } from "../../../prisma/source/prisma.service";
import { queryDose } from "src/query";
import { DoseQueryEntity } from "src/query/entity";
import { Prisma as PrismaSource } from "prisma/generated/source";
import { queryCountBuilder } from "src/common/query-builder/count";
import { queryPaginationByWhereBuilder } from "src/common/query-builder/paginationByWhere";

export class ImportDose {
  private logger = new Logger(ImportDose.name);
  private IBGE_CODE = parseInt(process.env.IBGE_CODE, 10);
  private readonly PAGE_SIZE = 10000;

  constructor(
    private readonly cityHallPrismaService: CityHallPrismaService,
    private readonly sourceHallPrismaService: SourcePrismaService,
  ) {}

  private async register(
    data: DoseQueryEntity[],
    importVersionId: string,
  ): Promise<{ imported: number; fail: number }> {
    let imported = 0;
    let fail = 0;
    for (const item of data) {
      try {
        if (item.id_dose !== null && item.id_dose !== undefined) {
          const data: Omit<
            PrismaSource.DoseCreateInput,
            "idDose" | "cityHallId"
          > = {
            importVersionId,
            nuDoseMs: item.nu_dose_ms,
            sgImuno: item.sg_imuno,
            noDoseImunobiologico: item.no_dose_imunobiologico,
          };

          await this.sourceHallPrismaService.dose.upsert({
            where: {
              idDose: item.id_dose,
              cityHallId: this.IBGE_CODE,
            },
            update: {
              ...data,
              updatedAt: new Date(),
            },
            create: {
              ...data,
              idDose: item.id_dose,
              cityHallId: this.IBGE_CODE,
            },
          });
          imported++;
        } else {
          this.logger.warn(`id_dose invalid: ${item.id_dose}`);
          fail++;
        }
      } catch (err) {
        this.logger.error(
          "dose: " +
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
    return this.sourceHallPrismaService.dose.deleteMany({
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

    this.logger.log("Start import doses");

    const [{ count, min, max }] =
      (await this.cityHallPrismaService.$queryRawUnsafe(
        queryCountBuilder(queryDose, "id_dose"),
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
            queryPaginationByWhereBuilder(queryDose, "id_dose", {
              page,
              pageSize: this.PAGE_SIZE,
            }),
          )) as DoseQueryEntity[];

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
              `[import-dose] Progresso: ${nextMilestone}% Processados: ${processados} - Faltantes: ${faltantes}.`,
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
    this.logger.log(`Deleted outdated doses: ${deleted.count}`);
  }
}

