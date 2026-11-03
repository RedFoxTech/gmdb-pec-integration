"use client";

import {
  CircularProgress,
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  styled,
} from "@mui/material";
import React from "react";

export type ButtonProps = MuiButtonProps & {
  loading?: boolean;
};

const StyledButton = styled(MuiButton)(() => ({
  minWidth: "7rem",
}));

const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  variant = "contained",
  ...props
}) => (
  <StyledButton variant={variant} size="large" {...props}>
    {loading ? (
      <CircularProgress
        color="inherit"
        style={{ marginLeft: "10px" }}
        size={"20px"}
      />
    ) : (
      children
    )}
  </StyledButton>
);

export default Button;
