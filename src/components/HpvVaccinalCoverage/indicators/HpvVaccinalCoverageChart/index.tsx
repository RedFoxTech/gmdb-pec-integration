import { CardWithHeader, TextHighlight, Text } from "@/components/common";
import { IndicatorContent } from "@/components/Indicators";
import { HpvIndicatorCoverageEntity } from "@/domain/entities/indicators";
import { decimalFormat, numberFormat } from "@/shared/numberUtils";
import theme from "@/shared/theme/material-theme";
import typography from "@/shared/theme/typography-theme";
import {
  Diversity3Outlined as Diversity3OutlinedIcon,
  FemaleOutlined as FemaleOutlinedIcon,
  MaleOutlined as MaleOutlinedIcon,
  SouthRounded as SouthRoundedIcon,
  NorthRounded as NorthRoundedIcon,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import { useCallback } from "react";

export type HpvVaccinalCoverageChartProps = {
  data?: HpvIndicatorCoverageEntity;
  loading?: boolean;
};

const HpvVaccinalCoverageChart: React.FC<HpvVaccinalCoverageChartProps> = ({
  data,
  loading,
}) => {
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
        <Diversity3OutlinedIcon
          color="primary"
          sx={{ width: "2.4rem", height: "2.4rem" }}
        />
      }
      title="Cobertura vacinal HPV"
      titleComplement={
        <Text {...typography.title.h4l} color={theme.palette.primary.main}>
          Meta: 90%
        </Text>
      }
      loading={loading}
    >
      <IndicatorContent
        items={[
          {
            text: `${decimalFormat(
              data?.general?.percentage ?? 0
            )}% / ${numberFormat(data?.general?.value ?? 0)}`,
            badgeText: "Jovens 9 a 14 anos (% / Qtd )",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
          },
          {
            text: `${decimalFormat(
              data?.female?.percentage ?? 0
            )}% / ${numberFormat(data?.female?.value ?? 0)}`,
            badgeText: "Meninas (% / Qtd )",
            badgeColor: theme.palette.secondary.main,
            badgeBg: theme.palette.secondary.light,
            badgeIcon: <FemaleOutlinedIcon color="secondary" />,
            border: true,
          },
          {
            text: `${decimalFormat(
              data?.male?.percentage ?? 0
            )}% / ${numberFormat(data?.male?.value ?? 0)}`,
            badgeText: "Meninos (% / Qtd )",
            badgeColor: "#955611",
            badgeBg: "#FCF3E9",
            badgeIcon: (
              <MaleOutlinedIcon color="secondary" sx={{ color: "#955611" }} />
            ),
          },
          {
            text: data?.lastYear?.notAvailable
              ? "-- / --"
              : `${decimalFormat(
                  data?.lastYear?.percentage ?? 0
                )}% / ${numberFormat(data?.lastYear?.value ?? 0)}`,
            smallText: true,
            badgeText: "Ano anterior",
            textIcon: (
              <RenderIncreaseIndicator
                notAvailable={data?.lastYear?.notAvailable}
                lessThanCurrent={data?.lastYear?.lessThanCurrent}
              />
            ),
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
            border: true,
            smallSpace: true,
          },
          {
            text: data?.lastMounth?.notAvailable
              ? "-- / --"
              : `${decimalFormat(
                  data?.lastMounth.percentage ?? 0
                )}% / ${numberFormat(data?.lastMounth?.value ?? 0)}`,
            smallText: true,
            badgeText: "Mês anterior",
            textIcon: (
              <RenderIncreaseIndicator
                notAvailable={data?.lastMounth?.notAvailable}
                lessThanCurrent={data?.lastMounth?.lessThanCurrent}
              />
            ),
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
          },
        ]}
      />
    </CardWithHeader>
  );
};

export default HpvVaccinalCoverageChart;
