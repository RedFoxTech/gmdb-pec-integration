import { CityHallService } from "@/services";
import { PromiseResponseError } from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";
import useNetworkInterceptors from "../useNetworkInterceptors";
import { useEffect } from "react";
import { CityHallOptionEntity } from "@/domain/entities/city-hall";

export type UseCityHallParams = {
  getCityHallOptions?: {
    enabled: boolean;
  };
};

const useCityHall = (params?: UseCityHallParams) => {
  const { getCityHallOptions } = params ?? {};

  const cityHallService = new CityHallService();

  const { responseInterceptors } = useNetworkInterceptors();

  const {
    data: cityHallOptions,
    error: cityHallOptionsError,
    isLoading: cityHallOptionsLoading,
    refetch: cityHallOptionsRefetch,
    isFetching: cityHallOptionsFetching,
  } = useQuery<CityHallOptionEntity[], PromiseResponseError>({
    queryKey: ["getCityHallOptions"],
    queryFn: cityHallService.getOptions,
    enabled: getCityHallOptions?.enabled ?? false,
  });

  useEffect(() => {
    responseInterceptors([cityHallOptionsError]);
  }, [responseInterceptors, cityHallOptionsError]);

  return {
    cityHallOptions: cityHallOptions || [],
    cityHallOptionsError,
    cityHallOptionsLoading: cityHallOptionsLoading || cityHallOptionsFetching,
    cityHallOptionsRefetch,
  };
};

export default useCityHall;
