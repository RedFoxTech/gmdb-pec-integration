import {
  Box,
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material";
import { forwardRef } from "react";
import { IMaskInput } from "react-imask";
import Text from "../Text";
import theme from "@/shared/theme/material-theme";

export type TextFieldProps = MuiTextFieldProps & {
  maskprops?: MaskProps;
  required?: boolean;
};

export type MaskProps = {
  mask?: any;
  definitions?: { [k: string]: any };
  blocks?: { [k: string]: any };
  scale?: number;
  thousandsSeparator?: string;
  padFractionalZeros?: boolean;
  normalizeZeros?: boolean;
  radix?: string;
  mapToRadix?: string[];
  min?: number;
  max?: number;
  autofix?: boolean;
  unmask?: boolean;
};

interface TextMaskCustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  maskprops: MaskProps;
}

const TextMaskCustom = forwardRef<HTMLInputElement, TextMaskCustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, maskprops, ...other } = props;
    return (
      <IMaskInput
        {...other}
        {...maskprops}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  }
);

const TextField: React.FC<TextFieldProps> = ({
  maskprops,
  slotProps,
  required,
  label,
  ...props
}) => {
  if (maskprops) {
    return (
      <MuiTextField
        {...props}
        slotProps={{
          ...slotProps,
          input: {
            ...slotProps?.input,
            inputComponent: TextMaskCustom as any,
          },
          htmlInput: {
            ...slotProps?.htmlInput,
            maskprops,
          },
        }}
        label={
          <Box display="flex">
            {label}
            {required && <Text color={theme.palette.error.main}>*</Text>}
          </Box>
        }
      />
    );
  }

  return (
    <MuiTextField
      {...props}
      slotProps={slotProps}
      label={
        <Box display="flex">
          {label}
          {required && <Text color={theme.palette.error.main}>*</Text>}
        </Box>
      }
    />
  );
};

export default TextField;
