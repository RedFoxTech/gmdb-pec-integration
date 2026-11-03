import { CardWithHeader } from "@/components/common";
import { HealthAndSafetyOutlined as HealthAndSafetyOutlinedIcon } from "@mui/icons-material";
import theme from "@/shared/theme/material-theme";
import { IndicatorContent } from "@/components/Indicators";
import { EarlyDetectionIndicatorsPerformedExamsEntity } from "@/domain/entities/indicators/entity/early-detection-indicators-performed-exams.entity";
import { numberFormat } from "@/shared/numberUtils";

export type EarlyDetectionTestsPerformedCytopathologyChartProps = {
  data?: EarlyDetectionIndicatorsPerformedExamsEntity;
  loading?: boolean;
};

const EarlyDetectionTestsPerformedCytopathologyChart: React.FC<
  EarlyDetectionTestsPerformedCytopathologyChartProps
> = ({ data, loading }) => {
  return (
    <CardWithHeader
      icon={
        <HealthAndSafetyOutlinedIcon
          color="primary"
          sx={{ width: "2.4rem", height: "2.4rem" }}
        />
      }
      title="Quantidade de exames realizados (Citopatologico)"
      loading={loading}
    >
      <IndicatorContent
        items={[
          {
            text: numberFormat(data?.mounth.age25To64 ?? 0),
            badgeText: " 25 a 64 anos - Mês",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
            smallSpace: true,
          },
          {
            text: numberFormat(data?.year.age25To64 ?? 0),
            badgeText: "25 a 64 anos - Ano",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
          },
          {
            text: numberFormat(data?.mounth.age35And45 ?? 0),
            badgeText: "35 e 45 anos - Mês",
            badgeColor: theme.palette.secondary.main,
            badgeBg: theme.palette.secondary.light,
            border: true,
            smallSpace: true,
          },
          {
            text: numberFormat(data?.year.age35And45 ?? 0),
            badgeText: "35 e 45 anos - Ano",
            badgeColor: theme.palette.secondary.main,
            badgeBg: theme.palette.secondary.light,
          },
        ]}
      />
    </CardWithHeader>
  );
};

export default EarlyDetectionTestsPerformedCytopathologyChart;
