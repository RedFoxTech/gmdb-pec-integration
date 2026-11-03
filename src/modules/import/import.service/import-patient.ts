import { Logger } from "@nestjs/common";
import { PrismaService as CityHallPrismaService } from "../../../prisma/city-hall/prisma.service";
import { PrismaService as SourcePrismaService } from "../../../prisma/source/prisma.service";
import { queryPatient } from "src/query";
import { PatientQueryEntity } from "src/query/entity";
import { Prisma as PrismaSource } from "prisma/generated/source";
import { queryCountBuilder } from "src/common/query-builder/count";
import { queryPaginationByWhereBuilder } from "src/common/query-builder/paginationByWhere";

export class ImportPatient {
  private logger = new Logger(ImportPatient.name);
  private IBGE_CODE = parseInt(process.env.IBGE_CODE, 10);
  private readonly PAGE_SIZE = 10000;

  constructor(
    private readonly cityHallPrismaService: CityHallPrismaService,
    private readonly sourceHallPrismaService: SourcePrismaService,
  ) {}

  private async register(
    data: PatientQueryEntity[],
    importVersionId: string,
  ): Promise<{ imported: number; fail: number }> {
    let imported = 0;
    let fail = 0;
    for (const item of data) {
      try {
        if (item.id_paciente !== null && item.id_paciente !== undefined) {
          const data: Omit<
            PrismaSource.PatientCreateInput,
            "idPaciente" | "cityHallId"
          > = {
            importVersionId,
            coCidadao: item.co_cidadao,
            noCidadao: item.no_cidadao,
            dtNascimento: item.dt_nascimento,
            idade: item.idade,
            sexo: item.sexo,
            nuCns: item.cns,
            nuCpf: item.cpf,
            noMae: item.no_mae,
            statusCadastro: item.status_cadastro,
            fci: item.fci,
            respFamiliar: item.resp_familiar,
            logradouro: item.logradouro,
            nuLogradouro: item.nu_logradouro,
            bairro: item.bairro,
            cep: item.cep,
            contato: item.contato,
            nuMicroArea: item.nu_micro_area,
            idProfissional: item.id_profissional,
            noProfCad: item.no_prof_cad,
            cboAcs: item.cbo_acs,
            idUbs: item.id_ubs,
            idEquipe: item.id_equipe,
            noEquipe: item.no_equipe,
            duplicado: item.duplicado,
            stUnificado: item.st_unificado,
            nuCnes: item.nu_cnes,
          };

          await this.sourceHallPrismaService.patient.upsert({
            where: {
              idPaciente: item.id_paciente,
              cityHallId: this.IBGE_CODE,
            },
            update: {
              ...data,
              updatedAt: new Date(),
            },
            create: {
              ...data,
              idPaciente: item.id_paciente,
              cityHallId: this.IBGE_CODE,
            },
          });
          imported++;
        } else {
          this.logger.warn(`id_patient invalid: ${item.id_paciente}`);
          fail++;
        }
      } catch (err) {
        this.logger.error(
          "patient: " +
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
    return this.sourceHallPrismaService.patient.deleteMany({
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

    this.logger.log("Start import patients");

    const [{ count, min, max }] =
      (await this.cityHallPrismaService.$queryRawUnsafe(
        queryCountBuilder(queryPatient, "id_paciente"),
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
            queryPaginationByWhereBuilder(queryPatient, "id_paciente", {
              page,
              pageSize: this.PAGE_SIZE,
            }),
          )) as PatientQueryEntity[];

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
              `[import-patient] Progresso: ${nextMilestone}% Processados: ${processados} - Faltantes: ${faltantes}.`,
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
    this.logger.log(`Deleted outdated patients: ${deleted.count}`);
  }
}
