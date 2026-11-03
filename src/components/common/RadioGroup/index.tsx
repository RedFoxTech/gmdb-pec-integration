import { RadiosOptions } from "@/domain/entities/common";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  Radio,
} from "@mui/material";

export type RadioGroupProps = {
  value?: string | number;
  options: RadiosOptions[];
  row?: boolean;
  onChange?: (value?: string | number) => void;
};

const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  options,
  row,
  onChange,
}) => (
  <FormControl>
    <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
    <MuiRadioGroup
      value={value}
      row={row}
      onChange={(e) => onChange?.(e.target.value)}
    >
      {options.map((item) => (
        <FormControlLabel
          key={item.value}
          value={item.value}
          control={<Radio />}
          label={item.label}
        />
      ))}
    </MuiRadioGroup>
  </FormControl>
);

export default RadioGroup;
