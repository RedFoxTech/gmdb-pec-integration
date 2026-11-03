"use client";

import { PropsWithChildren } from "react";
import theme from "@/shared/theme/material-theme";
import { ThemeProvider } from "@mui/material";

const ThemeClient: React.FC<PropsWithChildren> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default ThemeClient;
