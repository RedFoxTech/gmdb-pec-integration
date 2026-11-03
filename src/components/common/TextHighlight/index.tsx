import { Box } from "@mui/material";
import Text from "../Text";
import theme from "@/shared/theme/material-theme";
import typography from "@/shared/theme/typography-theme";
import { ReactElement } from "react";

export type TextHighlightProps = {
  label?: string;
  color?: string;
  bgColor?: string;
  icon?: ReactElement;
  small?: boolean;
};

const TextHighlight: React.FC<TextHighlightProps> = ({
  label,
  color = theme.palette.primary.main,
  bgColor = theme.palette.primary.light,
  icon,
  small,
}) => (
  <Box
    bgcolor={bgColor}
    borderRadius={small ? "0.3rem" : "0.6rem"}
    p="0.25rem 0.2rem"
    width="fit-content"
  >
    <Box display="flex" alignItems="center" gap="0.4rem">
      {icon}
      {label && (
        <Text color={color} {...typography.paragraph.sb3}>
          {label}
        </Text>
      )}
    </Box>
  </Box>
);

export default TextHighlight;
