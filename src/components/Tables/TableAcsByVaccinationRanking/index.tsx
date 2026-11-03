import { PaginationProps, TableHeader } from "@/components/common/Table";
import { Table } from "@/components/common";
import { decimalFormat, percentageByTotal } from "@/shared/numberUtils";
import { AcsByVaccinationRankingEntity } from "@/domain/entities/acs";

export type TableAcsByVaccinationRankingProps = {
  data: AcsByVaccinationRankingEntity[];
  pagination?: PaginationProps;
  loading?: boolean;
  onClick?: (row: AcsByVaccinationRankingEntity, index?: number) => void;
};

const TableAcsByVaccinationRanking: React.FC<
  TableAcsByVaccinationRankingProps
> = ({ data, pagination, loading, onClick }) => {
  const tableHeader: TableHeader<AcsByVaccinationRankingEntity>[] = [
    {
      label: "ACS",
      selector: (row) => row.name,
    },
    {
      label: "Vacinados",
      selector: (row) => row.vaccinated,
    },
    {
      label: "Não Vacinados",
      selector: (row) => row.notVaccinated,
    },
    {
      label: "Total",
      selector: (row) => row.vaccinated + row.notVaccinated,
    },
    {
      label: "Vacinados (%)",
      selector: (row) =>
        `${
          row.vaccinated > 0
            ? decimalFormat(
                percentageByTotal(
                  row.vaccinated,
                  row.vaccinated + row.notVaccinated
                )
              )
            : 0
        }%`,
    },
    {
      label: "Ranking",
      selector: (row) => row.position,
    },
  ];

  return (
    <div>
      <Table
        data-testid={testId.TABLE}
        tableAriaLabel="Tabela de acs's por ranking"
        header={tableHeader}
        items={data}
        pagination={pagination}
        loading={loading}
        columnLength={6}
        onClick={onClick}
      />
    </div>
  );
};

export default TableAcsByVaccinationRanking;

export enum testId {
  TABLE = "TableAcsByVaccinationRanking-table",
}
