import { PaginationProps, TableHeader } from "@/components/common/Table";
import { Table } from "@/components/common";
import { UnitByVaccinationRankingEntity } from "@/domain/entities/unit";
import { decimalFormat, percentageByTotal } from "@/shared/numberUtils";

export type TableUnitsByVaccinationRankingProps = {
  data: UnitByVaccinationRankingEntity[];
  pagination?: PaginationProps;
  loading?: boolean;
  onClick?: (row: UnitByVaccinationRankingEntity, index?: number) => void;
};

const TableUnitsByVaccinationRanking: React.FC<
  TableUnitsByVaccinationRankingProps
> = ({ data, pagination, loading, onClick }) => {
  const tableHeader: TableHeader<UnitByVaccinationRankingEntity>[] = [
    {
      label: "UBS",
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
        tableAriaLabel="Tabela de unidades por ranking"
        header={tableHeader}
        items={data}
        pagination={pagination}
        columnLength={6}
        loading={loading}
        onClick={onClick}
      />
    </div>
  );
};

export default TableUnitsByVaccinationRanking;

export enum testId {
  TABLE = "TableUnitByVaccinationRanking-table",
}
