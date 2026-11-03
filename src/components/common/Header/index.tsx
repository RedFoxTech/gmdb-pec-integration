"use client";

import {
  Avatar,
  Box,
  ButtonBase,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
  MenuProps,
} from "@mui/material";
import { styled } from "@mui/system";
import { Menu as MenuIcon, KeyboardArrowDown } from "@mui/icons-material";
import Image from "next/image";
import { CSSProperties, useState } from "react";
import { Button, Text } from "@/components/common";
import typography from "@/shared/theme/typography-theme";
import { useAuth, useAuthUser } from "@/hooks";
import { getNameFirst2Letters } from "@/shared/stringUtils";

export type HeaderProps = {
  onToogleDrawer: () => void;
};

export const HEADER_HEIGHT = "6.4rem";

const Header: React.FC<HeaderProps> = ({ onToogleDrawer }) => {
  const theme = useTheme();
  const { authUser } = useAuthUser();
  const { logoutUser } = useAuth();

  const [profileMenuEl, setProfileMenuEl] = useState<null | HTMLElement>(null);

  const isSmallerThanMd = useMediaQuery("(max-width:1122px)");

  const avatarCssProps: CSSProperties = (() => {
    if (isSmallerThanMd) {
      return {
        height: 35,
        width: 35,
        fontSize: 14,
      };
    }

    return {};
  })();

  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    onToogleDrawer();
  };

  const toggleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuEl(event.currentTarget);
  };

  return (
    <>
      <Box
        display="flex"
        bgcolor={theme.palette.primary.main}
        height={HEADER_HEIGHT}
        alignItems="center"
        justifyContent="space-between"
        px="4rem"
        position="fixed"
        width="100%"
        zIndex={10}
      >
        {isSmallerThanMd && <Box />}
        <Box display="flex" alignItems="center" gap="1.6rem">
          <IconButton aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon sx={{ fontSize: "3rem", color: "#FFFFFF" }} />
          </IconButton>
          <Typography fontWeight={"2"} />
          <Box display="flex" alignItems="center" gap="0.1rem">
            <Image
              src="/icons/logo.svg"
              width={59}
              height={49}
              alt="logo"
              quality={100}
            />
            <Text {...typography.title.h3l} color={theme.palette.white.main}>
              Grupo Mulheres do Brasil
            </Text>
          </Box>
        </Box>
        <div>
          <ButtonBase
            data-testid={testId.USER_MENU}
            sx={{
              height: "100%",
            }}
            onClick={(e) => toggleProfileMenu(e)}
          >
            <Box display="flex" alignItems="center" gap="0.8rem">
              <Avatar
                sx={{
                  bgcolor: theme.palette.white.main,
                  color: theme.palette.primary.main,
                  ...avatarCssProps,
                }}
              >
                {authUser?.name ? getNameFirst2Letters(authUser?.name) : ""}
              </Avatar>
              {!isSmallerThanMd && (
                <KeyboardArrowDown
                  sx={{ color: "#fff", width: "2rem", height: "2rem" }}
                />
              )}
            </Box>
          </ButtonBase>
          <StyledMenu
            anchorEl={profileMenuEl}
            open={!!profileMenuEl}
            onClose={() => setProfileMenuEl(null)}
          >
            <Box display={"flex"} flexDirection={"column"} gap={"0.5rem"}>
              <Button variant="text" fullWidth onClick={logoutUser}>
                Sair
              </Button>
            </Box>
          </StyledMenu>
          {/* )} */}
        </div>
      </Box>
    </>
  );
};

export default Header;

export enum testId {
  TAB_HOME = "Header-home-tab",
  TAB_RELEASE_HISTORY = "Header-release-history-tab",
  TAB_SETTINGS = "Header-settings-tab",
  TAB_EMERGENCY_MEDICATION = "Header-emergency-medication-tab",
  USER_MENU = "Header-user-menu",
}

const StyledMenu = styled((props: MenuProps) => <Menu {...props} />)(() => ({
  "& .MuiPaper-root": {
    borderRadius: 0,
    marginTop: "1rem",
    marginLeft: "-1rem",
    width: "14.38rem",
    boxShadow: "0px 4px 4px 0px #00000040",
  },
}));
