import { Box } from "@mui/material";
import { Check as IconCheck } from "@mui//icons-material";
import Text from "../Text";
import typography from "@/shared/theme/typography-theme";
import theme from "@/shared/theme/material-theme";
import { Fragment } from "react";

export type StepsItemProps = {
  label: string;
};

export type StepsProps = {
  items: StepsItemProps[];
  activeIndex: number;
};

const Steps: React.FC<StepsProps> = ({ items, activeIndex }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      gap="0.8rem"
      sx={{
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
      }}
    >
      {items.map((item, index) => (
        <Fragment key={item.label}>
          <Box
            display="flex"
            sx={{
              flexDirection: { xs: "row", sm: "column" },
              gap: { xs: "1rem", sm: "2rem" },
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <Box
              borderRadius="50%"
              bgcolor={
                index <= activeIndex ? theme.palette.success.main : "#99999A"
              }
              width="2.4rem"
              height="2.4rem"
              display="flex"
              justifyContent="center"
              alignItems="center"
              m="auto"
            >
              {index <= activeIndex ? (
                <IconCheck sx={{ color: theme.palette.white.main }} />
              ) : (
                <Text
                  color={theme.palette.white.main}
                  {...typography.paragraph.l3}
                >
                  {index}
                </Text>
              )}
            </Box>
            <Text
              color="#566071"
              {...typography.paragraph.r2}
              textAlign="center"
            >
              {item.label}
            </Text>
          </Box>
          {index < items.length - 1 && (
            <Box
              key={`bar-${item.label}`}
              bgcolor="#BDBDBD"
              sx={{
                width: { xs: "0.1rem", sm: "auto" },
                height: { xs: "3.2rem", sm: "0.1rem" },
                flex: { xs: "auto", sm: 1 },
                ml: { xs: "1.15rem", sm: 0 },
              }}
            />
          )}
        </Fragment>
      ))}
    </Box>
  );
};

export default Steps;
