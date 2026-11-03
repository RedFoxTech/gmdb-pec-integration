import { CardWithHeader, TextHighlight, Text } from "@/components/common";
import { IndicatorContent } from "@/components/Indicators";
import { EarlyDetectionIndicatorsCoverageEntity } from "@/domain/entities/indicators";
import { decimalFormat, numberFormat } from "@/shared/numberUtils";
import theme from "@/shared/theme/material-theme";
import typography from "@/shared/theme/typography-theme";
import {
  PersonSearchOutlined as PersonSearchOutlinedIcon,
  SouthRounded as SouthRoundedIcon,
  NorthRounded as NorthRoundedIcon,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import { useCallback } from "react";

export type EarlyDetectionCytopathologicalCoverageChartProps = {
  data?: EarlyDetectionIndicatorsCoverageEntity;
  loading?: boolean;
};

const EarlyDetectionCytopathologicalCoverageChart: React.FC<
  EarlyDetectionCytopathologicalCoverageChartProps
> = ({ data, loading }) => {
  const RenderIncreaseIndicator: React.FC<{
    notAvailable?: boolean;
    lessThanCurrent?: boolean;
  }> = useCallback(({ notAvailable = false, lessThanCurrent = false }) => {
    if (notAvailable) {
      return null;
    }

    return (
      <Box>
        <TextHighlight
          small
          bgColor={
            lessThanCurrent
              ? theme.palette.success.light
              : theme.palette.error.light
          }
          color={
            lessThanCurrent
              ? theme.palette.success.main
              : theme.palette.error.main
          }
          icon={
            lessThanCurrent ? (
              <NorthRoundedIcon
                color="success"
                fontSize="small"
                sx={{
                  fontSize: "1.2rem",
                }}
              />
            ) : (
              <SouthRoundedIcon
                color="error"
                fontSize="small"
                sx={{
                  fontSize: "1.2rem",
                }}
              />
            )
          }
        />
      </Box>
    );
  }, []);

  return (
    <CardWithHeader
      icon={
        <PersonSearchOutlinedIcon
          color="primary"
          sx={{ width: "2.4rem", height: "2.4rem" }}
        />
      }
      title="Cobertura citopatologica"
      titleComplement={
        <Box display="flex" gap="1rem">
          <Text {...typography.title.h4l} color={theme.palette.primary.main}>
            Meta: 40 %
          </Text>
          <Text {...typography.title.h4l} color={theme.palette.secondary.main}>
            Meta: 70%
          </Text>
        </Box>
      }
      loading={loading}
    >
      <IndicatorContent
        items={[
          {
            text: `${decimalFormat(
              data?.current.ageOthersPercent ?? 0
            )}% / ${numberFormat(data?.current.ageOthers ?? 0)}`,
            badgeText: "Mulheres 25 a 64 anos",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
          },
          {
            text: `${decimalFormat(
              data?.lastYear.ageOthersPercent ?? 0
            )}% / ${numberFormat(data?.lastYear.ageOthers ?? 0)}`,
            textIcon: (
              <RenderIncreaseIndicator
                lessThanCurrent={data?.lastYear.ageOthersLessThanCurrent}
              />
            ),
            smallText: true,
            border: true,
            badgeText: "Ano anterior",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
            smallSpace: true,
          },
          {
            text: `${decimalFormat(
              data?.lastMounth.ageOthersPercent ?? 0
            )}% / ${numberFormat(data?.lastMounth.ageOthers ?? 0)}`,
            textIcon: (
              <RenderIncreaseIndicator
                lessThanCurrent={data?.lastMounth.ageOthersLessThanCurrent}
              />
            ),
            smallText: true,
            badgeText: "Mês anterior",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
          },
          {
            text: `${decimalFormat(
              data?.current.age35And45Percent ?? 0
            )}% / ${numberFormat(data?.current.age35And45 ?? 0)}`,
            badgeText: "35 e 45 anos",
            badgeColor: theme.palette.secondary.main,
            badgeBg: theme.palette.secondary.light,
            border: true,
          },
          {
            text: `${decimalFormat(
              data?.lastYear.age35And45Percent ?? 0
            )}% / ${numberFormat(data?.lastYear.age35And45 ?? 0)}`,
            textIcon: (
              <RenderIncreaseIndicator
                lessThanCurrent={data?.lastYear.age35And45LessThanCurrent}
              />
            ),
            smallText: true,
            border: true,
            badgeText: "Ano anterior",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.secondary.light,
            smallSpace: true,
          },
          {
            text: `${decimalFormat(
              data?.lastMounth.age35And45Percent ?? 0
            )}% / ${numberFormat(data?.lastMounth.age35And45 ?? 0)}`,
            textIcon: (
              <RenderIncreaseIndicator
                lessThanCurrent={data?.lastMounth.age35And45LessThanCurrent}
              />
            ),
            smallText: true,
            badgeText: "Mês anterior",
            badgeColor: theme.palette.secondary.main,
            badgeBg: theme.palette.secondary.light,
          },
        ]}
      />
    </CardWithHeader>
  );
};

export default EarlyDetectionCytopathologicalCoverageChart;
