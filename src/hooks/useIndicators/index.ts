import { IndicatorsService } from "@/services";
import { PromiseResponseError } from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";
import useNetworkInterceptors from "../useNetworkInterceptors";
import { useEffect } from "react";
import {
  GetEarlyDetectionIndicatorsDto,
  GetEarlyDetectionIndicatorsEntity,
  GetHpvIndicatorsDto,
  GetHpvIndicatorsEntity,
} from "@/domain/entities/indicators";

export type UseIndicatorsParams = {
  getHpvIndicators?: {
    enabled: boolean;
    params: GetHpvIndicatorsDto;
  };
  getEarlyDetectionIndicators?: {
    enabled: boolean;
    params: GetEarlyDetectionIndicatorsDto;
  };
};

const useIndicators = (params?: UseIndicatorsParams) => {
  const { getHpvIndicators, getEarlyDetectionIndicators } = params ?? {};

  const indicatorsService = new IndicatorsService();

  const { responseInterceptors } = useNetworkInterceptors();

  const {
    data: hpvIndicators,
    error: hpvIndicatorsError,
    isLoading: hpvIndicatorsLoading,
    refetch: hpvIndicatorsRefetch,
    isFetching: hpvIndicatorsFetching,
  } = useQuery<GetHpvIndicatorsEntity, PromiseResponseError>({
    queryKey: ["getHpvIndicators", getHpvIndicators?.params],
    queryFn: () =>
      indicatorsService.getHpvIndicators(
        getHpvIndicators?.params || { year: "" }
      ),
    enabled: getHpvIndicators?.enabled ?? false,
  });

  const {
    data: earlyDetectionIndicators,
    error: earlyDetectionIndicatorsError,
    isLoading: earlyDetectionIndicatorsLoading,
    refetch: earlyDetectionIndicatorsRefetch,
    isFetching: earlyDetectionIndicatorsFetching,
  } = useQuery<GetEarlyDetectionIndicatorsEntity, PromiseResponseError>({
    queryKey: [
      "getEarlyDetectionIndicators",
      getEarlyDetectionIndicators?.params,
    ],
    queryFn: () =>
      indicatorsService.getEarlyDetectionIndicators(
        getEarlyDetectionIndicators?.params || { year: "" }
      ),
    enabled: getEarlyDetectionIndicators?.enabled ?? false,
  });

  useEffect(() => {
    responseInterceptors([hpvIndicatorsError, earlyDetectionIndicatorsError]);
  }, [responseInterceptors, hpvIndicatorsError, earlyDetectionIndicatorsError]);

  return {
    hpvIndicators,
    hpvIndicatorsError,
    hpvIndicatorsLoading: hpvIndicatorsLoading || hpvIndicatorsFetching,
    hpvIndicatorsRefetch,
    earlyDetectionIndicators,
    earlyDetectionIndicatorsError,
    earlyDetectionIndicatorsLoading:
      earlyDetectionIndicatorsLoading || earlyDetectionIndicatorsFetching,
    earlyDetectionIndicatorsRefetch,
  };
};

export default useIndicators;
