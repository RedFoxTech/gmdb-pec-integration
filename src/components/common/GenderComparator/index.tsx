import { Box, Typography } from "@mui/material";
import Card from "../Card";
import Text from "../Text";
import typography from "@/shared/theme/typography-theme";
import theme from "@/shared/theme/material-theme";
import { Female as FemaleIcon, Male as MaleIcon } from "@mui/icons-material";
import { ReactElement } from "react";
import {
  decimalFormat,
  numberFormat,
  percentageByTotal,
} from "@/shared/numberUtils";

export type GenderComparatorProps = {
  title: string;
  titleIcon: ReactElement;
  total: number;
  totalFemale: number;
  totalMale: number;
  generalTotalFemale: number;
  generalTotalMale: number;
  loading?: boolean;
};

const GenderComparator: React.FC<GenderComparatorProps> = ({
  title,
  titleIcon,
  total,
  totalFemale,
  totalMale,
  generalTotalFemale,
  generalTotalMale,
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
    <Card>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        py="0.6rem"
      >
        <Box display="flex" alignItems="center" gap="0.8rem">
          {titleIcon}
          <Text
            color={theme.palette.primary.main}
            {...typography.paragraph.sb1}
          >
            {title}
          </Text>
        </Box>
        <Text color={theme.palette.grey[500]} {...typography.title.h3sb}>
          {numberFormat(total)}
        </Text>
      </Box>
      <Box
        width="100%"
        height="0.1rem"
        bgcolor={theme.palette.grey[200]}
        mt="1rem"
        mb="1.2rem"
      />
      <Box display="flex" gap="4.2rem" justifyContent="space-between">
        <Box>
          <Box display="flex" alignItems="center" mb="0.6rem">
            <Text
              color={theme.palette.primary.main}
              {...typography.paragraph.r2}
            >
              Meninas
            </Text>
            <FemaleIcon
              color="primary"
              sx={{ width: "2.4rem", height: "2.4rem" }}
            />
          </Box>
          <Text color={theme.palette.grey[500]} {...typography.title.h3sb}>
            {numberFormat(totalFemale)}
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
              {decimalFormat(
                percentageByTotal(totalFemale, generalTotalFemale)
              )}
              %
            </Text>
          </Box>
        </Box>

        <Box width="0.1rem" bgcolor={theme.palette.grey[200]} />
        <Box>
          <Box display="flex" alignItems="center" mb="0.6rem">
            <Text
              color={theme.palette.primary.main}
              {...typography.paragraph.r2}
            >
              Meninos
            </Text>
            <MaleIcon
              color="primary"
              sx={{ width: "2.4rem", height: "2.4rem" }}
            />
          </Box>
          <Text color={theme.palette.grey[500]} {...typography.title.h3sb}>
            {numberFormat(totalMale)}
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
              {decimalFormat(percentageByTotal(totalMale, generalTotalMale))}%
            </Text>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default GenderComparator;
