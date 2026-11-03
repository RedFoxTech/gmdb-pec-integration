import { FileService } from "@/services";
import { PromiseResponseError } from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useNetworkInterceptors from "../useNetworkInterceptors";
import { GetPrivateFileEntity } from "@/domain/entities/File";

export type UseFileParams = {
  getPrivateUrlOptions?: {
    enabled: boolean;
    params: string;
  };
};

const useFile = (params?: UseFileParams) => {
  const { getPrivateUrlOptions } = params ?? {};

  const fileService = new FileService();

  const { responseInterceptors } = useNetworkInterceptors();

  const {
    data: privateFileUrl,
    error: privateFileUrlError,
    isLoading: privateFileUrlLoading,
    refetch: privateFileUrlRefetch,
    isFetching: privateFileUrlFetching,
  } = useQuery<GetPrivateFileEntity, PromiseResponseError>({
    queryKey: ["getPrivateFileUrl"],
    queryFn: () =>
      fileService.getPrivateUrl(getPrivateUrlOptions?.params ?? ""),
    enabled: getPrivateUrlOptions?.enabled ?? false,
  });

  useEffect(() => {
    responseInterceptors([privateFileUrlError]);
  }, [responseInterceptors, privateFileUrlError]);

  return {
    privateFileUrl,
    privateFileUrlError,
    acsListLoading: privateFileUrlLoading || privateFileUrlFetching,
    privateFileUrlRefetch,
  };
};

export default useFile;
