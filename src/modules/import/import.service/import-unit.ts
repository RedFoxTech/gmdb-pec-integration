import { Logger } from "@nestjs/common";
import { PrismaService as CityHallPrismaService } from "../../../prisma/city-hall/prisma.service";
import { PrismaService as SourcePrismaService } from "../../../prisma/source/prisma.service";
import { queryUnit } from "src/query";
import { UnitQueryEntity } from "src/query/entity";
import { Prisma as PrismaSource } from "prisma/generated/source";
import { queryCountBuilder } from "src/common/query-builder/count";
import { queryPaginationByWhereBuilder } from "src/common/query-builder/paginationByWhere";

export class ImportUnit {
  private logger = new Logger(ImportUnit.name);
  private IBGE_CODE = parseInt(process.env.IBGE_CODE, 10);
  private readonly PAGE_SIZE = 10000;

  constructor(
    private readonly cityHallPrismaService: CityHallPrismaService,
    private readonly sourceHallPrismaService: SourcePrismaService,
  ) {}

  private async register(
    data: UnitQueryEntity[],
    importVersionId: string,
    unitsAlreadyImported: Set<string>,
  ): Promise<{ imported: number; fail: number }> {
    let imported = 0;
    let fail = 0;
    for (const item of data) {
      try {
        if (
          item.id_equipe !== null &&
          item.id_equipe !== undefined &&
          item.nu_cnes &&
          !unitsAlreadyImported.has(item.nu_cnes)
        ) {
          const data: Omit<
            PrismaSource.UnitCreateInput,
            "idEquipe" | "cityHallId"
          > = {
            importVersionId,
            idMunicipio: item.id_municipio,
            coIbge: item.co_ibge,
            municipio: item.municipio,
            idUbs: item.id_ubs,
            nuCnes: item.nu_cnes,
            noUnidade: item.no_unidade,
            nuIne: item.nu_ine,
            noEquipe: item.no_equipe,
            tipoEquipe: item.tipo_equipe,
            nuMs: item.nu_ms,
            noTipoEquipe: item.no_tipo_equipe,
            contato: item.contato,
            logradouro: item.logradouro,
            nuLogradouro: item.nu_logradouro,
            bairro: item.bairro,
            cep: item.cep,
          };

          await this.sourceHallPrismaService.unit.upsert({
            where: {
              idEquipe: item.id_equipe,
              cityHallId: this.IBGE_CODE,
            },
            update: {
              ...data,
              updatedAt: new Date(),
            },
            create: {
              ...data,
              idEquipe: item.id_equipe,
              cityHallId: this.IBGE_CODE,
            },
          });
          unitsAlreadyImported.add(item.nu_cnes);
          imported++;
        }
      } catch (err) {
        this.logger.error(
          "unit: " +
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
    return this.sourceHallPrismaService.unit.deleteMany({
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

    this.logger.log("Start import units");

    const [{ count, min, max }] =
      (await this.cityHallPrismaService.$queryRawUnsafe(
        queryCountBuilder(queryUnit, "id_equipe"),
      )) as Array<{ count: string; min: number; max: number }>;

    const totalToImport = parseInt(count, 10);
    let remainingItems = totalToImport;

    page = min ? Math.floor(Number(min) / this.PAGE_SIZE) + 1 : 1;
    const maxPage = max ? Math.ceil(Number(max) / this.PAGE_SIZE) : 1;

    this.logger.log(`Total records found in source: ${totalToImport}`);

    const cnesAlreadyImported = new Set<string>();

    do {
      let retry = 0;
      while (retry < 3) {
        try {
          const data = (await this.cityHallPrismaService.$queryRawUnsafe(
            queryPaginationByWhereBuilder(queryUnit, "id_equipe", {
              page,
              pageSize: this.PAGE_SIZE,
            }),
          )) as UnitQueryEntity[];

          this.logger.log("Data length: " + data.length);

          if (data.length === 0) {
            page++;
            run = remainingItems > 0 && page <= maxPage;
            break;
          }

          const res = await this.register(
            data.filter((item) => item.id_equipe !== null),
            importVersionId,
            cnesAlreadyImported,
          );

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
              `[import-unit] Progresso: ${nextMilestone}% Processados: ${processados} - Faltantes: ${faltantes}.`,
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
    this.logger.log(`Deleted outdated units: ${deleted.count}`);
  }
}

