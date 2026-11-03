import { CardWithHeader } from "@/components/common";
import { EscalatorWarningOutlined as EscalatorWarningOutlinedIcon } from "@mui/icons-material";
import theme from "@/shared/theme/material-theme";
import { Box } from "@mui/material";
import { Text } from "@/components/common";
import typography from "@/shared/theme/typography-theme";
import { EarlyDetectionIndicatorsDetectionTrackingEntity } from "@/domain/entities/indicators";
import { decimalFormat, numberFormat } from "@/shared/numberUtils";

export type EarlyDetectionRangeCoverageTrackingProps = {
  data?: EarlyDetectionIndicatorsDetectionTrackingEntity[];
  loading?: boolean;
};

const EarlyDetectionRangeCoverageTracking: React.FC<
  EarlyDetectionRangeCoverageTrackingProps
> = ({ data = [], loading }) => {
  return (
    <CardWithHeader
      icon={
        <EscalatorWarningOutlinedIcon
          color="primary"
          sx={{ width: "2.4rem", height: "2.4rem" }}
        />
      }
      title="Cobertura faixa - Rastreamento"
      loading={loading}
    >
      <Box sx={{ overflowX: "auto" }} minWidth="100%">
        <Box
          component="table"
          width="100%"
          sx={{ borderCollapse: "collapse", borderSpacing: "0 0.65rem" }}
        >
          <Box component="thead">
            <tr>
              {header.map((row) => (
                <Box component="th" key={row.text} py="1.5rem" px="2rem">
                  <Text {...typography.paragraph.sb2} textAlign="left">
                    {row.text}
                  </Text>
                </Box>
              ))}
            </tr>
          </Box>
          <Box component="tbody">
            {data.map((row, index) => (
              <Box component="tr" key={row.label}>
                {header.map((column) => (
                  <Box
                    component="th"
                    key={column.text}
                    borderBottom={index < mockItems.length - 1 ? 1 : 0}
                    borderColor="#DDDDDD"
                    py="1.5rem"
                    px="2rem"
                  >
                    <Text
                      {...typography.paragraph.sb1}
                      textAlign="left"
                      color={
                        index > 0
                          ? theme.palette.secondary.main
                          : theme.palette.grey["500"]
                      }
                    >
                      {column.render(row)}
                    </Text>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </CardWithHeader>
  );
};

export default EarlyDetectionRangeCoverageTracking;

type HeaderProps = {
  text: string;
  render: (value: EarlyDetectionIndicatorsDetectionTrackingEntity) => string;
};

const header: HeaderProps[] = [
  {
    text: "Idade",
    render: (item) => item.label,
  },
  {
    text: "Num. de mulheres",
    render: (item) => numberFormat(item.total),
  },
  {
    text: "Exames agendados",
    render: (item) => numberFormat(item.scheduledExams),
  },
  {
    text: "Exames não agendados",
    render: (item) => numberFormat(item.pendingExams),
  },
  {
    text: "Cobertura",
    render: (item) => `${decimalFormat(item.coverage)}%`,
  },
  {
    text: "Quant. p/ alcançar a meta",
    render: (item) => numberFormat(item.challengeGoal),
  },
];

type MockItemsProps = {
  age: string;
  nWomen: number;
  scheduledExams: number;
  notScheduledExams: number;
  coverage: number;
  volReachGoal: number;
};

const mockItems: MockItemsProps[] = [
  // {
  //   age: "25 a 64 anos",
  //   nWomen: 1500,
  //   scheduledExams: 550,
  //   notScheduledExams: 150,
  //   coverage: 70,
  //   volReachGoal: 250,
  // },
  // {
  //   age: "35 anos",
  //   nWomen: 30,
  //   scheduledExams: 18,
  //   notScheduledExams: 12,
  //   coverage: 72,
  //   volReachGoal: 200,
  // },
  // {
  //   age: "45 anos",
  //   nWomen: 30,
  //   scheduledExams: 17,
  //   notScheduledExams: 13,
  //   coverage: 70,
  //   volReachGoal: 200,
  // },
];
