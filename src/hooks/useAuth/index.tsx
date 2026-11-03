"use client";

import { AuthService } from "@/services";
import { useCookies } from "react-cookie";
import { useMutation } from "@tanstack/react-query";

// Consts
import {
  CookieKeys,
  LocalStorageKeys,
  PageEnum,
  UserProfiles,
} from "@/domain/consts";

// Types
import type { LoginTokenEntity, MakeLoginDto } from "@/domain/entities/auth";
import type { PromiseResponse, PromiseResponseError } from "@/services/api/api";
import { useRouter } from "next/navigation";

type useAuthProps = {
  login: (data: MakeLoginDto) => PromiseResponse<LoginTokenEntity>;
  loginError: PromiseResponseError | null;
  isLoginLoading: boolean;
  isAuthenticated: boolean;
  logoutUser: () => void;
};

const useAuth = (): useAuthProps => {
  const authService = new AuthService();
  const router = useRouter();
  const [getCookie, setCookie, removeCookie] = useCookies([
    CookieKeys.AUTH_TOKEN,
    CookieKeys.USER_ROLE,
  ]);

  const addCookie = (name: CookieKeys, value: string) => {
    setCookie(name, value, {
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
  };

  const {
    mutateAsync: makeLogin,
    error: loginError,
    isPending: isLoginLoading,
  } = useMutation<LoginTokenEntity, PromiseResponseError, MakeLoginDto>({
    mutationFn: authService.login,
    onSuccess: (data) => {
      addCookie(CookieKeys.USER_ROLE, UserProfiles.AUTHORIZED);
      addCookie(CookieKeys.AUTH_TOKEN, data.accessToken);
    },
  });

  const login = async (data: MakeLoginDto) => {
    try {
      const result = await makeLogin(data);
      return { data: result };
    } catch (error) {
      return { error: error as PromiseResponseError };
    }
  };

  const logoutUser = () => {
    removeCookie(CookieKeys.AUTH_TOKEN, { path: "/" });
    removeCookie(CookieKeys.USER_ROLE, { path: "/" });
    localStorage.removeItem(LocalStorageKeys.CITY_HALL);
    window.clarity?.("set", LocalStorageKeys.CITY_HALL, "desconhecida");
    router.push(PageEnum.LOGIN);
  };

  return {
    login,
    loginError,
    isLoginLoading,
    isAuthenticated: !!getCookie.token,
    logoutUser,
  };
};

export default useAuth;
