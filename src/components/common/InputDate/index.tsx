"use client";

import React, { ReactNode } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { Box, Typography } from "@mui/material";
import Text from "../Text";
import { Dayjs } from "dayjs";
import { CalendarTodayOutlined } from "@mui/icons-material";
import "dayjs/locale/pt-br";
import theme from "@/shared/theme/material-theme";
import typography from "@/shared/theme/typography-theme";

export type InputDateProps = DatePickerProps<Dayjs, boolean> & {
  fullWidth?: boolean;
  errorMessage?: string;
  required?: boolean;
  helperText?: ReactNode;
  error?: boolean;
  size?: "small" | "medium";
};

const InputDate: React.FC<InputDateProps> = ({
  fullWidth,
  errorMessage,
  sx,
  required,
  label,
  helperText,
  error,
  slotProps,
  size,
  ...props
}) => {
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <DatePicker
          slots={{
            openPickerIcon: CalendarTodayOutlined,
          }}
          sx={{
            width: fullWidth ? "100%" : undefined,
            ...sx,
          }}
          label={
            <Box display="flex">
              {label}
              {required && <Text color={theme.palette.error.main}>*</Text>}
            </Box>
          }
          slotProps={{
            ...slotProps,
            textField: {
              error,
              helperText,
              size,
              ...slotProps?.textField,
            },
          }}
          {...props}
        />
      </LocalizationProvider>
      {errorMessage && (
        <Typography
          color={theme.palette.error.main}
          {...typography.paragraph.l2}
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default InputDate;
