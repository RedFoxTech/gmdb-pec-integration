import { AcsService } from "@/services";
import { PromiseResponseError } from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useNetworkInterceptors from "../useNetworkInterceptors";
import {
  AcsEntity,
  GetAcsByVaccinationRankingDto,
  GetAcsByVaccinationRankingEntity,
  GetAcsByVaccinationRankingReportDto,
} from "@/domain/entities/acs";
import { GetAcsDto } from "@/domain/entities/acs/dto/get-acs.dto";

export type useAcsParams = {
  getAcsListOptions?: {
    enabled: boolean;
    params?: GetAcsDto;
  };
  getAcsByVaccinationRankingOptions?: {
    enabled: boolean;
    params?: GetAcsByVaccinationRankingDto;
  };
  getAcsByVaccinationRankingReportOptions?: {
    params?: GetAcsByVaccinationRankingReportDto;
  };
};

const useAcs = (origin: string, params?: useAcsParams) => {
  const {
    getAcsListOptions,
    getAcsByVaccinationRankingOptions,
    getAcsByVaccinationRankingReportOptions,
  } = params ?? {};

  const acsService = new AcsService();

  const { responseInterceptors } = useNetworkInterceptors();

  const {
    data: acsList,
    error: acsListError,
    isLoading: acsListLoading,
    refetch: acsListRefetch,
    isFetching: acsListFetching,
  } = useQuery<AcsEntity[], PromiseResponseError>({
    queryKey: ["getAcsList", getAcsListOptions?.params, origin],
    queryFn: () => acsService.getAll(getAcsListOptions?.params || {}),
    enabled: getAcsListOptions?.enabled ?? false,
  });

  const {
    data: acsByVaccinationRankingData,
    error: acsByVaccinationRankingError,
    isLoading: acsByVaccinationRankingLoading,
    refetch: acsByVaccinationRankingRefetch,
    isRefetching: acsByVaccinationRankingRefetching,
  } = useQuery<GetAcsByVaccinationRankingEntity, PromiseResponseError>({
    queryKey: [
      "getAcsByVaccinationRankingData",
      getAcsByVaccinationRankingOptions?.params,
      origin,
    ],
    queryFn: () =>
      acsService.getByVaccinationRanking(
        getAcsByVaccinationRankingOptions?.params || { immunobiologicalIds: "" }
      ),
    enabled: getAcsByVaccinationRankingOptions?.enabled ?? false,
  });

  const {
    isLoading: acsByVaccinationRankingReportLoading,
    refetch: acsByVaccinationRankingReportRefetch,
    isRefetching: acsByVaccinationRankingReportRefetching,
    error: acsByVaccinationRankingReportError,
  } = useQuery<undefined, PromiseResponseError>({
    queryKey: [
      "getAcsByVaccinationRanking",
      getAcsByVaccinationRankingReportOptions?.params,
      origin,
    ],
    queryFn: () =>
      acsService.byVaccinationRankingReport(
        getAcsByVaccinationRankingReportOptions?.params || {
          immunobiologicalIds: "",
        }
      ),
    enabled: false,
  });

  useEffect(() => {
    responseInterceptors([
      acsListError,
      acsByVaccinationRankingError,
      acsByVaccinationRankingReportError,
    ]);
  }, [
    responseInterceptors,
    acsListError,
    acsByVaccinationRankingError,
    acsByVaccinationRankingReportError,
  ]);

  return {
    acsList: acsList || [],
    acsListError,
    acsListLoading: acsListLoading || acsListFetching,
    acsListRefetch,
    acsByVaccinationRanking: acsByVaccinationRankingData?.data || [],
    acsByVaccinationRankingMeta: acsByVaccinationRankingData?.meta,
    acsByVaccinationRankingError,
    acsByVaccinationRankingLoading:
      acsByVaccinationRankingLoading || acsByVaccinationRankingRefetching,
    acsByVaccinationRankingRefetch,
    acsByVaccinationRankingReportRefetch,
    acsByVaccinationRankingReportLoading:
      acsByVaccinationRankingReportLoading ||
      acsByVaccinationRankingReportRefetching,
    acsByVaccinationRankingReportError,
  };
};

export default useAcs;
