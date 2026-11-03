import { TableHeader } from "@/components/common/Table";
import { Table } from "@/components/common";
import { UserAdminEntity } from "@/domain/entities/user";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert as IconMoreVert } from "@mui/icons-material";
import { useState } from "react";

export type TableUsersProps = {
  data: UserAdminEntity[];
  onClick?: (row: UserAdminEntity, index?: number) => void;
  onEdit?: (row: UserAdminEntity, index?: number) => void;
};

const TableUsers: React.FC<TableUsersProps> = ({ data, onClick, onEdit }) => {
  const [openMenu, setOpenMenu] = useState<string>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUpenMenu = (e: any, id: string) => {
    setAnchorEl(e.currentTarget);
    setOpenMenu(id);
  };

  const tableHeader: TableHeader<UserAdminEntity>[] = [
    {
      label: "Nome",
      selector: (row) => row.name,
    },
    {
      label: "Email",
      selector: (row) => row.email,
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
          </Menu>
        </>
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

export default TableUsers;

export enum testId {
  TABLE = "TablePatients-table",
}
