import { CardWithHeader } from "@/components/common";
import { TrackChangesOutlined as TrackChangesOutlinedIcon } from "@mui/icons-material";
import theme from "@/shared/theme/material-theme";
import { IndicatorContent } from "@/components/Indicators";
import { EarlyDetectionIndicatorsScheduledExamsEntity } from "@/domain/entities/indicators";
import { decimalFormat, numberFormat } from "@/shared/numberUtils";

export type EarlyDetectionScheduledExamsChartProps = {
  data?: EarlyDetectionIndicatorsScheduledExamsEntity;
  loading?: boolean;
};

const EarlyDetectionScheduledExamsChart: React.FC<
  EarlyDetectionScheduledExamsChartProps
> = ({ data, loading }) => {
  return (
    <CardWithHeader
      icon={
        <TrackChangesOutlinedIcon
          color="primary"
          sx={{ width: "2.4rem", height: "2.4rem" }}
        />
      }
      title="Exames agendados"
      loading={loading}
    >
      <IndicatorContent
        items={[
          {
            text: numberFormat(data?.age25To64.value ?? 0),
            badgeText: "Mulheres 25 a 64 anos",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
            smallSpace: true,
          },
          {
            text: decimalFormat(data?.age25To64.percentage ?? 0),
            badgeText: "P.P.",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
          },
          {
            text: numberFormat(data?.age35And45.value ?? 0),
            badgeText: "Mulheres 35 e 45 anos",
            badgeColor: theme.palette.secondary.main,
            badgeBg: theme.palette.secondary.light,
            border: true,
            smallSpace: true,
          },
          {
            text: decimalFormat(data?.age35And45.percentage ?? 0),
            badgeText: "P.P.",
            badgeColor: theme.palette.secondary.main,
            badgeBg: theme.palette.secondary.light,
          },
        ]}
      />
    </CardWithHeader>
  );
};

export default EarlyDetectionScheduledExamsChart;
