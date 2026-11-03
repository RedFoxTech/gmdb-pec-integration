import { Box, Typography } from "@mui/material";
import Card from "../Card";
import Text from "../Text";
import typography from "@/shared/theme/typography-theme";
import theme from "@/shared/theme/material-theme";
import { ReactElement } from "react";
import { numberFormat } from "@/shared/numberUtils";

export type IndicatorCardProps = {
  title: string;
  titleIcon: ReactElement;
  total?: number;
  loading?: boolean;
};

const IndicatorCard: React.FC<IndicatorCardProps> = ({
  title,
  titleIcon,
  total,
  loading,
}) => {
  if (loading) {
    return (
      <Card
        height="7.5rem"
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
          {total || total === 0 ? numberFormat(total) : "--"}
        </Text>
      </Box>
    </Card>
  );
};

export default IndicatorCard;
