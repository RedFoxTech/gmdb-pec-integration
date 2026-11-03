import { CardWithHeader } from "@/components/common";
import { StarBorderOutlined as StarBorderOutlinedIcon } from "@mui/icons-material";
import theme from "@/shared/theme/material-theme";
import { IndicatorContent } from "@/components/Indicators";

const MortalityRateChart = () => {
  return (
    <CardWithHeader
      icon={
        <StarBorderOutlinedIcon
          color="primary"
          sx={{ width: "2.4rem", height: "2.4rem" }}
        />
      }
      title="Taxa de mortalidade"
    >
      <IndicatorContent
        items={[
          {
            text: "--",
            badgeText: "Por 100.000 mulheres",
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
            smallSpace: true,
          },
          {
            text: "--",
            badgeText: "Ano anterior",
            smallText: true,
            badgeColor: theme.palette.primary.main,
            badgeBg: theme.palette.primary.light,
            border: true,
          },
        ]}
      />
    </CardWithHeader>
  );
};

export default MortalityRateChart;
