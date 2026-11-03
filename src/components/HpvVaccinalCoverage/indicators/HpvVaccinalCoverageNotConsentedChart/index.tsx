import { CardWithHeader } from "@/components/common";
import { IndicatorContent } from "@/components/Indicators";
import { HpvIndicatorNotConsentEntity } from "@/domain/entities/indicators";
import theme from "@/shared/theme/material-theme";
import {
  BlockOutlined as BlockOutlinedIcon,
  FemaleOutlined as FemaleOutlinedIcon,
  MaleOutlined as MaleOutlinedIcon,
} from "@mui/icons-material";

export type HpvVaccinalCoverageNotConsentedChartProps = {
  data?: HpvIndicatorNotConsentEntity;
  loading?: boolean;
};

const HpvVaccinalCoverageNotConsentedChart: React.FC<
  HpvVaccinalCoverageNotConsentedChartProps
> = ({ data, loading }) => {
  return (
    <CardWithHeader
      icon={
        <BlockOutlinedIcon
          color="primary"
          sx={{ width: "2.4rem", height: "2.4rem" }}
        />
      }
      title="Não consentido"
      loading={loading}
    >
      <IndicatorContent
        items={[
          {
            text: data?.total?.toString() ?? "",
            badgeText: "Jovens 9 a 14 anos",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
            smallSpace: true,
          },
          {
            text: data?.female.toString() ?? "",
            badgeText: "Meninas",
            badgeColor: theme.palette.secondary.main,
            badgeBg: theme.palette.secondary.light,
            badgeIcon: <FemaleOutlinedIcon color="secondary" />,
            border: true,
          },
          {
            text: data?.male.toString() ?? "",
            badgeText: "Meninos",
            badgeColor: "#955611",
            badgeBg: "#FCF3E9",
            badgeIcon: (
              <MaleOutlinedIcon color="secondary" sx={{ color: "#955611" }} />
            ),
          },
        ]}
      />
    </CardWithHeader>
  );
};

export default HpvVaccinalCoverageNotConsentedChart;
