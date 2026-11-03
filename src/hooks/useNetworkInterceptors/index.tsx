import { ResponseStatus } from "@/domain/consts";
import useAuth from "../useAuth";
import useSnackbar from "../useSnackbar";
import { SnackbarType } from "@/contexts/SnackbarContext";
import { useCallback } from "react";
import { PromiseResponseError } from "@/services/api/api";

type useNetworkInterceptorsProps = {
  responseInterceptors: (errors: Array<PromiseResponseError | null>) => void;
};

const useNetworkInterceptors = (): useNetworkInterceptorsProps => {
  const { logoutUser } = useAuth();
  const { showSnackBar } = useSnackbar();

  const responseInterceptors = useCallback(
    (errors: Array<PromiseResponseError | null>) => {
      errors.forEach((error) => {
        switch (error?.response?.status) {
          case ResponseStatus.UNAUTHORIZED:
            logoutUser();
            showSnackBar?.({
              message: "Sua sessão expirou!",
              type: SnackbarType.WARNING,
            });
            break;
          case ResponseStatus.NO_PERMISSION:
            showSnackBar?.({
              message: "Você não tem permissão para acessar este recurso",
              type: SnackbarType.WARNING,
            });
            break;
          case ResponseStatus.BAD_GETEWAY:
            showSnackBar?.({
              message:
                "Não foi possível concluir a conexão com a prefeitura. Tente novamente em alguns instantes",
              type: SnackbarType.WARNING,
              action: {
                text: "Recarregar",
                onClick: () => window.location.reload(),
              },
            });
            break;
        }
      });
    },
    []
  );

  return {
    responseInterceptors,
  };
};

export default useNetworkInterceptors;
