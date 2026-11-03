import {
  CampaignEntity,
  GetCampaignEntity,
  GetCampaignReportDto,
  GetCampaignsDto,
  GetCampaignTargetAudienceReportDto,
  RegisterCampaignDto,
  UpdateCampaignDto,
} from "@/domain/entities/campaign";
import { CampaignService } from "@/services";
import { PromiseResponseError } from "@/services/api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import useNetworkInterceptors from "../useNetworkInterceptors";
import { useEffect } from "react";

export type UseCampaignParams = {
  getCampaignsOptions?: {
    enabled: boolean;
    params?: GetCampaignsDto;
  };
  getGeneralReportOptions?: {
    params?: GetCampaignReportDto;
  };
  getCampaignTargetAudiencelReportOptions?: {
    params?: GetCampaignTargetAudienceReportDto;
  };
};

const useCampaign = (params?: UseCampaignParams) => {
  const {
    getCampaignsOptions,
    getGeneralReportOptions,
    getCampaignTargetAudiencelReportOptions,
  } = params ?? {};

  const campaignService = new CampaignService();

  const { responseInterceptors } = useNetworkInterceptors();

  const {
    data: campaignsData,
    error: campaignsDataError,
    isLoading: campaignsDataLoading,
    refetch: campaignsDataRefetch,
    isFetching: campaignsDataFetching,
  } = useQuery<GetCampaignEntity, PromiseResponseError>({
    queryKey: ["getCampaigns", getCampaignsOptions?.params],
    queryFn: () => campaignService.getAll(getCampaignsOptions?.params),
    enabled: getCampaignsOptions?.enabled ?? false,
  });

  const {
    mutateAsync: registerCampaign,
    error: registerCampaignError,
    isPending: registerCampaignLoading,
  } = useMutation<CampaignEntity, PromiseResponseError, RegisterCampaignDto>({
    mutationFn: campaignService.register,
  });

  const {
    mutateAsync: updateCampaign,
    error: updateCampaignError,
    isPending: updateCampaignLoading,
  } = useMutation<CampaignEntity, PromiseResponseError, UpdateCampaignDto>({
    mutationFn: campaignService.update,
  });

  const {
    mutateAsync: deleteCampaign,
    error: deleteCampaignError,
    isPending: deleteCampaignLoading,
  } = useMutation<CampaignEntity, PromiseResponseError, string>({
    mutationFn: campaignService.delete,
  });

  const {
    isLoading: getGeneralReportLoading,
    refetch: getGeneralReportRefetch,
    error: getGeneralReportError,
  } = useQuery<undefined, PromiseResponseError>({
    queryKey: ["getGeneralReport", getGeneralReportOptions?.params],
    queryFn: () =>
      campaignService.generalReport(
        getGeneralReportOptions?.params || { id: "0" }
      ),
    enabled: false,
  });

  const {
    isLoading: getCampaignTargetAudienceReportLoading,
    refetch: getCampaignTargetAudienceReportRefetch,
    error: getCampaignTargetAudienceReportError,
  } = useQuery<undefined, PromiseResponseError>({
    queryKey: [
      "getGeneralReport",
      getCampaignTargetAudiencelReportOptions?.params,
    ],
    queryFn: () =>
      campaignService.targetAudienceReport(
        getCampaignTargetAudiencelReportOptions?.params || { id: "0" }
      ),
    enabled: false,
  });

  const handleRegisterCampaign = async (data: RegisterCampaignDto) => {
    try {
      const result = await registerCampaign(data);
      return { success: true, data: result };
    } catch (error) {
      return { error: error as PromiseResponseError };
    }
  };

  const handleUpdateCampaign = async (data: UpdateCampaignDto) => {
    try {
      const result = await updateCampaign(data);
      return { success: true, data: result };
    } catch (error) {
      return { error: error as PromiseResponseError };
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteCampaign(id);
      return { success: true, data: result };
    } catch (error) {
      return { error: error as PromiseResponseError };
    }
  };

  useEffect(() => {
    responseInterceptors([
      campaignsDataError,
      registerCampaignError,
      updateCampaignError,
      deleteCampaignError,
      getGeneralReportError,
    ]);
  }, [
    campaignsDataError,
    deleteCampaignError,
    registerCampaignError,
    responseInterceptors,
    updateCampaignError,
    getGeneralReportLoading,
    getGeneralReportError,
  ]);

  return {
    campaigns: campaignsData?.data || [],
    campaignsMeta: campaignsData?.meta,
    campaignsDataError,
    campaignsDataLoading: campaignsDataLoading || campaignsDataFetching,
    campaignsDataRefetch,
    registerCampaign: handleRegisterCampaign,
    registerCampaignError,
    registerCampaignLoading,
    updateCampaign: handleUpdateCampaign,
    updateCampaignError,
    updateCampaignLoading,
    deleteCampaign: handleDelete,
    deleteCampaignError,
    deleteCampaignLoading,
    getGeneralReportRefetch,
    getGeneralReportLoading,
    getGeneralReportError,
    getCampaignTargetAudienceReportRefetch,
    getCampaignTargetAudienceReportLoading,
    getCampaignTargetAudienceReportError,
  };
};

export default useCampaign;
