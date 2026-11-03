import { PaginationProps, TableHeader } from "@/components/common/Table";
import { BadgeVaccinationConsentStatus, Table } from "@/components/common";
import { PatientEntity } from "@/domain/entities/patient";
import { ageRangeText, genderAbbreviation } from "@/shared/stringUtils";
import dateUtils from "@/shared/date";
import { cpfMask } from "@/shared/mask";
import { SegmentEnum, VaccinationConsentStatusEnum } from "@/domain/consts";

export type TablePatientsProps = {
  data: PatientEntity[];
  segment: SegmentEnum;
  selectedPatients?: PatientEntity[];
  pagination?: PaginationProps;
  loading?: boolean;
  onClick?: (row: PatientEntity, index?: number) => void;
  onSelect?: (data: PatientEntity[]) => void;
};

const TablePatients: React.FC<TablePatientsProps> = ({
  data,
  segment,
  selectedPatients,
  pagination,
  loading,
  onClick,
  onSelect,
}) => {
  const tableHeader: TableHeader<PatientEntity>[] = [
    {
      label: "Nome da Criança",
      selector: (row) => row.name,
      minWidth: "200px",
    },
    {
      label: "CPF",
      selector: (row) => (row.document ? cpfMask(row.document) : "--"),
      minWidth: "250px",
    },
    {
      label: "Gênero",
      selector: (row) => genderAbbreviation(row.gender),
    },
    {
      label: "Faixa Etária",
      selector: (row) => ageRangeText(dateUtils().diff(row.birthdate, "year")),
    },
    {
      label: "ACS",
      selector: (row) => row.acs?.name ?? "ACS Não Identificada",
    },
    {
      label: "Status do Consentimento",
      selector: (row) =>
        row.consents.find((item) => item.segment.id === segment)
          ?.consentStatus ?? "--",
      customComponent: (row) => (
        <BadgeVaccinationConsentStatus
          status={
            row.consents.find((item) => item.segment.id === segment)
              ?.consentStatus ?? VaccinationConsentStatusEnum.PENDING
          }
        />
      ),
    },
  ];

  return (
    <div>
      <Table
        data-testid={testId.TABLE}
        customId="patientPecId"
        tableAriaLabel="Tabela de pacientes"
        header={tableHeader}
        items={data}
        checkboxSelection
        pagination={pagination}
        selectedItems={selectedPatients}
        columnLength={7}
        loading={loading}
        onClick={onClick}
        onSelectItem={onSelect}
      />
    </div>
  );
};

export default TablePatients;

export enum testId {
  TABLE = "TablePatients-table",
}
