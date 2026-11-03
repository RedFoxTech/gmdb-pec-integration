import { Box, Typography } from "@mui/material";
import Card from "../Card";
import Text from "../Text";
import typography from "@/shared/theme/typography-theme";
import theme from "@/shared/theme/material-theme";
import { ReactElement } from "react";
import { decimalFormat, numberFormat } from "@/shared/numberUtils";

export type ComparatorIndicatorProps = {
  title: string;
  titleIcon: ReactElement;
  total: number;
  totalLeft: number;
  percentageLeft: number;
  textLeft: string;
  iconLeft?: ReactElement;
  totalRight: number;
  percentageRight: number;
  textRight: string;
  iconRight?: ReactElement;
  noData?: boolean;
  loading?: boolean;
};

const ComparatorIndicator: React.FC<ComparatorIndicatorProps> = ({
  title,
  titleIcon,
  total,
  totalLeft,
  percentageLeft,
  textLeft,
  iconLeft,
  totalRight,
  percentageRight,
  textRight,
  iconRight,
  noData,
  loading,
}) => {
  if (loading) {
    return (
      <Card
        height="17.5rem"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          fontSize={16}
          textAlign="center"
          fontWeight={600}
          color={theme.palette.primary.main}
        >
          Carregando...
        </Typography>
      </Card>
    );
  }

  return (
    <Card height="100%" display="flex" flexDirection="column">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        py="0.6rem"
      >
        <Box display="flex" alignItems="center" gap="0.8rem" maxWidth="18rem">
          {titleIcon}
          <Text
            color={theme.palette.primary.main}
            {...typography.paragraph.sb1}
          >
            {title}
          </Text>
        </Box>
        <Text color={theme.palette.grey[500]} {...typography.title.h3sb}>
          {noData ? "--" : numberFormat(total)}
        </Text>
      </Box>
      <Box
        width="100%"
        height="0.1rem"
        bgcolor={theme.palette.grey[200]}
        mt="1rem"
        mb="1.2rem"
      />
      <Box display="flex" gap="4.2rem" justifyContent="space-between" flex={1}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center" mb="0.6rem">
            <Text
              color={theme.palette.primary.main}
              {...typography.paragraph.r2}
            >
              {textLeft}
            </Text>
            {iconLeft}
          </Box>
          <Box>
            <Text color={theme.palette.grey[500]} {...typography.title.h3sb}>
              {noData ? "--" : numberFormat(totalLeft)}
            </Text>

            <Box
              bgcolor={theme.palette.primary.light}
              borderRadius="0.6rem"
              p="0.2rem"
              width="fit-content"
              mt="0.4rem"
            >
              <Text
                color={theme.palette.primary.main}
                {...typography.paragraph.sb3}
              >
                {noData ? "--" : decimalFormat(percentageLeft)}%
              </Text>
            </Box>
          </Box>
        </Box>

        <Box width="0.1rem" bgcolor={theme.palette.grey[200]} />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center" mb="0.6rem">
            <Text
              color={theme.palette.primary.main}
              {...typography.paragraph.r2}
            >
              {textRight}
            </Text>
            {iconRight}
          </Box>
          <Box>
            <Text color={theme.palette.grey[500]} {...typography.title.h3sb}>
              {noData ? "--" : numberFormat(totalRight)}
            </Text>

            <Box
              bgcolor={theme.palette.primary.light}
              borderRadius="0.6rem"
              p="0.2rem"
              width="fit-content"
              mt="0.4rem"
            >
              <Text
                color={theme.palette.primary.main}
                {...typography.paragraph.sb3}
              >
                {noData ? "--" : decimalFormat(percentageRight)}%
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default ComparatorIndicator;
