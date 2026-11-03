import { PaginationProps, TableHeader } from "@/components/common/Table";
import {
  BadgeAppointmentScheduleStatus,
  BadgeAppointmentStatus,
  Table,
} from "@/components/common";
import {
  ageRangeEarlyDetection,
  genderAbbreviation,
} from "@/shared/stringUtils";
import dateUtils from "@/shared/date";
import { cpfMask } from "@/shared/mask";
import { ExamEntity } from "@/domain/entities/exam";

export type TableEarlyDetectionProps = {
  data: ExamEntity[];
  pagination?: PaginationProps;
  loading?: boolean;
  onClick?: (row: ExamEntity, index?: number) => void;
  onSelect?: (data: ExamEntity[]) => void;
};

const TableEarlyDetection: React.FC<TableEarlyDetectionProps> = ({
  data,
  pagination,
  loading,
  onClick,
  onSelect,
}) => {
  const tableHeader: TableHeader<ExamEntity>[] = [
    {
      label: "Nome",
      selector: (row) => row.patient.name,
      minWidth: "200px",
    },
    {
      label: "CPF",
      selector: (row) => cpfMask(row.patient.document),
      minWidth: "250px",
    },
    {
      label: "Gênero",
      selector: (row) => genderAbbreviation(row.patient.gender),
    },
    {
      label: "Faixa Etária",
      selector: (row) =>
        ageRangeEarlyDetection(dateUtils().diff(row.patient.birthdate, "year")),
    },
    {
      label: "ACS",
      selector: (row) => row.patient.acs?.name ?? "ACS Não Identificada",
    },
    {
      label: "Status do Exame",
      selector: (row) => row.status,
      customComponent: (row) => <BadgeAppointmentStatus status={row.status} />,
    },
    {
      label: "Status do Agendamento",
      selector: (row) => row.scheduleStatus,
      customComponent: (row) => (
        <BadgeAppointmentScheduleStatus status={row.scheduleStatus} />
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
        customId="patientPecId"
        pagination={pagination}
        loading={loading}
        columnLength={7}
        onClick={onClick}
        onSelectItem={onSelect}
      />
    </div>
  );
};

export default TableEarlyDetection;

export enum testId {
  TABLE = "TablePatients-table",
}
