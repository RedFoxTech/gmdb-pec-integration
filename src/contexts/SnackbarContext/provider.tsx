"use client";

import React, { PropsWithChildren, useState } from "react";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import {
  SnackBarContentActionProps,
  SnackBarContentProps,
  SnackbarContext,
  SnackbarType,
} from ".";
import typography from "@/shared/theme/typography-theme";
import theme from "@/shared/theme/material-theme";
import { Button } from "@/components/common";

const snackDefaultValue: SnackBarContentProps = {
  show: false,
  message: "",
  type: SnackbarType.INFO,
  action: undefined,
};

const snackSeverity = {
  [SnackbarType.SUCCESS]: "success",
  [SnackbarType.ERROR]: "error",
  [SnackbarType.WARNING]: "warning",
  [SnackbarType.INFO]: "info",
};

const SnackbarProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [snackData, setSnackData] =
    useState<SnackBarContentProps>(snackDefaultValue);

  const showSnackBar = (data: {
    message: string;
    type?: SnackbarType;
    action?: SnackBarContentActionProps;
  }) => {
    setSnackData({
      show: true,
      message: data.message,
      type: data.type || SnackbarType.INFO,
      action: data.action,
    });
  };

  return (
    <SnackbarContext.Provider
      value={{
        showSnackBar,
      }}
    >
      <>
        <Snackbar
          data-testid={testId}
          open={snackData.show}
          autoHideDuration={6000}
          onClose={() => setSnackData(snackDefaultValue)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackData(snackDefaultValue)}
            severity={snackSeverity[snackData.type] as AlertColor}
            sx={{
              width: "100%",
              ...typography.paragraph.r1,
              bgcolor: theme.palette[snackData.type].light,
              color: theme.palette[snackData.type].main,
            }}
            action={
              snackData.action && (
                <Button
                  variant="text"
                  color={snackData.type}
                  onClick={snackData.action.onClick}
                >
                  {snackData.action.text}
                </Button>
              )
            }
          >
            {snackData.message}
          </Alert>
        </Snackbar>
        {children}
      </>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;

export enum testId {
  SNACKBAR = "SnackbarProvider-snackbar",
}
