"use client";
import { createTheme } from "@mui/material/styles";

// import { ptBR } from '@mui/x-data-grid';
import { ptBR as corePtBR } from "@mui/material/locale";

import { Inter } from "next/font/google";
import typography from "./typography-theme";

const inter = Inter({ subsets: ["latin"] });

declare module "@mui/material/styles" {
  interface Palette {
    default: Palette["primary"];
    white: Palette["primary"];
  }
  interface PaletteOptions {
    default: PaletteOptions["primary"];
    white: PaletteOptions["primary"];
  }

  interface Duration {
    slow: number;
  }
}

declare module "@mui/material/TextField" {
  interface TextFieldPropsColorOverrides {
    default: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    linkText: true;
  }
}

// Define your theme
const theme = createTheme(
  {
    palette: {
      primary: {
        main: "#103E65",
        light: "#E0EEFB",
        dark: "#0B3658",
      },
      secondary: {
        main: "#80307C",
        light: "#F8ECF7",
      },
      success: {
        light: "#CDF0D3",
        main: "#11A338",
      },
      error: {
        light: "#FFD4D4",
        main: "#FF6464",
      },
      warning: {
        light: "#FFF5E8",
        main: "#D95F03",
      },
      info: {
        light: "#ECF7FF",
        main: "#0E4FC8",
      },
      default: {
        main: "#0F0F0F",
      },
      white: {
        main: "#fff",
      },
      grey: {
        "900": "#1E1E1E",
        "800": "#9399A4",
        "700": "#5F5F5F",
        "500": "#8B8B8B",
        "400": "#666666",
        "300": "#F1F5F7",
        "200": "#DFE1E6",
        "100": "#FAFAFA",
      },
      action: {
        hover: "#E0EEFB",
      },
    },
    typography: {
      fontFamily: inter.style.fontFamily, // Change the font family
      fontSize: 16,
    },
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: "1.6rem",
            backgroundColor: "white",
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            width: "100%",
            legend: {
              fontSize: "1.8rem",
            },
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            width: "100%",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            legend: {
              fontSize: 12,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            ...typography.paragraph.r2,
          },
        },
        variants: [
          {
            props: {
              variant: "linkText",
            },
            style: {
              color: "#007DBF",
              textDecoration: "underline",
              "&:hover": {
                textDecoration: "underline",
              },
            },
          },
        ],
      },
      MuiTab: {
        styleOverrides: {
          root: {
            ...typography.paragraph.r2,
            color: "#5B5B5B",
            "&.Mui-selected": {
              borderWidth: "0px 0px 2px 0px",
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            "& .MuiTabs-indicator": {
              height: "2px",
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "#000000DE",
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            padding: "2.4rem",
            maxWidth: "98.4rem",
            width: "100%",
            margin: 0,
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: {
            ...typography.paragraph.l3,
            p: {
              ...typography.paragraph.l3,
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-root": {
              "& textarea": {
                minHeight: "12rem",
              },
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: "#E0EEFB",
              "&:hover": {
                backgroundColor: "#BFDFFC",
              },
            },
            "&:hover": {
              backgroundColor: "#E0EEFB",
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            "&.MuiInputBase-sizeSmall": {
              height: "4rem", // Ensuring height change for small variant
            },
          },
        },
      },
      MuiFormGroup: {
        styleOverrides: {
          root: {
            ".MuiFormControlLabel-label": {
              ...typography.paragraph.l1,
            },
          },
        },
      },
    },
    transitions: {
      duration: {
        slow: 600,
      },
    },
  },
  corePtBR
);

export default theme;
