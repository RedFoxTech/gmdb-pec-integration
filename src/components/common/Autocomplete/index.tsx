import {
  AutocompleteRenderInputParams,
  Box,
  Autocomplete as MuiAutocomplete,
  AutocompleteProps as MuiAutocompleteProps,
} from "@mui/material";
import Checkbox from "../Checkbox";
import TextField from "../TextField";
import Text from "../Text";
import { SelectOption } from "@/domain/entities/common";
import theme from "@/shared/theme/material-theme";
import { ReactNode, useRef } from "react";

export type AutocompleteProps<
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
> = Omit<
  MuiAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  "renderInput"
> & {
  options: SelectOption[];
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
  label?: string;
  required?: boolean;
  helperText?: ReactNode;
  error?: boolean;
};

const Autocomplete = <
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>({
  multiple,
  renderOption,
  renderInput,
  disableCloseOnSelect,
  label,
  required,
  helperText,
  error,
  ...props
}: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) => {
  // const [width, setWidth] = useState(0);
  const componentRef = useRef<HTMLDivElement>(null);

  const multipleText = (data: string[]) => {
    const width = componentRef.current?.offsetWidth || 0;
    console.log(width);
    if (!data || data.length === 0) {
      return "";
    }

    let text = data[0];

    // Estimate character width (approx 8px per character typically)
    // Reduce available width by padding/icons (approx 40px)
    const availableWidth = width - 20;
    const maxChars = Math.floor(availableWidth / 8);

    if (maxChars > 0 && text.length > maxChars) {
      text = text.substring(0, maxChars) + "...";
    }
    if (data.length >= 2) {
      text = `${text} +${data.length - 1}`;
    }
    return text;
  };

  return (
    <MuiAutocomplete
      {...props}
      multiple={multiple}
      disableCloseOnSelect={disableCloseOnSelect || multiple}
      renderOption={
        renderOption
          ? renderOption
          : multiple
            ? (props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      label={(option as SelectOption).label}
                      style={{ marginRight: "0.8rem" }}
                      checked={selected}
                    />
                  </li>
                );
              }
            : undefined
      }
      // renderTags={(value) =>
      //   multipleText(value.map((item) => (item as SelectOption).label))
      // }
      renderTags={(value) => (
        <div
          ref={componentRef}
          style={{
            display: "flex",
            alignItems: "center",
            width: "calc(100% - 36px)",
            zIndex: 999,
            position: "absolute",
            pointerEvents: "none",
          }}
        >
          {multipleText(value.map((item) => (item as SelectOption).label))}
        </div>
      )}
      renderInput={
        renderInput
          ? renderInput
          : (params) => (
              <TextField
                {...params}
                label={
                  <Box display="flex">
                    {label}
                    {required && (
                      <Text color={theme.palette.error.main}>*</Text>
                    )}
                  </Box>
                }
                helperText={helperText}
                error={error}
              />
            )
      }
    />
  );
};

export default Autocomplete;
