import { TableHeader } from "@/components/common/Table";
import { Chip, Table } from "@/components/common";
import { PatientEntity } from "@/domain/entities/patient";
import { ageRangeText, genderAbbreviation } from "@/shared/stringUtils";
import dateUtils from "@/shared/date";
import { Box } from "@mui/material";
import { SegmentList } from "@/shared/lists";

export type TablePatientsCapaignProps = {
  data: PatientEntity[];
  onClick?: (row: PatientEntity, index?: number) => void;
};

const TablePatientsCapaign: React.FC<TablePatientsCapaignProps> = ({
  data,
  onClick,
}) => {
  const tableHeader: TableHeader<PatientEntity>[] = [
    {
      label: "Nome",
      selector: (row) => row.name,
      minWidth: "200px",
    },
    {
      label: "Gênero",
      selector: (row) => genderAbbreviation(row.gender),
    },
    {
      label: "Fx. Etária",
      selector: (row) => ageRangeText(dateUtils().diff(row.birthdate, "year")),
    },
    {
      label: "ACS",
      selector: (row) => row.acs?.name ?? "ACS Não Identificada",
    },
    {
      label: "Segmento",
      selector: () => null,
      customComponent: () => <Chip label={SegmentList[0].name} />,
    },
    {
      label: "Etiquetas",
      selector: (row) => row.tags[0].tag.name,
      customComponent: (row) => (
        <Box>
          {row.tags.length > 0 ? (
            <>
              <Chip label={row.tags[0]?.tag.name} />
              {row.tags.length > 1 && (
                <Chip label={`+${row.tags.length - 1}`} />
              )}
            </>
          ) : (
            "-"
          )}
        </Box>
      ),
    },
  ];

  return (
    <div>
      <Table
        data-testid={testId.TABLE}
        tableAriaLabel="Tabela de pacientes"
        header={tableHeader}
        items={data}
        onClick={onClick}
      />
    </div>
  );
};

export default TablePatientsCapaign;

export enum testId {
  TABLE = "TablePatients-table",
}
