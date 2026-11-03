"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Drawer as MuiDrawer,
} from "@mui/material";
import Text from "../Text";
import { HEADER_HEIGHT } from "../Header";
import {
  ExpandMore as ExpandMoreIcon,
  HealthAndSafetyOutlined as HealthAndSafetyOutlinedIcon,
  CampaignOutlined as CampaignOutlinedIcon,
  CalendarMonthOutlined as CalendarMonthOutlinedIcon,
  PersonAdd as PersonAddIcon,
  TravelExplore as TravelExploreIcon,
  SvgIconComponent,
} from "@mui/icons-material";
import typography from "@/shared/theme/typography-theme";
import theme from "@/shared/theme/material-theme";
import { usePathname, useRouter } from "next/navigation";
import { PageEnum } from "@/domain/consts";

export type DrawerProps = {
  open: boolean;
  onToggle: () => void;
};

export type MenuItemProps = {
  label: string;
  link: string;
  followLinks?: string[];
  disabled?: boolean;
};

export type MenuProps = {
  label: string;
  icon: SvgIconComponent;
  items?: MenuItemProps[];
  link?: string;
};

export const DRAWER_WIDTH = "27.1rem";

const Drawer: React.FC<DrawerProps> = ({ open, onToggle }) => {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (path: string) => {
    router.push(path);
  };

  const activeSectionLink = (data: MenuProps) => {
    if (data.items) {
      return data.items?.some((item) => item.link === pathname);
    }
    return data.link === pathname;
  };

  const activeSubSectionLink = (data: MenuItemProps) => {
    return (
      data.link === pathname ||
      data.followLinks?.some((item) => item === pathname)
    );
  };

  return (
    <MuiDrawer
      variant="persistent"
      open={open}
      anchor="left"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        zIndex: open ? 2 : -99,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
        },
      }}
      onClose={onToggle}
    >
      <Box paddingTop={HEADER_HEIGHT}>
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.items ? (
              <Accordion
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  "&.Mui-disabled": { backgroundColor: "transparent" },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      fontSize="large"
                      sx={{
                        color: activeSectionLink(item)
                          ? theme.palette.primary.main
                          : "#717171",
                      }}
                    />
                  }
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Box
                    display="flex"
                    gap="1rem"
                    alignItems="center"
                    px="0.8rem"
                  >
                    <item.icon
                      sx={{
                        width: "2.4rem",
                        height: "2.4rem",
                        color: activeSectionLink(item)
                          ? theme.palette.primary.main
                          : "#717171",
                      }}
                    />
                    <Text
                      component="span"
                      color={
                        activeSectionLink(item)
                          ? theme.palette.primary.main
                          : "#717171"
                      }
                      {...typography.paragraph.l1}
                    >
                      {item.label}
                    </Text>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {item.items.map((menuItem) => (
                    <ListItem key={menuItem.label} disablePadding>
                      <ListItemButton
                        disabled={menuItem.disabled}
                        selected={activeSubSectionLink(menuItem)}
                        sx={{
                          borderRadius: "0.8rem",
                          pl: "5.8rem",
                          pr: "1.6rem",
                        }}
                        onClick={() => navigate(menuItem.link)}
                      >
                        <Text
                          color={
                            activeSubSectionLink(menuItem)
                              ? theme.palette.primary.main
                              : "#717171"
                          }
                          {...typography.paragraph.sb1}
                        >
                          {menuItem.label}
                        </Text>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </AccordionDetails>
              </Accordion>
            ) : (
              <ListItem disablePadding sx={{ px: "0.8rem" }}>
                <ListItemButton
                  selected={activeSectionLink(item)}
                  sx={{ borderRadius: "0.8rem" }}
                  onClick={() => navigate(item.link ?? "")}
                >
                  <ListItemIcon
                    sx={{ minWidth: "2.4rem", marginRight: "1rem" }}
                  >
                    <item.icon
                      sx={{
                        width: "2.4rem",
                        height: "2.4rem",
                        color: activeSectionLink(item)
                          ? theme.palette.primary.main
                          : "#717171",
                      }}
                    />
                  </ListItemIcon>
                  <Text
                    color={
                      activeSectionLink(item)
                        ? theme.palette.primary.main
                        : "#717171"
                    }
                    {...typography.paragraph.l1}
                  >
                    {item.label}
                  </Text>
                </ListItemButton>
              </ListItem>
            )}
          </div>
        ))}
      </Box>
    </MuiDrawer>
  );
};

export default Drawer;

export const menuItems: MenuProps[] = [
  {
    label: "Painel tático",
    icon: TravelExploreIcon,
    items: [
      {
        label: "Resumo",
        link: PageEnum.PANEL,
      },
      {
        label: "Taxa de mortalidade",
        link: PageEnum.PANEL_MORTALITY_RATE,
        disabled: true,
      },
      {
        label: "Cobertura vacinal (HPV)",
        link: PageEnum.PANEL_VACINNATION_COVERAGE,
      },
      {
        label: "Detecção precoce",
        link: PageEnum.PANEL_EARLY_DETECTION,
      },
      {
        label: "Encaminhamento",
        link: "",
        disabled: true,
      },
      {
        label: "Desfecho",
        link: "",
        disabled: true,
      },
    ],
  },
  {
    label: "Gestão do paciente",
    icon: HealthAndSafetyOutlinedIcon,
    items: [
      {
        label: "Vacinação HPV",
        link: PageEnum.PATIENT_MANAGEMENT_VACCINATION_HPV,
      },
      {
        label: "Detecção precoce",
        link: PageEnum.PATIENT_MANAGEMENT_EARLY_DETECTION,
      },
    ],
  },
  {
    label: "Campanhas",
    icon: CampaignOutlinedIcon,
    items: [
      {
        label: "Navegador virtual de campanhas",
        link: PageEnum.CAMPAIGNS,
        followLinks: [PageEnum.NEW_CAMPAIGNS],
      },
    ],
  },
  {
    label: "Agenda",
    icon: CalendarMonthOutlinedIcon,
    items: [
      {
        label: "Criar agenda",
        link: PageEnum.AGENDA,
      },
      {
        label: "Agendamentos",
        link: PageEnum.SCHEDULINGS,
      },
    ],
  },
  {
    label: "Usuários",
    icon: PersonAddIcon,
    link: PageEnum.USERS,
  },
];
