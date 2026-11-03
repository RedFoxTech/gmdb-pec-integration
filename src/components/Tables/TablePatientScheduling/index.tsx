import { TableHeader } from "@/components/common/Table";
import { BadgePatientSchedulingStatus, Table } from "@/components/common";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert as IconMoreVert } from "@mui/icons-material";
import { useState } from "react";
import dateUtils from "@/shared/date";
import { PatientSchedulingEntity } from "@/domain/entities/patient-scheduling";
import { PatientSchedulingStatus } from "@/domain/consts";

export type TablePatientSchedulingProps = {
  data: PatientSchedulingEntity[];
  onClick?: (row: PatientSchedulingEntity, index?: number) => void;
  onDelete?: (row: PatientSchedulingEntity) => void;
  onCompleteAppointment?: (row: PatientSchedulingEntity) => void;
};

const TablePatientScheduling: React.FC<TablePatientSchedulingProps> = ({
  data,
  onClick,
  onDelete,
  onCompleteAppointment,
}) => {
  const [openMenu, setOpenMenu] = useState<string>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUpenMenu = (e: any, id: string) => {
    setAnchorEl(e.currentTarget);
    setOpenMenu(id);
  };

  const tableHeader: TableHeader<PatientSchedulingEntity>[] = [
    {
      label: "Nome do Paciente",
      selector: (row) => row.patient?.name ?? row.name,
    },
    {
      label: "CPF",
      selector: (row) => row.patient?.document ?? row.document,
    },
    {
      label: "Dt. Agend.",
      selector: (row) => dateUtils(row.agenda.date).utc().format("DD/MM/YYYY"),
    },
    {
      label: "Turno",
      selector: (row) => row.agenda.period,
    },
    {
      label: "Tipo de agenda",
      selector: (row) => row.agenda.type,
    },
    {
      label: "Status",
      selector: (row) => row.schedulingStatus,
      customComponent: (row) => (
        <BadgePatientSchedulingStatus status={row.schedulingStatus} />
      ),
    },
    {
      label: "",
      selector: () => null,
      customComponent: (row) => (
        <>
          <IconButton id={row.id} onClick={(e) => handleUpenMenu(e, row.id)}>
            <IconMoreVert />
          </IconButton>
          <Menu
            id={row.id}
            open={openMenu === row.id}
            anchorEl={anchorEl}
            onClose={() => setOpenMenu(undefined)}
          >
            <MenuItem onClick={() => onDelete?.(row)}>Excluir</MenuItem>
            {row.schedulingStatus !==
              PatientSchedulingStatus.APPOITNEMNT_PERFORMED && (
              <MenuItem onClick={() => onCompleteAppointment?.(row)}>
                Consulta realizada
              </MenuItem>
            )}
          </Menu>
        </>
      ),
    },
  ];

  return (
    <div>
      <Table
        data-testid={testId.TABLE}
        tableAriaLabel="Tabela de agendamentos"
        header={tableHeader}
        items={data}
        onClick={onClick}
      />
    </div>
  );
};

export default TablePatientScheduling;

export enum testId {
  TABLE = "TablePatients-table",
}
