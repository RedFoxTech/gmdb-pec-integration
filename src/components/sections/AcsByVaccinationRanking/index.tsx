"use client";

import { Autocomplete, Button, TextField } from "@/components/common";
import { TableAcsByVaccinationRanking } from "@/components/Tables";
import {
  AcsByVaccinationRankingEntity,
  GetAcsByVaccinationRankingDto,
} from "@/domain/entities/acs";
import { SelectOption } from "@/domain/entities/common";
import { useAcs } from "@/hooks";
import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import { Download as DownloadIcon } from "@mui/icons-material";
import { ImmunobiolocalsEnum } from "@/domain/consts";

const MIN_DATE = `${new Date().getFullYear() - 14}-01-01`;
const MAX_DATE = `${new Date().getFullYear() - 9}-12-31`;

export type AcsByVaccinationRankingProps = {
  unitId?: string;
  aboveContent?: boolean;
  onSelectAcs?: (acs: AcsByVaccinationRankingEntity) => void;
  onFilterChange?: (acsId?: string) => void;
};

const AcsByVaccinationRanking: React.FC<AcsByVaccinationRankingProps> = ({
  unitId,
  aboveContent,
  onSelectAcs,
  onFilterChange,
}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const [filter, setFilter] = useState<{
    acs?: string | null;
    position?: string;
  }>({
    acs: null,
  });

  const [selectedFilters, setSelectedFilters] = useState<
    Omit<
      GetAcsByVaccinationRankingDto,
      "immunobiologicalIds" | "beginPatientAgeDate" | "endPatientAgeDate"
    >
  >({});

  const {
    acsList,
    acsByVaccinationRanking,
    acsByVaccinationRankingMeta,
    acsByVaccinationRankingLoading,
    acsByVaccinationRankingReportRefetch,
    acsByVaccinationRankingReportLoading,
  } = useAcs("acs-by-vaccination-ranking", {
    getAcsListOptions: {
      enabled: true,
      params: {
        units: unitId,
      },
    },
    getAcsByVaccinationRankingOptions: {
      enabled: true,
      params: {
        ...selectedFilters,
        immunobiologicalIds: ImmunobiolocalsEnum.HPV,
        beginPatientAgeDate: MIN_DATE,
        endPatientAgeDate: MAX_DATE,
        units: unitId,
      },
    },
    getAcsByVaccinationRankingReportOptions: {
      params: {
        ...selectedFilters,
        immunobiologicalIds: ImmunobiolocalsEnum.HPV,
        beginPatientAgeDate: MIN_DATE,
        endPatientAgeDate: MAX_DATE,
        units: unitId,
      },
    },
  });

  const acsOptios: SelectOption[] = useMemo(() => {
    const options = acsList.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    return [{ value: null, label: "Todos" }, ...options];
  }, [acsList]);

  const handleSubmitFilter = () => {
    onFilterChange?.(filter.acs || undefined);
    setSelectedFilters({
      acs: filter.acs || undefined,
      position: filter.position || undefined,
    });
  };

  const handleChangeAcsOption = (acsId: string) => {
    setFilter((value) => ({
      ...value,
      acs: acsId,
      position: "",
    }));
  };

  const handleChangePostionOption = (position: string) => {
    setFilter((value) => ({
      ...value,
      acs: null,
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
          disabled={acsByVaccinationRankingReportLoading}
          loading={acsByVaccinationRankingReportLoading}
          onClick={() => acsByVaccinationRankingReportRefetch()}
        >
          Exportar lista
        </Button>
      </Box>
      <Box mt="1.6rem">
        <Box display="flex" gap="1.3rem" mb="1.6rem">
          <Box flex={1}>
            <Autocomplete
              value={acsOptios.find((item) => filter.acs === item.value)}
              label="ACS"
              options={acsOptios}
              size="small"
              onChange={(_, value) =>
                handleChangeAcsOption(value?.value as string)
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
      <TableAcsByVaccinationRanking
        data={acsByVaccinationRanking}
        pagination={{
          count: acsByVaccinationRankingMeta?.totalItems ?? 0,
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
        loading={acsByVaccinationRankingLoading}
        onClick={(item) => onSelectAcs?.(item)}
      />
    </Box>
  );
};

export default AcsByVaccinationRanking;
