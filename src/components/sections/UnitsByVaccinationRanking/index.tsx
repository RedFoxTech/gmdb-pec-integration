"use client";

import { Autocomplete, Button, TextField } from "@/components/common";
import { TableUnitsByVaccinationRanking } from "@/components/Tables";
import { SelectOption } from "@/domain/entities/common";
import {
  GetUnitByVaccinationRankingDto,
  UnitByVaccinationRankingEntity,
} from "@/domain/entities/unit";
import { useUnit } from "@/hooks";
import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import { Download as DownloadIcon } from "@mui/icons-material";
import { ImmunobiolocalsEnum } from "@/domain/consts";

const MIN_DATE = `${new Date().getFullYear() - 14}-01-01`;
const MAX_DATE = `${new Date().getFullYear() - 9}-12-31`;

export type UnitsByVaccinationRankingProps = {
  aboveContent?: boolean;
  onSelectUnit?: (unit: UnitByVaccinationRankingEntity) => void;
  onFilterChange?: (unitId?: string) => void;
};

const UnitsByVaccinationRanking: React.FC<UnitsByVaccinationRankingProps> = ({
  aboveContent,
  onSelectUnit,
  onFilterChange,
}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const [filter, setFilter] = useState<{
    units?: string | null;
    position?: string;
  }>({
    units: null,
  });

  const [selectedFilters, setSelectedFilters] = useState<
    Omit<
      GetUnitByVaccinationRankingDto,
      "immunobiologicalIds" | "beginPatientAgeDate" | "endPatientAgeDate"
    >
  >({});

  const {
    units,
    unitsByVaccinationRanking,
    unitsByVaccinationRankingMeta,
    unitsByVaccinationRankingLoading,
    unitsByVaccinationRankingReportRefetch,
    unitsByVaccinationRankingReportLoading,
  } = useUnit("unit-by-vaccionation-ranking", {
    getUnitsOptions: {
      enabled: true,
    },
    getUnitsByVaccinationRankingOptions: {
      enabled: true,
      params: {
        ...selectedFilters,
        immunobiologicalIds: ImmunobiolocalsEnum.HPV,
        beginPatientAgeDate: MIN_DATE,
        endPatientAgeDate: MAX_DATE,
      },
    },
    getUnitsByVaccinationRankingReportOptions: {
      params: {
        ...selectedFilters,
        immunobiologicalIds: ImmunobiolocalsEnum.HPV,
        beginPatientAgeDate: MIN_DATE,
        endPatientAgeDate: MAX_DATE,
      },
    },
  });

  const unitOptios: SelectOption[] = useMemo(() => {
    const options = units.map((item) => ({
      value: item.id,
      label: `${item.name} - ${item.address ?? ""}, ${
        item.addressNumber ?? ""
      }`,
    }));

    return [{ value: null, label: "Todos" }, ...options];
  }, [units]);

  const handleSubmitFilter = () => {
    onFilterChange?.(filter.units || undefined);
    setSelectedFilters({
      units: filter.units || undefined,
      position: filter.position || undefined,
    });
  };

  const handleChangeUnitOption = (unitId: string) => {
    setFilter((value) => ({
      ...value,
      units: unitId,
      position: "",
    }));
  };

  const handleChangePostionOption = (position: string) => {
    setFilter((value) => ({
      ...value,
      units: null,
      position,
    }));
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        mt={aboveContent ? "-7.6rem" : "0"}
        mb="3.3rem"
      >
        <Button
          variant="outlined"
          startIcon={<DownloadIcon sx={{ width: "2rem", height: "2rem" }} />}
          disabled={unitsByVaccinationRankingReportLoading}
          loading={unitsByVaccinationRankingReportLoading}
          onClick={() => unitsByVaccinationRankingReportRefetch()}
        >
          Exportar lista
        </Button>
      </Box>
      <Box mt="1.6rem">
        <Box display="flex" gap="1.3rem" mb="1.6rem">
          <Box flex={1}>
            <Autocomplete
              value={unitOptios.find((item) => filter.units === item.value)}
              label="UBS"
              options={unitOptios}
              size="small"
              onChange={(_, value) =>
                handleChangeUnitOption(value?.value as string)
              }
            />
          </Box>
          <Box flex={1}>
            <TextField
              label="Ranking"
              value={filter.position}
              size="small"
              type="number"
              onChange={(e) => handleChangePostionOption(e.target.value)}
            />
          </Box>
          <Button variant="contained" onClick={handleSubmitFilter}>
            Filtrar
          </Button>
        </Box>
      </Box>
      <TableUnitsByVaccinationRanking
        data={unitsByVaccinationRanking}
        pagination={{
          count: unitsByVaccinationRankingMeta?.totalItems ?? 0,
          rowsPerPageOptions: [10, 25, 50],
          rowsPerPage: pagination.pageSize,
          page: pagination.page,
          onPageChange: (value) =>
            setPagination((v) => ({ ...v, page: value })),
          onRowsPerPageChange: (value) =>
            setPagination((v) => ({
              ...v,
              pageSize: value,
            })),
        }}
        loading={unitsByVaccinationRankingLoading}
        onClick={(item) => onSelectUnit?.(item)}
      />
    </Box>
  );
};

export default UnitsByVaccinationRanking;
