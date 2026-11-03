import { TagEntity } from "@/domain/entities/Tag";
import { TagService } from "@/services";
import { PromiseResponseError } from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";
import useNetworkInterceptors from "../useNetworkInterceptors";
import { useEffect } from "react";

export type UseTagParams = {
  getTagsOptions?: {
    enabled: boolean;
  };
};

const useTag = (params?: UseTagParams) => {
  const { getTagsOptions } = params ?? {};

  const tagService = new TagService();

  const { responseInterceptors } = useNetworkInterceptors();

  const {
    data: tags,
    error: tagsError,
    isLoading: tagsLoading,
    refetch: tagsRefetch,
    isFetching: tagsFetching,
  } = useQuery<TagEntity[], PromiseResponseError>({
    queryKey: ["getTags"],
    queryFn: () => tagService.getAll(),
    enabled: getTagsOptions?.enabled ?? false,
  });

  useEffect(() => {
    responseInterceptors([tagsError]);
  }, [responseInterceptors, tagsError]);

  return {
    tags: tags || [],
    tagsError,
    tagsLoading: tagsLoading || tagsFetching,
    tagsRefetch,
  };
};

export default useTag;
