import theme from "@/shared/theme/material-theme";
import typography from "@/shared/theme/typography-theme";
import { Chip as MuiChip, ChipProps as MuiChipProps } from "@mui/material";

export type ChipProps = MuiChipProps & {
  textColor?: string;
};

const Chip: React.FC<ChipProps> = ({ sx, color, textColor, ...props }) => (
  <MuiChip
    {...props}
    color={color}
    sx={{
      bgcolor: color ?? theme.palette.primary.light,
      color: textColor ?? theme.palette.primary.main,
      ...typography.paragraph.l1,
      ...sx,
    }}
  />
);

export default Chip;
