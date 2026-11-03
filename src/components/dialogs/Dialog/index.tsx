"use client";

import {
  Dialog as MuiDialog,
  DialogContent,
  DialogActions,
  Box,
  useTheme,
  Typography,
  styled,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { PropsWithChildren, ReactElement } from "react";
import { Button } from "@/components/common";
import { Close } from "@mui/icons-material";
import typography from "@/shared/theme/typography-theme";

export type DialogProps = PropsWithChildren & {
  "data-testid"?: string;
  open: boolean;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  title?: string | ReactElement;
  noContentPadding?: boolean;
  actions?: boolean;
  persist?: boolean;
  message?: string;
  messageIcon?: ReactElement;
  contentHeight?: string;
  doneIcon?: ReactElement;
  cancelIcon?: ReactElement;
  doneText?: string;
  doneVariant?: "text" | "contained" | "outlined";
  cancelText?: string;
  isDoneLoading?: boolean;
  isCancelLoading?: boolean;
  isDoneDisabled?: boolean;
  isDoneHidden?: boolean;
  isCancelDisabled?: boolean;
  additionalAction?: ReactElement;
  formId?: string;
  hideClose?: boolean;
  hideSave?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onDone?: () => void;
};

const Dialog: React.FC<DialogProps> = ({
  "data-testid": dataTestid = "",
  open,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  title,
  noContentPadding,
  persist,
  message,
  messageIcon,
  actions,
  children,
  contentHeight,
  onClose,
  cancelIcon,
  doneIcon,
  additionalAction,
  cancelText,
  doneText,
  doneVariant = "contained",
  isCancelDisabled,
  isCancelLoading,
  isDoneDisabled,
  isDoneHidden,
  isDoneLoading,
  formId,
  hideClose,
  hideSave,
  onCancel,
  onDone,
}) => {
  const theme = useTheme();

  const handleClose = (reason: "backdropClick" | "escapeKeyDown") => {
    if (!persist || (persist && reason !== "backdropClick")) {
      onClose?.();
    }
  };

  return (
    <BootstrapDialog
      open={open}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      fullWidth
      onClose={(_, reason) => handleClose(reason)}
    >
      {title && (
        <DialogTitle id="alert-dialog-title" {...typography.title.h2l}>
          {title}
        </DialogTitle>
      )}
      {message && (
        <Box
          className="dialog-message"
          display={"flex"}
          gap={"1.25rem"}
          alignItems={"center"}
          p={"1.5rem"}
          bgcolor={theme.palette.grey[300]}
        >
          {messageIcon}
          <Typography fontSize={14} color={"#77787B"}>
            {message}
          </Typography>
        </Box>
      )}
      {!hideClose && (
        <IconButton
          aria-label="close"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={onClose}
        >
          <Close />
        </IconButton>
      )}
      <DialogContent
        style={{ padding: noContentPadding ? 0 : undefined }}
        sx={{ height: contentHeight }}
      >
        {children}
      </DialogContent>
      {actions && (
        <DialogActions style={{ padding: 0, paddingBottom: "2.4rem" }}>
          <Box
            borderTop={1}
            borderColor={theme.palette.grey[100]}
            width={"100%"}
            px={"1.5rem"}
            pt={"1rem"}
          >
            <Box
              className="dialog-action-decision"
              width="100%"
              display={"flex"}
              justifyContent="flex-end"
              gap="1.6rem"
            >
              {onCancel && (
                <Button
                  data-testid={`${dataTestid}-${testId.BUTTON_CANCEL}`}
                  variant="outlined"
                  startIcon={cancelIcon}
                  loading={isCancelLoading}
                  disabled={isCancelDisabled || isCancelLoading}
                  onClick={onCancel}
                >
                  {cancelText ?? "Cancelar"}
                </Button>
              )}
              {!hideSave && (onDone || formId || additionalAction) && (
                <Box display={"flex"} gap={"1.5rem"}>
                  {additionalAction}
                  {!isDoneHidden && (onDone || formId) && (
                    <Button
                      data-testid={`${dataTestid}-${testId.BUTTON_DONE}`}
                      type={formId ? "submit" : "button"}
                      form={formId}
                      variant={doneVariant}
                      startIcon={doneIcon}
                      loading={isDoneLoading}
                      disabled={isDoneDisabled || isDoneLoading}
                      sx={{ px: "2rem" }}
                      onClick={onDone}
                    >
                      {doneText ?? "OK"}
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </DialogActions>
      )}
    </BootstrapDialog>
  );
};

export default Dialog;

export enum testId {
  BUTTON_CANCEL = "DialogSecondary-cancel_button",
  BUTTON_DONE = "DialogSecondary-done_button",
}

const BootstrapDialog = styled(MuiDialog)(() => ({
  "& .MuiPaper-root": {
    width: "auto",
    maxWidth: "100%",
    paddingTop: "1.6rem",
  },
}));
