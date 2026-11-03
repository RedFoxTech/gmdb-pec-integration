"use client";

import { createContext } from "react";

export enum SnackbarType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export type SnackBarContentActionProps = {
  text: string;
  onClick: () => void;
};

export type SnackBarContentProps = {
  show: boolean;
  message: string;
  type: SnackbarType;
  action?: SnackBarContentActionProps;
};

export interface SnackbarContextType {
  showSnackBar?: (data: {
    message: string;
    type?: SnackbarType;
    action?: SnackBarContentActionProps;
  }) => void;
}

export const SnackbarContext = createContext<SnackbarContextType>({});
