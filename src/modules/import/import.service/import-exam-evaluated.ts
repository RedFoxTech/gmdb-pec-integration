import { Logger } from "@nestjs/common";
import { PrismaService as CityHallPrismaService } from "../../../prisma/city-hall/prisma.service";
import { PrismaService as SourcePrismaService } from "../../../prisma/source/prisma.service";
import { queryExamEvaluated } from "src/query";
import { ExamEvaluatedQueryEntity } from "src/query/entity";
import { Prisma as PrismaSource } from "prisma/generated/source";
import { queryCountBuilder } from "src/common/query-builder/count";
import { queryPaginationByWhereBuilder } from "src/common/query-builder/paginationByWhere";

export class ImportExamEvaluated {
  private logger = new Logger(ImportExamEvaluated.name);
  private IBGE_CODE = parseInt(process.env.IBGE_CODE, 10);
  private readonly PAGE_SIZE = 10000;

  constructor(
    private readonly cityHallPrismaService: CityHallPrismaService,
    private readonly sourceHallPrismaService: SourcePrismaService,
  ) {}

  private async register(
    data: ExamEvaluatedQueryEntity[],
    importVersionId: string,
  ): Promise<{ imported: number; fail: number }> {
    let imported = 0;
    let fail = 0;
    for (const item of data) {
      try {
        if (
          item.id_atend_avaliado !== null &&
          item.id_atend_avaliado !== undefined
        ) {
          const data: Omit<
            PrismaSource.EvaluatedCreateInput,
            "idAtendAvaliado" | "cityHallId"
          > = {
            importVersionId,
            idPaciente: item.id_paciente,
            dtAvaliado: item.dt_avaliado,
            filtroProcedimento: item.filtro_procedimento,
          };

          await this.sourceHallPrismaService.evaluated.upsert({
            where: {
              idAtendAvaliado: item.id_atend_avaliado,
              cityHallId: this.IBGE_CODE,
            },
            update: {
              ...data,
              updatedAt: new Date(),
            },
            create: {
              ...data,
              idAtendAvaliado: item.id_atend_avaliado,
              cityHallId: this.IBGE_CODE,
            },
          });
          imported++;
        } else {
          this.logger.warn(
            `id_atend_avaliado invalid: ${item.id_atend_avaliado}`,
          );
          fail++;
        }
      } catch (err) {
        this.logger.error(
          "exam evaluated: " +
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
    return this.sourceHallPrismaService.evaluated.deleteMany({
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

    this.logger.log("Start import evaluated exams");

    const [{ count, min, max }] =
      (await this.cityHallPrismaService.$queryRawUnsafe(
        queryCountBuilder(queryExamEvaluated, "id_atend_avaliado"),
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
            queryPaginationByWhereBuilder(
              queryExamEvaluated,
              "id_atend_avaliado",
              { page, pageSize: this.PAGE_SIZE },
            ),
          )) as ExamEvaluatedQueryEntity[];

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
              `[import-exam-evaluated] Progresso: ${nextMilestone}% Processados: ${processados} - Faltantes: ${faltantes}.`,
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
    this.logger.log(`Deleted outdated evaluated exams: ${deleted.count}`);
  }
}

