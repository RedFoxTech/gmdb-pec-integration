import { CardWithHeader } from "@/components/common";
import { TourOutlined as TourOutlinedIcon } from "@mui/icons-material";
import theme from "@/shared/theme/material-theme";
import { IndicatorContent } from "@/components/Indicators";

export type EarlyDetectionStateRankingChartProps = {
  loading?: boolean;
};

const EarlyDetectionStateRankingChart: React.FC<
  EarlyDetectionStateRankingChartProps
> = ({ loading }) => {
  return (
    <CardWithHeader
      icon={
        <TourOutlinedIcon
          color="primary"
          sx={{ width: "2.4rem", height: "2.4rem" }}
        />
      }
      title="Ranking estadual"
      loading={loading}
    >
      <IndicatorContent
        items={[
          {
            text: "--º",
            badgeText: "Posição atual",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
            smallSpace: true,
          },
          {
            text: "--º",
            smallText: true,
            badgeText: "Ano anterior",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
            border: true,
            smallSpace: true,
          },
          {
            text: "--º",
            smallText: true,
            badgeText: "Mês anterior",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
            smallSpace: true,
          },
        ]}
      />
    </CardWithHeader>
  );
};

export default EarlyDetectionStateRankingChart;
