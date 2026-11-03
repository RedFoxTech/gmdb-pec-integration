import typography from "@/shared/theme/typography-theme";
import {
  FormControlLabel,
  Checkbox as BaseCheckbox,
  CheckboxProps as BaseCheckboxProps,
} from "@mui/material";

export type CheckboxProps = BaseCheckboxProps & {
  label?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  size = "large",
  ...props
}) => (
  <FormControlLabel
    control={<BaseCheckbox size={size} {...props} />}
    label={label}
    sx={{ span: { color: "#5F5F5F", ...typography.paragraph.r2 } }}
  />
);

export default Checkbox;
