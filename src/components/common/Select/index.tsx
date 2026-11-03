import { SelectOption } from "@/domain/entities/common";
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
} from "@mui/material";
import Checkbox from "../Checkbox";
import Text from "../Text";
import theme from "@/shared/theme/material-theme";
import { ReactNode } from "react";

export type SelectProps = MuiSelectProps & {
  options: SelectOption[];
  required?: boolean;
  helperText?: ReactNode;
  error?: boolean;
};

const Select: React.FC<SelectProps> = ({
  value = "",
  options,
  multiple,
  label,
  labelId,
  required,
  helperText,
  error,
  size,
  ...props
}) => {
  const multipleText = (data?: Array<string | number | undefined>) => {
    if (!data || data.length === 0) {
      return "";
    }

    const selectedItems = options
      .filter((item) =>
        (data as Array<string | number | undefined | null>).includes(item.value)
      )
      .map((item) => item.label);

    if (selectedItems.length === 1) {
      return selectedItems[0];
    }

    return `${selectedItems[0]}, ...+${selectedItems.length - 1}`;
  };

  return (
    <FormControl error={error}>
      <InputLabel id={labelId} size={size === "medium" ? "normal" : "small"}>
        <Box display="flex">
          {label}
          {required && <Text color={theme.palette.error.main}>*</Text>}
        </Box>
      </InputLabel>
      <MuiSelect
        multiple={multiple}
        value={value}
        labelId={labelId}
        size={size}
        renderValue={(selected) =>
          multiple
            ? multipleText(selected as Array<string | number | undefined>)
            : options.find((item) => item.value === selected)?.label
        }
        {...props}
      >
        {options.map((item) => (
          <MenuItem key={item.value} value={item.value as any}>
            {multiple && (
              <Checkbox
                checked={(
                  value as Array<string | number | undefined | null>
                ).includes(item.value)}
              />
            )}
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default Select;
