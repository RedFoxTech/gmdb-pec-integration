import {
  GetPatientSchedulingDto,
  GetPatientSchedulingEntity,
  PatientExamSchedulingDto,
  PatientSchedulingEntity,
  UpdatePatientSchedulingStatusDto,
} from "@/domain/entities/patient-scheduling";
import { PatientSchedulingService } from "@/services";
import { PromiseResponseError } from "@/services/api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import useNetworkInterceptors from "../useNetworkInterceptors";
import { useEffect } from "react";

export type UsePatientSchedulingParams = {
  getPatientSchedulingsOptions: {
    enabled: boolean;
    params?: GetPatientSchedulingDto;
  };
};

const usePatientScheduling = (params?: UsePatientSchedulingParams) => {
  const { getPatientSchedulingsOptions } = params ?? {};

  const patientSchedulingService = new PatientSchedulingService();

  const { responseInterceptors } = useNetworkInterceptors();

  const {
    data: patientSchedulingsData,
    error: patientSchedulingsDataError,
    isLoading: patientSchedulingsDataLoading,
    refetch: patientSchedulingsDataRefetch,
    isFetching: patientSchedulingsDataFetching,
  } = useQuery<GetPatientSchedulingEntity, PromiseResponseError>({
    queryKey: ["GgtPatientSchedulings", getPatientSchedulingsOptions?.params],
    queryFn: () =>
      patientSchedulingService.getAll(getPatientSchedulingsOptions?.params),
    enabled: getPatientSchedulingsOptions?.enabled ?? false,
  });

  const {
    mutateAsync: registerPatientScheduling,
    error: registerPatientSchedulingError,
    isPending: registerPatientSchedulingLoading,
  } = useMutation<
    PatientSchedulingEntity,
    PromiseResponseError,
    PatientExamSchedulingDto
  >({
    mutationFn: patientSchedulingService.register,
  });

  const {
    mutateAsync: updatePatientSchedulingStatus,
    error: updatePatientSchedulingStatusError,
    isPending: updatePatientSchedulingStatusLoading,
  } = useMutation<
    PatientSchedulingEntity,
    PromiseResponseError,
    UpdatePatientSchedulingStatusDto
  >({
    mutationFn: patientSchedulingService.updateSchedulingStatus,
  });

  const {
    mutateAsync: deletePatientScheduling,
    error: deletePatientSchedulingError,
    isPending: deletePatientSchedulingLoading,
  } = useMutation<PatientSchedulingEntity, PromiseResponseError, string>({
    mutationFn: patientSchedulingService.delete,
  });

  const handleRegisterPatientScheduling = async (
    data: PatientExamSchedulingDto
  ) => {
    try {
      const result = await registerPatientScheduling(data);
      return { success: true, data: result };
    } catch (error) {
      return { error: error as PromiseResponseError };
    }
  };

  const handleDeletePatientScheduling = async (id: string) => {
    try {
      const result = await deletePatientScheduling(id);
      return { success: true, data: result };
    } catch (error) {
      return { error: error as PromiseResponseError };
    }
  };

  const handleUpdatePatientSchedulingStatus = async (
    data: UpdatePatientSchedulingStatusDto
  ) => {
    try {
      const result = await updatePatientSchedulingStatus(data);
      return { success: true, data: result };
    } catch (error) {
      return { error: error as PromiseResponseError };
    }
  };

  useEffect(() => {
    responseInterceptors([
      registerPatientSchedulingError,
      patientSchedulingsDataError,
      deletePatientSchedulingError,
      updatePatientSchedulingStatusError,
    ]);
  }, [
    deletePatientSchedulingError,
    patientSchedulingsDataError,
    registerPatientSchedulingError,
    updatePatientSchedulingStatusError,
    responseInterceptors,
  ]);

  return {
    registerPatientScheduling: handleRegisterPatientScheduling,
    registerPatientSchedulingError,
    registerPatientSchedulingLoading,
    patientSchedulings: patientSchedulingsData?.data || [],
    patientSchedulingsMeta: patientSchedulingsData?.meta,
    patientSchedulingsDataError,
    patientSchedulingsDataLoading:
      patientSchedulingsDataLoading || patientSchedulingsDataFetching,
    patientSchedulingsDataRefetch,
    deletePatientScheduling: handleDeletePatientScheduling,
    deletePatientSchedulingError,
    deletePatientSchedulingLoading,
    updatePatientSchedulingStatus: handleUpdatePatientSchedulingStatus,
    updatePatientSchedulingStatusError,
    updatePatientSchedulingStatusLoading,
  };
};

export default usePatientScheduling;
