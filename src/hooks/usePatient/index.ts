import {
  ConsentFormPatientEntity,
  GetConsentFormPatientInfoDto,
  GetPatientExamSchedulingDto,
  GetPatientsDto,
  GetPatientsEntity,
  GetPatientsReportDto,
  GetVaccinationChartOptions,
  NotConsentVaccinationDto,
  PatientEntity,
  PatientExamSchedulingEntity,
  UpdatePatientDto,
  VaccinationChartEntity,
} from "@/domain/entities/patient";
import { PatientService } from "@/services";
import { PromiseResponseError } from "@/services/api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import useNetworkInterceptors from "../useNetworkInterceptors";
import { useEffect } from "react";

export type UsePatientParams = {
  getVaccinatedPatientsOptions?: {
    enabled: boolean;
    params?: Omit<GetPatientsDto, "vaccinated">;
  };
  getNotVaccinatedPatientsOptions?: {
    enabled: boolean;
    params?: Omit<GetPatientsDto, "vaccinated">;
  };
  getVaccinationChartOptions?: {
    params: GetVaccinationChartOptions;
    enabled: boolean;
  };
  getConsentFormPatientInfo?: {
    enabled: boolean;
    params: GetConsentFormPatientInfoDto;
  };
  getPatientExamScheduling?: {
    enabled: boolean;
    params: GetPatientExamSchedulingDto;
  };
  getAllPatientsOptions?: {
    enabled: boolean;
    params?: GetPatientsDto;
  };
  getPatientsReportOptions?: {
    params?: GetPatientsReportDto;
  };
};

const usePatient = (origin: string, params?: UsePatientParams) => {
  const {
    getVaccinatedPatientsOptions,
    getNotVaccinatedPatientsOptions,
    getVaccinationChartOptions,
    getConsentFormPatientInfo,
    getPatientExamScheduling,
    getAllPatientsOptions,
    getPatientsReportOptions,
  } = params ?? {};

  const patientService = new PatientService();

  const { responseInterceptors } = useNetworkInterceptors();

  const {
    data: vaccinatedPatientsData,
    error: vaccinatedPatientsError,
    isLoading: vaccinatedPatientsLoading,
    isFetching: vaccinatedPatientsFetching,
    refetch: vaccinatedPatientsRefetch,
  } = useQuery<GetPatientsEntity, PromiseResponseError>({
    queryKey: [
      "getAllVaccinatedPatients",
      origin,
      getVaccinatedPatientsOptions?.params,
    ],
    queryFn: () =>
      patientService.getAll({
        vaccinated: true,
        ...getVaccinatedPatientsOptions?.params,
        immunobiologicalIds:
          getVaccinatedPatientsOptions?.params?.immunobiologicalIds ?? "",
      }),
    enabled: getVaccinatedPatientsOptions?.enabled ?? false,
  });

  const {
    mutateAsync: updatePatient,
    error: updatePatientError,
    isPending: updatePatientLoading,
  } = useMutation<PatientEntity, PromiseResponseError, UpdatePatientDto>({
    mutationFn: patientService.update,
  });

  const {
    mutateAsync: notConsentVaccination,
    error: notConsentVaccinationError,
    isPending: notConsentVaccinationLoading,
  } = useMutation<null, PromiseResponseError, NotConsentVaccinationDto>({
    mutationFn: patientService.notConsentVaccination,
  });

  const {
    data: notVaccinatedPatientsData,
    error: notVaccinatedPatientsError,
    isLoading: notVaccinatedPatientsLoading,
    isFetching: notVaccinatedPatientsFetching,
    refetch: notVaccinatedPatientsRefetch,
  } = useQuery<GetPatientsEntity, PromiseResponseError>({
    queryKey: [
      "getAllNotVaccinatedPatients",
      origin,
      getNotVaccinatedPatientsOptions?.params,
    ],
    queryFn: () =>
      patientService.getAll({
        vaccinated: false,
        ...getNotVaccinatedPatientsOptions?.params,
        immunobiologicalIds:
          getNotVaccinatedPatientsOptions?.params?.immunobiologicalIds ?? "",
      }),
    enabled: getNotVaccinatedPatientsOptions?.enabled ?? false,
  });

  const {
    data: allPatientsData,
    error: allPatientsDataError,
    isLoading: allPatientsDataLoading,
  } = useQuery<GetPatientsEntity, PromiseResponseError>({
    queryKey: ["getAllPatientsData", origin, getAllPatientsOptions?.params],
    queryFn: () => patientService.getAll(getAllPatientsOptions?.params),
    enabled: getAllPatientsOptions?.enabled ?? false,
  });

  const {
    data: vaccinationChart,
    error: vaccinationChartError,
    isLoading: vaccinationChartLoading,
  } = useQuery<VaccinationChartEntity, PromiseResponseError>({
    queryKey: [
      "getVaccinationChartOptions",
      origin,
      getVaccinationChartOptions?.params,
    ],
    queryFn: () =>
      patientService.getVaccinationChart({
        ...getVaccinationChartOptions?.params,
        immunobiologicalIds:
          getVaccinationChartOptions?.params.immunobiologicalIds ?? "",
      }),
    enabled: getVaccinationChartOptions?.enabled ?? false,
  });

  const {
    data: consentFormPatientInfo,
    error: consentFormPatientInfoError,
    isLoading: consentFormPatientInfoLoading,
  } = useQuery<ConsentFormPatientEntity, PromiseResponseError>({
    queryKey: [
      "getConsentFormPatientInfo",
      origin,
      getConsentFormPatientInfo?.params,
    ],
    queryFn: () =>
      patientService.getConsentFormPatientInfo(
        getConsentFormPatientInfo?.params ?? { pecId: "", cityHallIbge: "" }
      ),
    enabled: Boolean(
      getConsentFormPatientInfo?.enabled &&
        getConsentFormPatientInfo.params.cityHallIbge
    ),
  });

  const {
    data: patientExamScheduling,
    error: patientExamSchedulingError,
    isLoading: patientExamSchedulingLoading,
    refetch: patientExamSchedulingRefetch,
    isFetching: patientExamSchedulingFetching,
  } = useQuery<PatientExamSchedulingEntity, PromiseResponseError>({
    queryKey: [
      "getPatientExamScheduling",
      origin,
      getPatientExamScheduling?.params,
    ],
    queryFn: () =>
      patientService.getPatientExamScheduling(
        getPatientExamScheduling?.params || { cityHallIbge: "", document: "" }
      ),
    enabled: getPatientExamScheduling?.enabled ?? false,
  });

  const {
    isLoading: patientsReportLoading,
    refetch: patientsReportRefetch,
    isRefetching: patientsReportRefetching,
    error: patientsReportError,
  } = useQuery<undefined, PromiseResponseError>({
    queryKey: ["getGeneralReport", origin, getPatientsReportOptions?.params],
    queryFn: () =>
      patientService.generalReport({
        ...getPatientsReportOptions?.params,
        immunobiologicalIds:
          getPatientsReportOptions?.params?.immunobiologicalIds ?? "",
      }),
    enabled: false,
  });

  const handleUpdatePatient = async (data: UpdatePatientDto) => {
    try {
      const result = await updatePatient(data);
      return { success: true, data: result };
    } catch (error) {
      return { error: error as PromiseResponseError };
    }
  };

  const handleNotConsentVaccination = async (
    data: NotConsentVaccinationDto
  ) => {
    try {
      const result = await notConsentVaccination(data);
      return { success: true, data: result };
    } catch (error) {
      return { error: error as PromiseResponseError };
    }
  };

  useEffect(() => {
    responseInterceptors([
      vaccinatedPatientsError,
      notVaccinatedPatientsError,
      allPatientsDataError,
      vaccinationChartError,
      updatePatientError,
      consentFormPatientInfoError,
      notConsentVaccinationError,
      patientExamSchedulingError,
      patientsReportError,
    ]);
  }, [
    allPatientsDataError,
    consentFormPatientInfoError,
    notConsentVaccinationError,
    notVaccinatedPatientsError,
    patientExamSchedulingError,
    patientsReportError,
    responseInterceptors,
    updatePatientError,
    vaccinatedPatientsError,
    vaccinationChartError,
  ]);

  return {
    vaccinatedPatients: vaccinatedPatientsData?.data || [],
    vaccinatedPatientsError,
    vaccinatedPatientsLoading:
      vaccinatedPatientsLoading || vaccinatedPatientsFetching,
    vaccinatedPatientsMeta: vaccinatedPatientsData?.meta,
    vaccinatedPatientsRefetch,
    notVaccinatedPatientsData: notVaccinatedPatientsData?.data ?? [],
    notVaccinatedPatientsError,
    notVaccinatedPatientsLoading:
      notVaccinatedPatientsLoading || notVaccinatedPatientsFetching,
    notVaccinatedPatientsMeta: notVaccinatedPatientsData?.meta,
    notVaccinatedPatientsRefetch,
    allPatientsData: allPatientsData?.data || [],
    allPatientsDataMeta: allPatientsData?.meta,
    allPatientsDataError,
    allPatientsDataLoading,
    vaccinationChart,
    vaccinationChartError,
    vaccinationChartLoading,
    updatePatient: handleUpdatePatient,
    updatePatientError,
    updatePatientLoading,
    consentFormPatientInfo,
    consentFormPatientInfoError,
    consentFormPatientInfoLoading,
    notConsentVaccination: handleNotConsentVaccination,
    notConsentVaccinationError,
    notConsentVaccinationLoading,
    patientExamScheduling,
    patientExamSchedulingError,
    patientExamSchedulingLoading:
      patientExamSchedulingLoading || patientExamSchedulingFetching,
    patientExamSchedulingRefetch,
    patientsReportRefetch,
    patientsReportLoading: patientsReportLoading || patientsReportRefetching,
    patientsReportError,
  };
};

export default usePatient;
