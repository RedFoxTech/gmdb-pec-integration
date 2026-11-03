import {
  GetAllUsersDto,
  GetUsersEntity,
  RegisterUserDto,
  UpdateUserDto,
  UserAdminEntity,
} from "@/domain/entities/user";
import { UserService } from "@/services";
import { PromiseResponseError } from "@/services/api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import useNetworkInterceptors from "../useNetworkInterceptors";
import { useEffect } from "react";
import { UserProfiles } from "@/domain/consts";

export type UsePatientParams = {
  getAllAppUsersOptions?: {
    enabled: boolean;
    params?: Omit<GetAllUsersDto, "profileId">;
  };
};

const useUser = (params: UsePatientParams) => {
  const { getAllAppUsersOptions } = params ?? {};

  const userService = new UserService();

  const { responseInterceptors } = useNetworkInterceptors();

  const {
    data: allAppUsers,
    error: allAppUsersError,
    isLoading: allAppUsersLoading,
    refetch: allAppUsersRefetch,
    isFetching: allAppUsersFetching,
  } = useQuery<GetUsersEntity, PromiseResponseError>({
    queryKey: ["getAllVaccinatedPatients", getAllAppUsersOptions?.params],
    queryFn: () =>
      userService.getAll({
        profileIds: [UserProfiles.ADMIN, UserProfiles.MASTER_ADMIN].join("|"),
        ...getAllAppUsersOptions?.params,
      }),
    enabled: getAllAppUsersOptions?.enabled ?? false,
  });

  const {
    mutateAsync: registerUser,
    error: registerUserError,
    isPending: registerUserLoading,
  } = useMutation<UserAdminEntity, PromiseResponseError, RegisterUserDto>({
    mutationFn: userService.register,
  });

  const {
    mutateAsync: updateUser,
    error: updateUserError,
    isPending: updateUserLoading,
  } = useMutation<UserAdminEntity, PromiseResponseError, UpdateUserDto>({
    mutationFn: userService.update,
  });

  const handleRegisterUser = async (data: RegisterUserDto) => {
    try {
      const result = await registerUser(data);
      return { success: true, data: result };
    } catch (error) {
      return { error: error as PromiseResponseError };
    }
  };

  const handleUpdateUser = async (data: UpdateUserDto) => {
    try {
      const result = await updateUser(data);
      return { success: true, data: result };
    } catch (error) {
      return { error: error as PromiseResponseError };
    }
  };

  useEffect(() => {
    responseInterceptors([
      allAppUsersError,
      registerUserError,
      updateUserError,
    ]);
  }, [
    allAppUsersError,
    registerUserError,
    responseInterceptors,
    updateUserError,
  ]);

  return {
    allAppUsers: (allAppUsers?.data || []) as UserAdminEntity[],
    allAppUsersError,
    allAppUsersLoading: allAppUsersLoading || allAppUsersFetching,
    allAppUsersLoadingMeta: allAppUsers?.meta,
    allAppUsersRefetch,
    registerUser: handleRegisterUser,
    registerUserError,
    registerUserLoading,
    updateUser: handleUpdateUser,
    updateUserError,
    updateUserLoading,
  };
};

export default useUser;
