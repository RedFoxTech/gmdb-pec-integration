"use client";

import { Drawer, Header } from "@/components/common";
import { DRAWER_WIDTH } from "@/components/common/Drawer";
import { HEADER_HEIGHT } from "@/components/common/Header";
import { LocalStorageKeys, PageEnum } from "@/domain/consts";
import { Box, styled } from "@mui/material";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";

const PATH_BLACK_LIST = [
  PageEnum.LOGIN,
  PageEnum.NOT_CONSENT_TERMS,
  PageEnum.EXAM_SCHEDULING,
];

const MainSection: React.FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const hideBases = PATH_BLACK_LIST.some((item) => pathname.includes(item));

  useEffect(() => {
    setTimeout(() => {
      const cityHallName = localStorage.getItem(LocalStorageKeys.CITY_HALL);
      if (cityHallName) {
        window.clarity?.("set", LocalStorageKeys.CITY_HALL, cityHallName);
      }
    }, 500);
  }, []);

  return (
    <Box width="100%">
      {!hideBases && (
        <Header onToogleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />
      )}
      <Box display="flex">
        <Drawer
          open={isDrawerOpen && !hideBases}
          onToggle={() => setIsDrawerOpen(false)}
        />
        <Main
          open={isDrawerOpen && !hideBases}
          sx={{
            minHeight: "100vh",
            paddingTop: hideBases ? 0 : `calc(${HEADER_HEIGHT} + 2rem)`,
            paddingLeft: hideBases ? 0 : "2rem",
            paddingRight: hideBases ? 0 : "0.5rem",
          }}
        >
          {children}
        </Main>
      </Box>
    </Box>
  );
};

export default MainSection;

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.white.main,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${DRAWER_WIDTH}`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));
