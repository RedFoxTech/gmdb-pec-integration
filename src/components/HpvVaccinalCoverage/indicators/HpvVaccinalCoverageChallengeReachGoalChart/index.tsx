import { CardWithHeader, TextHighlight } from "@/components/common";
import { IndicatorContent } from "@/components/Indicators";
import { HpvIndicatorChalengeGoalEntity } from "@/domain/entities/indicators";
import { decimalFormat, numberFormat } from "@/shared/numberUtils";
import theme from "@/shared/theme/material-theme";
import {
  TrackChangesOutlined as TrackChangesOutlinedIcon,
  SouthRounded as SouthRoundedIcon,
  NorthRounded as NorthRoundedIcon,
  FemaleOutlined as FemaleOutlinedIcon,
  MaleOutlined as MaleOutlinedIcon,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import { useCallback } from "react";

export type HpvVaccinalCoverageChallengeReachGoalChart = {
  data?: HpvIndicatorChalengeGoalEntity;
  loading?: boolean;
};

const HpvVaccinalCoverageChallengeReachGoalChart: React.FC<
  HpvVaccinalCoverageChallengeReachGoalChart
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
        <TrackChangesOutlinedIcon
          color="primary"
          sx={{ width: "2.4rem", height: "2.4rem" }}
        />
      }
      title="Desafio para alcançar à meta"
      loading={loading}
    >
      <IndicatorContent
        items={[
          {
            text: numberFormat(data?.general?.value ?? 0),
            badgeText: "Jovens",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
            smallSpace: true,
          },
          {
            text: decimalFormat(data?.general?.percentage ?? 0),
            smallText: true,
            badgeText: "P.P",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
          },
          {
            text: numberFormat(data?.female?.value ?? 0),
            badgeText: "Meninas",
            badgeColor: theme.palette.secondary.main,
            badgeBg: theme.palette.secondary.light,
            badgeIcon: <FemaleOutlinedIcon color="secondary" />,
            border: true,
            smallSpace: true,
          },
          {
            text: decimalFormat(data?.female?.percentage ?? 0),
            smallText: true,
            badgeText: "P.P",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
          },
          {
            text: numberFormat(data?.male?.value ?? 0),
            badgeText: "Meninos",
            badgeColor: "#955611",
            badgeBg: "#FCF3E9",
            badgeIcon: (
              <MaleOutlinedIcon color="secondary" sx={{ color: "#955611" }} />
            ),
            smallSpace: true,
          },
          {
            text: decimalFormat(data?.male?.percentage ?? 0),
            smallText: true,
            badgeText: "P.P",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
          },
          {
            text: data?.lastYear?.notAvailable
              ? "--"
              : numberFormat(data?.lastYear?.value ?? 0),
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
              ? "--"
              : numberFormat(data?.lastMounth?.value ?? 0),
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

export default HpvVaccinalCoverageChallengeReachGoalChart;
