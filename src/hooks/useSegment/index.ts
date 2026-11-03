import { SegmentEntity } from "@/domain/entities/segment";
import { SegmentService } from "@/services";
import { PromiseResponseError } from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useNetworkInterceptors from "../useNetworkInterceptors";

export type useSegmentParams = {
  getSegmentsOptions?: {
    enabled: boolean;
  };
};

const useSegment = (params?: useSegmentParams) => {
  const { getSegmentsOptions } = params ?? {};

  const segmentService = new SegmentService();

  const { responseInterceptors } = useNetworkInterceptors();

  const {
    data: segments,
    error: segmentsError,
    isLoading: segmentsLoading,
    refetch: segmentsRefetch,
    isFetching: segmentsFetching,
  } = useQuery<SegmentEntity[], PromiseResponseError>({
    queryKey: ["getSegments"],
    queryFn: () => segmentService.getAll(),
    enabled: getSegmentsOptions?.enabled ?? false,
  });

  useEffect(() => {
    responseInterceptors([segmentsError]);
  }, [responseInterceptors, segmentsError]);

  return {
    segments: segments || [],
    segmentsError,
    segmentsLoading: segmentsLoading || segmentsFetching,
    segmentsRefetch,
  };
};

export default useSegment;
