import { UnitService } from "@/services";
import { PromiseResponseError } from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";
import useNetworkInterceptors from "../useNetworkInterceptors";
import { useEffect } from "react";
import {
  GetUnitByVaccinationRankingDto,
  GetUnitByVaccinationRankingEntity,
  GetUnitByVaccinationRankingReportDto,
  UnitEntity,
} from "@/domain/entities/unit";

export type UseUnitParams = {
  getUnitsOptions?: {
    enabled: boolean;
  };
  getUnitsByVaccinationRankingOptions?: {
    enabled: boolean;
    params?: GetUnitByVaccinationRankingDto;
  };
  getUnitsByVaccinationRankingReportOptions?: {
    params?: GetUnitByVaccinationRankingReportDto;
  };
};

const useUnit = (origin: string, params?: UseUnitParams) => {
  const {
    getUnitsOptions,
    getUnitsByVaccinationRankingOptions,
    getUnitsByVaccinationRankingReportOptions,
  } = params ?? {};

  const unitService = new UnitService();

  const { responseInterceptors } = useNetworkInterceptors();

  const {
    data: unitsData,
    error: unitsError,
    isLoading: unitsLoading,
  } = useQuery<UnitEntity[], PromiseResponseError>({
    queryKey: ["getUnits", origin],
    queryFn: () => unitService.getAll(),
    enabled: getUnitsOptions?.enabled ?? false,
  });

  const {
    data: unitsByVaccinationRankingData,
    error: unitsByVaccinationRankingError,
    isLoading: unitsByVaccinationRankingLoading,
    refetch: unitsByVaccinationRankingRefetch,
    isRefetching: unitsByVaccinationRankingRefetching,
  } = useQuery<GetUnitByVaccinationRankingEntity, PromiseResponseError>({
    queryKey: [
      "getUnitsByVaccinationRankingData",
      getUnitsByVaccinationRankingOptions?.params,
      origin,
    ],
    queryFn: () =>
      unitService.getByVaccinationRanking(
        getUnitsByVaccinationRankingOptions?.params || {
          immunobiologicalIds: "",
        }
      ),
    enabled: getUnitsByVaccinationRankingOptions?.enabled ?? false,
  });

  const {
    isLoading: unitsByVaccinationRankingReportLoading,
    refetch: unitsByVaccinationRankingReportRefetch,
    isRefetching: unitsByVaccinationRankingReportRefetching,
    error: unitsByVaccinationRankingReportError,
  } = useQuery<undefined, PromiseResponseError>({
    queryKey: [
      "getUnitsByVaccinationRanking",
      getUnitsByVaccinationRankingReportOptions?.params,
      origin,
    ],
    queryFn: () =>
      unitService.byVaccinationRankingReport(
        getUnitsByVaccinationRankingReportOptions?.params || {
          immunobiologicalIds: "",
        }
      ),
    enabled: false,
  });

  useEffect(() => {
    responseInterceptors([
      unitsError,
      unitsByVaccinationRankingError,
      unitsByVaccinationRankingReportError,
    ]);
  }, [
    responseInterceptors,
    unitsError,
    unitsByVaccinationRankingError,
    unitsByVaccinationRankingReportError,
  ]);

  return {
    units: unitsData || [],
    unitsError,
    unitsLoading,
    unitsByVaccinationRanking: unitsByVaccinationRankingData?.data || [],
    unitsByVaccinationRankingMeta: unitsByVaccinationRankingData?.meta,
    unitsByVaccinationRankingError,
    unitsByVaccinationRankingLoading:
      unitsByVaccinationRankingLoading || unitsByVaccinationRankingRefetching,
    unitsByVaccinationRankingRefetch,
    unitsByVaccinationRankingReportLoading:
      unitsByVaccinationRankingReportLoading ||
      unitsByVaccinationRankingReportRefetching,
    unitsByVaccinationRankingReportRefetch,
    unitsByVaccinationRankingReportError,
  };
};

export default useUnit;
