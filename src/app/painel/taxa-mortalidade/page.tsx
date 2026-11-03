"use client";

import { Box, Container, Grid2 } from "@mui/material";
import { Button, InputDate, Text } from "@/components/common";
import typography from "@/shared/theme/typography-theme";
import dateUtils from "@/shared/date";
import { useState } from "react";
import { Dayjs } from "dayjs";
import { GetHpvIndicatorsDto } from "@/domain/entities/indicators";
import {
  MortalityRateChart,
  MortalityRateIncidenceRateChart,
  MortalityRateStateRankingChart,
} from "@/components/MortalityRate/indicators";

const MortalityRate = () => {
  const [filter, setFilter] = useState<{
    year: Dayjs;
  }>({
    year: dateUtils(),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSelectedFilters] = useState<GetHpvIndicatorsDto>({
    year: dateUtils().format("YYYY"),
  });

  const handleFilter = () => {
    setSelectedFilters({
      year: filter.year.format("YYYY"),
    });
  };

  return (
    <Container>
      <Box>
        <Text {...typography.title.h1l}>Taxa de mortalidade</Text>
        <Text {...typography.paragraph.l2} color="#838383" mt="2.8rem">
          Última atualização dos dados em {dateUtils().format("DD/MM/YYYY")}
        </Text>
      </Box>
      <Box my="3.5rem">
        <Box display="flex" gap="2.4rem" mt="2rem">
          <Box>
            <InputDate
              value={filter.year}
              views={["year"]}
              fullWidth
              label="Ano"
              size="small"
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
        <Grid2 container spacing="2.4rem">
          <Grid2 size={{ xs: 12, md: 4 }}>
            <MortalityRateChart />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <MortalityRateStateRankingChart />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <MortalityRateIncidenceRateChart />
          </Grid2>
        </Grid2>
      </Box>
    </Container>
  );
};

export default MortalityRate;
