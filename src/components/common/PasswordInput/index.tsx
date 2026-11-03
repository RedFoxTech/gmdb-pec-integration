"use client";

import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";
import TextInput, { TextFieldProps } from "../TextField";

const PasswordInput: React.FC<TextFieldProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <TextInput
      {...props}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                style={{ marginRight: 5 }}
              >
                {showPassword ? (
                  <VisibilityOffOutlined color="inherit" />
                ) : (
                  <VisibilityOutlined color="inherit" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
        ...props.slotProps,
      }}
      type={showPassword ? "text" : "password"}
    />
  );
};

export default PasswordInput;
