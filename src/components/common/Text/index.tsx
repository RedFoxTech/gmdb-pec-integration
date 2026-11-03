import typography from "@/shared/theme/typography-theme";
import { Typography, TypographyProps } from "@mui/material";
import React from "react";

export type TextProp = TypographyProps;

const Text: React.FC<TextProp> = ({
  fontSize,
  lineHeight,
  fontWeight,
  ...props
}) => (
  <Typography
    fontSize={fontSize || typography.paragraph.r1.fontSize}
    lineHeight={lineHeight || typography.paragraph.r1.lineHeight}
    fontWeight={fontWeight || typography.paragraph.r1.fontWeight}
    {...props}
  />
);

export default Text;
