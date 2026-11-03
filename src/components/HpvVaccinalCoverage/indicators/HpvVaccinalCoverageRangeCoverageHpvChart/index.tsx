import { CardWithHeader, Text } from "@/components/common";
import { HpvIndicatorCoverageRangeEntity } from "@/domain/entities/indicators";
import { decimalFormat } from "@/shared/numberUtils";
import theme from "@/shared/theme/material-theme";
import typography from "@/shared/theme/typography-theme";
import { EscalatorWarningOutlined as EscalatorWarningOutlinedIcon } from "@mui/icons-material";
import { Box } from "@mui/material";

export type HpvVaccinalCoverageRangeCoverageHpvChartProps = {
  data?: HpvIndicatorCoverageRangeEntity[];
  loading?: boolean;
};

const HpvVaccinalCoverageRangeCoverageHpvChart: React.FC<
  HpvVaccinalCoverageRangeCoverageHpvChartProps
> = ({ data = [], loading }) => {
  return (
    <CardWithHeader
      icon={
        <EscalatorWarningOutlinedIcon
          color="primary"
          sx={{ width: "2.4rem", height: "2.4rem" }}
        />
      }
      title="Cobertura faixa - HPV "
      loading={loading}
    >
      <Box sx={{ overflowX: "auto" }}>
        <Box
          component="table"
          sx={{ borderCollapse: "separate", borderSpacing: "0 0.65rem" }}
        >
          <Box component="thead">
            <tr>
              {header.map((row) => (
                <Box key={row.key} component="th" pt="0.65rem" pl="0.756rem">
                  <Box
                    key={row.key}
                    bgcolor={row.bg}
                    minWidth="9rem"
                    height="3.7rem"
                    display="flex"
                    alignItems="center"
                    px="1.2rem"
                  >
                    <Text
                      {...typography.paragraph.sb2}
                      color={row.color}
                      textAlign="left"
                    >
                      {row.text}
                    </Text>
                  </Box>
                </Box>
              ))}
            </tr>
          </Box>
          <Box component="tbody">
            {data.map((row) => (
              <Box component="tr" key={row.age.value}>
                {header.map((column) => (
                  <Box
                    key={column.key}
                    component="th"
                    borderTop={1}
                    borderColor="#DDDDDD"
                    pt="0.65rem"
                    pl="0.756rem"
                  >
                    <Box
                      bgcolor={row.age.value === 0 ? "transparent" : column.bg}
                      minWidth="9rem"
                      px="1.2rem"
                      py="0.15rem"
                      height="3.7rem"
                      display="flex"
                      alignItems="center"
                    >
                      <Text
                        {...typography.paragraph.sb2}
                        color={
                          row.age.value === 0
                            ? column.color
                            : theme.palette.grey["500"]
                        }
                        textAlign="left"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {column.key === "age" ? (
                          <>
                            {row.age.value === 0
                              ? "Total"
                              : `${row.age.value} Anos`}
                          </>
                        ) : (
                          <>
                            {row[column.key].value}
                            {row[column.key].percentage !== undefined
                              ? ` (${decimalFormat(
                                  row[column.key].percentage ?? 0
                                )}%)`
                              : ""}
                          </>
                        )}
                      </Text>
                    </Box>
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

export default HpvVaccinalCoverageRangeCoverageHpvChart;

type HeaderProps = {
  key: keyof HpvIndicatorCoverageRangeEntity;
  text: string;
  color: string;
  bg: string;
};

const header: HeaderProps[] = [
  {
    text: "Idade",
    color: theme.palette.primary.main,
    bg: "transparent",
    key: "age",
  },
  {
    text: "Meninas",
    color: theme.palette.secondary.main,
    bg: theme.palette.secondary.light,
    key: "femaleTotal",
  },
  {
    text: "Vacinadas",
    color: theme.palette.secondary.main,
    bg: theme.palette.secondary.light,
    key: "femaleVaccinated",
  },
  {
    text: "Não vacinadas",
    color: theme.palette.secondary.main,
    bg: theme.palette.secondary.light,
    key: "femaleNotVaccinated",
  },
  {
    text: "Meninos",
    color: "#955611",
    bg: "#FCF3E9",
    key: "maleTotal",
  },
  {
    text: "Vacinados",
    color: "#955611",
    bg: "#FCF3E9",
    key: "maleVaccinated",
  },
  {
    text: "Não vacinados",
    color: "#955611",
    bg: "#FCF3E9",
    key: "maleNotVaccinated",
  },
  {
    text: "Total jovens",
    color: theme.palette.primary.main,
    bg: theme.palette.primary.light,
    key: "generalTotal",
  },
  {
    text: "Total vacinados",
    color: theme.palette.primary.main,
    bg: theme.palette.primary.light,
    key: "generalVaccinated",
  },
  {
    text: "Total  não vacinados",
    color: theme.palette.primary.main,
    bg: theme.palette.primary.light,
    key: "generalNotVaccinated",
  },
];
