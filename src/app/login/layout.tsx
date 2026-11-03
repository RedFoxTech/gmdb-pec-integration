"use client";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Fragment } from "react";

type LoginLayoutProps = {
  children: React.ReactNode;
};

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Fragment>
      <Box height="100%" bgcolor="#FAF9DA">
        <Box height="100%" overflow="hidden" position="absolute" zIndex={0}>
          <Box component="img" src="/images/login-illustration.png" />
        </Box>
        <Box
          position="relative"
          mx={matches ? "8.1rem" : undefined}
          maxWidth="42rem"
          width="100%"
          ml={matches ? "auto" : undefined}
          margin={!matches ? "auto" : undefined}
          display="flex"
          alignItems="center"
          height="100%"
          zIndex={1}
        >
          <Box
            bgcolor={theme.palette.white.main}
            p="2.4rem"
            borderRadius="0.8rem"
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
};

export default LoginLayout;
