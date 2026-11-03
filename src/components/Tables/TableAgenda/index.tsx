import { TableHeader } from "@/components/common/Table";
import { Table } from "@/components/common";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert as IconMoreVert } from "@mui/icons-material";
import { useState } from "react";
import { AgendaEntity } from "@/domain/entities/agenda";
import dateUtils from "@/shared/date";

export type TableAgendaProps = {
  data: AgendaEntity[];
  onClick?: (row: AgendaEntity, index?: number) => void;
  onEdit?: (row: AgendaEntity) => void;
  onDelete?: (row: AgendaEntity) => void;
};

const TableAgenda: React.FC<TableAgendaProps> = ({
  data,
  onClick,
  onDelete,
  onEdit,
}) => {
  const [openMenu, setOpenMenu] = useState<string>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUpenMenu = (e: any, id: string) => {
    setAnchorEl(e.currentTarget);
    setOpenMenu(id);
  };

  const tableHeader: TableHeader<AgendaEntity>[] = [
    {
      label: "Unid. Básica de Saúde (UBS)",
      selector: (row) =>
        `${row.unit.name} - ${row.unit.address}, ${row.unit.addressNumber}`,
    },
    {
      label: "Exame/Procedimento",
      selector: (row) => row.type,
    },
    {
      label: "Data",
      selector: (row) => dateUtils(row.date).utc().format("DD/MM/YYYY"),
    },
    {
      label: "Período",
      selector: (row) => row.period,
    },
    {
      label: "Vag. Disp.",
      selector: (row) => row.slots,
    },
    {
      label: "Vag. Ocup.",
      selector: (row) => row.slots - row.availableSlots,
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
            <MenuItem onClick={() => onEdit?.(row)}>Editar</MenuItem>
            <MenuItem onClick={() => onDelete?.(row)}>Excluir</MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <div>
      <Table
        data-testid={testId.TABLE}
        tableAriaLabel="Tabela de agendas"
        header={tableHeader}
        items={data}
        onClick={onClick}
      />
    </div>
  );
};

export default TableAgenda;

export enum testId {
  TABLE = "TablePatients-table",
}
