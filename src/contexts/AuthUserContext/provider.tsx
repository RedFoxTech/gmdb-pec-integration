"use client";

import React, { PropsWithChildren, useEffect } from "react";
import { UserService } from "@/services";
import { AuthUserContext } from ".";
import { useAuth } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { CookieKeys } from "@/domain/consts";
import { PromiseResponseError } from "@/services/api/api";
import { UserAuthEntity } from "@/domain/entities/user";
import useNetworkInterceptors from "@/hooks/useNetworkInterceptors";

const AuthUserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const setCookie = useCookies([CookieKeys.USER_ROLE])[1];
  const { responseInterceptors } = useNetworkInterceptors();

  const userService = new UserService();

  const {
    data: authUser,
    isLoading: authUserLoading,
    error: authUserError,
    refetch: authUserRefetch,
  } = useQuery<UserAuthEntity, PromiseResponseError>({
    queryKey: ["getAuthUser"],
    queryFn: userService.me,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (authUser) {
      setCookie(CookieKeys.USER_ROLE, authUser.profileId, {
        httpOnly: false,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
    }
  }, [authUser, setCookie]);

  useEffect(() => {
    responseInterceptors([authUserError]);
  }, [authUserError, responseInterceptors]);

  return (
    <AuthUserContext.Provider
      value={{
        authUser,
        authUserLoading,
        authUserError,
        authUserRefetch: () => authUserRefetch(),
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};

export default AuthUserProvider;
