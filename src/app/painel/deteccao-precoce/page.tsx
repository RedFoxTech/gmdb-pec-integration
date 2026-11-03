"use client";

import { Box, Container, Grid2 } from "@mui/material";
import { Button, InputDate, RadioGroup, Text } from "@/components/common";
import typography from "@/shared/theme/typography-theme";
import dateUtils from "@/shared/date";
import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import { GetHpvIndicatorsDto } from "@/domain/entities/indicators";
import {
  EarlyDetectionChallengeReachGoalChart,
  EarlyDetectionCytopathologicalCoverageChart,
  EarlyDetectionPendingSchedulingChart,
  EarlyDetectionRangeCoverageTracking,
  EarlyDetectionScheduledExamsChart,
  EarlyDetectionStateRankingChart,
  EarlyDetectionTestsPerformedCytopathologyChart,
  EarlyDetectionTestsPerformedHpvDnaChart,
} from "@/components/EarlyDetection/indicators";
import { useIndicators } from "@/hooks";
import { GenderEnum } from "@/domain/consts";

const EarlyDetection = () => {
  const [filterOption, setFilterOption] = useState("1");
  const [filter, setFilter] = useState<{
    year: Dayjs;
    mounth: Dayjs;
  }>({
    year: dateUtils(),
    mounth: dateUtils(),
  });

  const [selectedFilter, setSelectedFilters] = useState<GetHpvIndicatorsDto>({
    year: dateUtils().format("YYYY"),
  });

  const { earlyDetectionIndicators, earlyDetectionIndicatorsLoading } =
    useIndicators({
      getEarlyDetectionIndicators: {
        enabled: true,
        params: {
          ...selectedFilter,
          gender: GenderEnum.FEMALE,
        },
      },
    });

  const handleFilter = () => {
    if (filterOption == "1") {
      setSelectedFilters({
        year: filter.year.format("YYYY"),
      });
    } else {
      setSelectedFilters({
        year: dateUtils().format("YYYY"),
        mounth: filter.mounth.format("MM"),
      });
    }
  };

  useEffect(() => {
    if (filterOption === "0") {
      setFilter((value) => ({
        ...value,
        year: dateUtils(),
      }));
    }
  }, [filterOption]);

  return (
    <Container>
      <Box>
        <Text {...typography.title.h1l}>Detecção precoce</Text>
        <Text {...typography.paragraph.l2} color="#838383" mt="2.8rem">
          Última atualização dos dados em {dateUtils().format("DD/MM/YYYY")}
        </Text>
      </Box>
      <Box mt="1.2rem">
        <RadioGroup
          row
          value={filterOption}
          options={[
            { value: "0", label: "Mensal" },
            { value: "1", label: "Anual" },
          ]}
          onChange={(value) => setFilterOption(value as string)}
        />
        <Box display="flex" gap="2.4rem" mt="2rem">
          {filterOption == "0" && (
            <Box>
              <InputDate
                value={filter.mounth}
                views={["month"]}
                fullWidth
                label="Mês"
                size="small"
                maxDate={dateUtils()}
                onChange={(e) =>
                  setFilter((value) => ({ ...value, mounth: e || dateUtils() }))
                }
              />
            </Box>
          )}
          <Box>
            <InputDate
              value={filter.year}
              views={["year"]}
              fullWidth
              label="Ano"
              size="small"
              disabled={filterOption == "0"}
              maxDate={dateUtils().endOf("year")}
              minDate={dateUtils("2024-01-01")}
              onChange={(e) =>
                setFilter((value) => ({ ...value, year: e || dateUtils() }))
              }
            />
          </Box>
          <Button variant="contained" onClick={handleFilter}>
            Filtrar
          </Button>
        </Box>
      </Box>
      <Box>
        <Grid2 container spacing="2.4rem" mt="1.2rem">
          <Grid2 size={{ xs: 12 }}>
            <EarlyDetectionCytopathologicalCoverageChart
              data={earlyDetectionIndicators?.coverage}
              loading={earlyDetectionIndicatorsLoading}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <EarlyDetectionStateRankingChart
              loading={earlyDetectionIndicatorsLoading}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <EarlyDetectionChallengeReachGoalChart
              data={earlyDetectionIndicators?.challengeGoal}
              loading={earlyDetectionIndicatorsLoading}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <EarlyDetectionScheduledExamsChart
              data={earlyDetectionIndicators?.scheduledExams}
              loading={earlyDetectionIndicatorsLoading}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <EarlyDetectionPendingSchedulingChart
              data={earlyDetectionIndicators?.pendingScheduledExams}
              loading={earlyDetectionIndicatorsLoading}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <EarlyDetectionTestsPerformedCytopathologyChart
              data={earlyDetectionIndicators?.performedExams}
              loading={earlyDetectionIndicatorsLoading}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <EarlyDetectionTestsPerformedHpvDnaChart
              data={earlyDetectionIndicators?.performedExamsHpvDna}
              loading={earlyDetectionIndicatorsLoading}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <EarlyDetectionRangeCoverageTracking
              data={earlyDetectionIndicators?.detectionTracking}
            />
          </Grid2>
        </Grid2>
      </Box>
    </Container>
  );
};

export default EarlyDetection;
