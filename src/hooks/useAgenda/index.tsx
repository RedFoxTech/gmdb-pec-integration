import {
  AgendaEntity,
  GetAgendaEntity,
  GetAgendasDto,
  RegisterAgendaDto,
  UpdateAgendatDto,
} from "@/domain/entities/agenda";
import { AgendaService } from "@/services";
import { PromiseResponseError } from "@/services/api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import useNetworkInterceptors from "../useNetworkInterceptors";
import { useEffect } from "react";

export type UseAgendaParams = {
  getAgendaOptions: {
    enabled: boolean;
    params?: GetAgendasDto;
  };
};

const useAgenda = (params?: UseAgendaParams) => {
  const { getAgendaOptions } = params ?? {};

  const agendaService = new AgendaService();

  const { responseInterceptors } = useNetworkInterceptors();

  const {
    data: agendasData,
    error: agendasDataError,
    isLoading: agendasDataLoading,
    refetch: agendasDataRefetch,
    isFetching: agendasDataFetching,
  } = useQuery<GetAgendaEntity, PromiseResponseError>({
    queryKey: ["getAgendas", getAgendaOptions?.params],
    queryFn: () => agendaService.getAll(getAgendaOptions?.params),
    enabled:
      Boolean(
        getAgendaOptions?.enabled && getAgendaOptions.params?.cityHallIbge
      ) ?? false,
  });

  const {
    mutateAsync: registerAgenda,
    error: registerAgendaError,
    isPending: registerAgendaLoading,
  } = useMutation<AgendaEntity, PromiseResponseError, RegisterAgendaDto>({
    mutationFn: agendaService.register,
  });

  const {
    mutateAsync: updateAgenda,
    error: updateAgendaError,
    isPending: updateAgendaLoading,
  } = useMutation<AgendaEntity, PromiseResponseError, UpdateAgendatDto>({
    mutationFn: agendaService.update,
  });

  const {
    mutateAsync: deleteAgenda,
    error: deleteAgendaError,
    isPending: deleteAgendaLoading,
  } = useMutation<AgendaEntity, PromiseResponseError, string>({
    mutationFn: agendaService.delete,
  });

  const handleRegisterAgenda = async (data: RegisterAgendaDto) => {
    try {
      const result = await registerAgenda(data);
      return { success: true, data: result };
    } catch (error) {
      return { error: error as PromiseResponseError };
    }
  };

  const handleUpdateAgenda = async (data: UpdateAgendatDto) => {
    try {
      const result = await updateAgenda(data);
      return { success: true, data: result };
    } catch (error) {
      return { error: error as PromiseResponseError };
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteAgenda(id);
      return { success: true, data: result };
    } catch (error) {
      return { error: error as PromiseResponseError };
    }
  };

  useEffect(() => {
    responseInterceptors([
      registerAgendaError,
      registerAgendaError,
      updateAgendaError,
      deleteAgendaError,
    ]);
  }, [
    deleteAgendaError,
    registerAgendaError,
    responseInterceptors,
    updateAgendaError,
  ]);

  return {
    agendas: agendasData?.data || [],
    agendaMeta: agendasData?.meta,
    agendasDataError,
    agendasDataLoading: agendasDataLoading || agendasDataFetching,
    agendasDataRefetch,
    registerAgenda: handleRegisterAgenda,
    registerAgendaError,
    registerAgendaLoading,
    updateAgenda: handleUpdateAgenda,
    updateAgendaError,
    updateAgendaLoading,
    deleteAgenda: handleDelete,
    deleteAgendaError,
    deleteAgendaLoading,
  };
};

export default useAgenda;
