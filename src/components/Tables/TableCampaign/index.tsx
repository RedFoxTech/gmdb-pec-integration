import { TableHeader } from "@/components/common/Table";
import { BadgeCampaignStatus, Chip, Table, Text } from "@/components/common";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert as IconMoreVert } from "@mui/icons-material";
import { useState } from "react";
import dateUtils from "@/shared/date";
import { CampaignEntity } from "@/domain/entities/campaign";

export type TableCampaignProps = {
  data: CampaignEntity[];
  onClick?: (row: CampaignEntity, index?: number) => void;
  onEdit?: (row: CampaignEntity) => void;
  onStatusChange?: (row: CampaignEntity) => void;
};

const TableCampaign: React.FC<TableCampaignProps> = ({
  data,
  onClick,
  onStatusChange,
}) => {
  const [openMenu, setOpenMenu] = useState<string>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUpenMenu = (e: any, id: string) => {
    setAnchorEl(e.currentTarget);
    setOpenMenu(id);
    e.stopPropagation();
  };

  const tableHeader: TableHeader<CampaignEntity>[] = [
    {
      label: "Nome da Campanha",
      selector: (row) => row.title,
    },
    {
      label: "Dt. de Disparo",
      selector: (row) =>
        dateUtils(row.publicationDate).utc().format("DD/MM/YYYY"),
    },
    {
      label: "Segmento",
      selector: (row) => row.campaignTarget?.segment?.name,
      customComponent: ({ campaignTarget }) =>
        campaignTarget.segment ? (
          <Chip label={campaignTarget.segment.name} />
        ) : (
          <Text>-</Text>
        ),
    },
    {
      label: "Destinatários",
      selector: (row) => row.audienceSize,
    },
    {
      label: "Status",
      selector: (row) => row.campaignStatus,
      customComponent: (row) => (
        <BadgeCampaignStatus status={row.campaignStatus} />
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
            onClose={(e) => {
              (e as MouseEvent).stopPropagation();
              setOpenMenu(undefined);
            }}
          >
            {/* <MenuItem onClick={() => onEdit?.(row)}>Editar</MenuItem> */}
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange?.(row);
              }}
            >
              Alterar status
            </MenuItem>
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

export default TableCampaign;

export enum testId {
  TABLE = "TablePatients-table",
}
