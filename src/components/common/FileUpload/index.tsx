"use client";

import { Box, FormControl, FormHelperText, IconButton } from "@mui/material";
import React, { ReactNode, useState } from "react";
import Text from "../Text";
import { FileUploader } from "react-drag-drop-files";
import typography from "@/shared/theme/typography-theme";
import theme from "@/shared/theme/material-theme";
import {
  UploadFile as UploadFileIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { downloadFile } from "@/shared/file";

export type FileUploadValueProps = {
  name: string;
  size?: number;
  file?: File;
  url?: string;
};

export type FileUploadProps = {
  name?: string;
  value?: FileUploadValueProps;
  disabled?: boolean;
  types?: string[];
  maxSize?: number;
  helperText?: ReactNode;
  error?: boolean;
  onChange?: (value: File) => void;
  onDelete?: () => void;
};

const FileUpload: React.FC<FileUploadProps> = ({
  value,
  name,
  disabled,
  types,
  maxSize,
  helperText,
  error,
  onChange,
  onDelete,
}) => {
  const [resquestDelete, setRequestDelete] = useState(false);

  const handleChange = (file: File) => {
    setRequestDelete(false);
    onChange?.(file);
  };

  const handleDownload = () => {
    if (value?.file || value?.url) {
      downloadFile({ file: value.file, url: value.url, name: value.name });
    }
  };

  const handleDelete = () => {
    setRequestDelete(true);
    onDelete?.();
  };

  return (
    <FormControl error={error}>
      <Box>
        <Box
          p="1.6rem"
          sx={{
            border:
              value?.name && !resquestDelete
                ? undefined
                : `0.1rem dashed ${theme.palette.grey[200]}`,
          }}
          bgcolor={
            value?.name && !resquestDelete
              ? theme.palette.primary.light
              : "transparent"
          }
          display="flex"
          alignItems="center"
          borderRadius="0.4rem"
        >
          <Box flex={1}>
            <FileUploader
              name={name}
              disabled={disabled}
              types={types}
              maxSize={maxSize}
              handleChange={handleChange}
            >
              {(value?.file || value?.url) && !resquestDelete ? (
                <Box display="flex" alignItems="center" gap="1.6rem" flex={1}>
                  <UploadFileIcon
                    color="primary"
                    sx={{ width: "2.4rem", height: "2.4rem" }}
                  />
                  <Box>
                    <Text {...typography.paragraph.l1}>{value?.name}</Text>
                    {value.size && (
                      <Text color="#585357" {...typography.paragraph.l1}>
                        {value.size} • Complete
                      </Text>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="0.8rem"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="11.8rem"
                >
                  <UploadFileIcon
                    color="primary"
                    sx={{ width: "2.4rem", height: "2.4rem" }}
                  />
                  <Text {...typography.paragraph.l1}>
                    <Text
                      component="span"
                      {...typography.paragraph.l1}
                      color={theme.palette.primary.main}
                      sx={{ textDecoration: "underline" }}
                    >
                      Clique para fazer o upload
                    </Text>{" "}
                    ou arraste e solte
                  </Text>
                  <Text
                    {...typography.paragraph.l2}
                    color={theme.palette.grey[400]}
                  >
                    SVG, PNG, JPG or GIF (max. {maxSize}MB)
                  </Text>
                </Box>
              )}
            </FileUploader>
          </Box>
          {(value?.file || value?.url) && !resquestDelete && (
            <Box>
              <IconButton onClick={handleDelete}>
                <DeleteIcon
                  color="error"
                  sx={{ width: "2.4rem", height: "2.4rem" }}
                />
              </IconButton>
              <IconButton type="button" onClick={handleDownload}>
                <DownloadIcon
                  color="primary"
                  sx={{ width: "2.4rem", height: "2.4rem" }}
                />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default FileUpload;
