import { TableHeader } from "@/components/common/Table";
import { Table } from "@/components/common";
import dateUtils from "@/shared/date";
import { ExamAppointmentEntity } from "@/domain/entities/exam";

export type TableExamAppointmentsProps = {
  data: ExamAppointmentEntity[];
  loading?: boolean;
};

const TableExamAppointments: React.FC<TableExamAppointmentsProps> = ({
  data,
  loading,
}) => {
  const tableHeader: TableHeader<ExamAppointmentEntity>[] = [
    {
      label: "Nome",
      selector: (row) => dateUtils(row.agendaAt).format("DD/MM/YYYY"),
    },
    {
      label: "Exame",
      selector: () => "Citopatologia",
    },
  ];

  return (
    <div>
      <Table
        data-testid={testId.TABLE}
        tableAriaLabel="Tabela de agendamento de exames"
        header={tableHeader}
        items={data}
        loading={loading}
        columnLength={2}
      />
    </div>
  );
};

export default TableExamAppointments;

export enum testId {
  TABLE = "TableExamAppoitments-table",
}
