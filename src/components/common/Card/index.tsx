"use client";

import theme from "@/shared/theme/material-theme";
import { Box, BoxProps } from "@mui/material";

export type CardProps = BoxProps & {
  noBoder?: boolean;
  bgcolor?: string;
};

const Card: React.FC<CardProps> = ({ children, sx, noBoder, ...props }) => (
  <Box
    p="1.5rem"
    borderRadius="0.8rem"
    sx={{
      border: `${noBoder ? 0 : "0.1rem"} solid ${theme.palette.grey[200]}`,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Box>
);

export default Card;
