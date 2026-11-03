import { AppointmentService } from "@/services";
import { PromiseResponseError } from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useNetworkInterceptors from "../useNetworkInterceptors";
import {
  GetExamAppointmentsDto,
  GetExamAppointmentsEntity,
  GetExamsDto,
  GetExamsEntity,
  GetExamsReportDto,
} from "@/domain/entities/exam";

export type useExamParams = {
  getExamsOptions?: {
    enabled: boolean;
    params?: GetExamsDto;
  };
  getExamAppointmentsOptions?: {
    enabled: boolean;
    params?: GetExamAppointmentsDto;
  };
  getExamsReportOptions?: {
    params?: GetExamsReportDto;
  };
};

const useExam = (params?: useExamParams) => {
  const { getExamsOptions, getExamAppointmentsOptions, getExamsReportOptions } =
    params ?? {};

  const appointmentService = new AppointmentService();

  const [streamProgress, setStreamProgress] = useState(0);
  const [streamMessage, setStreamMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const startExamExportStream = () => {
    if (!getExamsReportOptions?.params) return;
    setIsExporting(true);
    setStreamProgress(0);
    setStreamMessage("Iniciando exportação...");
    
    appointmentService.exportStream(
      getExamsReportOptions.params,
      (progress, message) => {
        setStreamProgress(progress);
        setStreamMessage(message);
      },
      () => {
        setIsExporting(false);
      },
      (error) => {
        setIsExporting(false);
        console.error("Export stream error:", error);
      }
    );
  };

  const { responseInterceptors } = useNetworkInterceptors();

  const {
    data: examsData,
    error: examsError,
    isLoading: examsLoading,
    isFetching: examsFetching,
    refetch: examsRefetch,
  } = useQuery<GetExamsEntity, PromiseResponseError>({
    queryKey: ["getExams", getExamsOptions?.params],
    queryFn: () => appointmentService.getAll(getExamsOptions?.params),
    enabled: getExamsOptions?.enabled ?? false,
  });

  const {
    data: examAppointmentsData,
    error: examAppointmentsError,
    isLoading: examAppointmentsLoading,
    isFetching: examAppointmentsFetching,
    refetch: examAppointmentsRefetch,
  } = useQuery<GetExamAppointmentsEntity, PromiseResponseError>({
    queryKey: ["getExamAppointments", getExamAppointmentsOptions?.params],
    queryFn: () =>
      appointmentService.getExamAppointmentsByPatientId(
        getExamAppointmentsOptions?.params || { patientId: "" }
      ),
    enabled: getExamAppointmentsOptions?.enabled ?? false,
  });

  const {
    isLoading: examsReportLoading,
    refetch: examsReportRefetch,
    isRefetching: examsReportRefetching,
    error: examsReportError,
  } = useQuery<undefined, PromiseResponseError>({
    queryKey: ["getGeneralReport", getExamsReportOptions?.params],
    queryFn: () =>
      appointmentService.generalReport(getExamsReportOptions?.params || {}),
    enabled: false,
  });

  useEffect(() => {
    responseInterceptors([examsError, examAppointmentsError, examsReportError]);
  }, [
    responseInterceptors,
    examsError,
    examAppointmentsError,
    examsReportError,
  ]);

  return {
    exams: examsData?.data || [],
    examsMeta: examsData?.meta,
    examsError,
    examsLoading: examsLoading || examsFetching,
    examsRefetch,
    examAppointments: examAppointmentsData?.data || [],
    examAppointmentsMeta: examAppointmentsData?.meta,
    examAppointmentsError,
    examAppointmentsLoading:
      examAppointmentsLoading || examAppointmentsFetching,
    examAppointmentsRefetch,
    examsReportLoading,
    examsReportRefetch,
    examsReportRefetching,
    examsReportError,
    streamProgress,
    streamMessage,
    isExporting,
    startExamExportStream,
  };
};

export default useExam;
