import { CardWithHeader } from "@/components/common";
import { IndicatorContent } from "@/components/Indicators";
import { HpvIndicatorNumberVaccinationsAdministeredEntity } from "@/domain/entities/indicators";
import { numberFormat } from "@/shared/numberUtils";
import theme from "@/shared/theme/material-theme";
import { VaccinesOutlined as VaccinesOutlinedIcon } from "@mui/icons-material";

export type HpvVaccinalCoverageNumberVaccinationsAdministeredChartProps = {
  data?: HpvIndicatorNumberVaccinationsAdministeredEntity;
  loading?: boolean;
};

const HpvVaccinalCoverageNumberVaccinationsAdministeredChart: React.FC<
  HpvVaccinalCoverageNumberVaccinationsAdministeredChartProps
> = ({ data, loading }) => {
  return (
    <CardWithHeader
      icon={
        <VaccinesOutlinedIcon
          color="primary"
          sx={{ width: "2.4rem", height: "2.4rem" }}
        />
      }
      title="Quantidade de vacinas realizadas"
      loading={loading}
    >
      <IndicatorContent
        items={[
          {
            text: numberFormat(data?.mounth ?? 0),
            badgeText: "Mês",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
          },
          {
            text: numberFormat(data?.year ?? 0),
            badgeText: "Ano",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
          },
        ]}
      />
    </CardWithHeader>
  );
};

export default HpvVaccinalCoverageNumberVaccinationsAdministeredChart;
