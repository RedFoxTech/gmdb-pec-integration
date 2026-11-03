import { CardWithHeader } from "@/components/common";
import { CalendarMonthOutlined as CalendarMonthOutlinedIcon } from "@mui/icons-material";
import theme from "@/shared/theme/material-theme";
import { IndicatorContent } from "@/components/Indicators";
import { decimalFormat, numberFormat } from "@/shared/numberUtils";
import { EarlyDetectionIndicatorsPendingScheduledExamsEntity } from "@/domain/entities/indicators";

export type EarlyDetectionPendingSchedulingChartProps = {
  data?: EarlyDetectionIndicatorsPendingScheduledExamsEntity;
  loading?: boolean;
};

const EarlyDetectionPendingSchedulingChart: React.FC<
  EarlyDetectionPendingSchedulingChartProps
> = ({ data, loading }) => {
  return (
    <CardWithHeader
      icon={
        <CalendarMonthOutlinedIcon
          color="primary"
          sx={{ width: "2.4rem", height: "2.4rem" }}
        />
      }
      title="Pendente de agendamento"
      loading={loading}
    >
      <IndicatorContent
        items={[
          {
            text: `${decimalFormat(
              data?.age25To64?.percentage ?? 0
            )}% / ${numberFormat(data?.age25To64?.value ?? 0)}`,
            badgeText: "Mulheres 25 a 64 anos",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
            smallSpace: true,
          },
          {
            text: numberFormat(data?.age25To64?.volume ?? 0),
            badgeText: "Volume",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
          },
          {
            text: `${decimalFormat(
              data?.age35And45?.percentage ?? 0
            )}% / ${numberFormat(data?.age35And45?.value ?? 0)}`,
            badgeText: "35 e 45 anos",
            badgeColor: theme.palette.secondary.main,
            badgeBg: theme.palette.secondary.light,
            border: true,
            smallSpace: true,
          },
          {
            text: numberFormat(data?.age35And45?.volume ?? 0),
            badgeText: "Volume",
            badgeColor: theme.palette.secondary.main,
            badgeBg: theme.palette.secondary.light,
          },
        ]}
      />
    </CardWithHeader>
  );
};

export default EarlyDetectionPendingSchedulingChart;
