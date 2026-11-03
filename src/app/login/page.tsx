"use client";

import { Box } from "@mui/material";
import { Text } from "@/components/common";
import typography from "@/shared/theme/typography-theme";
import { LoginForm } from "@/components/Forms";
import { useAuth, useSnackbar } from "@/hooks";
import { useRouter } from "next/navigation";
import { MakeLoginDto } from "@/domain/entities/auth";
import { LocalStorageKeys, PageEnum } from "@/domain/consts";
import { SnackbarType } from "@/contexts/SnackbarContext";
import theme from "@/shared/theme/material-theme";
import Image from "next/image";
import { normalizeCityHall } from "@/shared/stringUtils";

const Login = () => {
  const { login, isLoginLoading } = useAuth();
  const { showSnackBar } = useSnackbar();
  const router = useRouter();

  const handleLoginUser = async (data: MakeLoginDto) => {
    const { error } = await login(data);
    if (error) {
      showSnackBar?.({
        message: error.response?.data.message ?? "Um erro inesperado ocorreu",
        type: SnackbarType.ERROR,
      });
    } else {
      const cityHallName =
        localStorage.getItem(LocalStorageKeys.CITY_HALL) || "desconhecida";
      window.clarity?.("set", LocalStorageKeys.CITY_HALL, cityHallName);
      router.push(PageEnum.PATIENT_MANAGEMENT_VACCINATION_HPV);
    }
  };

  const handleCityHallChange = (value: string) => {
    const cityHallName = value ? normalizeCityHall(value) : "desconhecida";
    localStorage.setItem(LocalStorageKeys.CITY_HALL, cityHallName);
    window.clarity?.("set", LocalStorageKeys.CITY_HALL, cityHallName);
  };

  return (
    <Box>
      <Text
        component="h1"
        color={theme.palette.primary.main}
        {...typography.title.h0}
      >
        Plataforma <br />
        Grupo Mulheres <br />
        do Brasil
      </Text>
      <Text
        component="h2"
        color={theme.palette.primary.main}
        {...typography.title.h3l}
        mt="1.2rem"
      >
        Saúde e proteção para todos
      </Text>
      <Text
        color={theme.palette.primary.main}
        {...typography.title.h3l}
        mt="3rem"
      >
        Fazer login
      </Text>
      <Text color={theme.palette.primary.main} {...typography.paragraph.l2}>
        Escolha sua prefeitura e faça login com seu e-mail e senha.
      </Text>
      <Box mt="3.2rem">
        <LoginForm
          onSubmit={handleLoginUser}
          onCityHallChange={handleCityHallChange}
          loading={isLoginLoading}
        />
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2.4rem">
        <Box flex={1} textAlign="center">
          <Text color="#B6B6B6" {...typography.paragraph.r4}>
            Inciativa:
          </Text>
        </Box>
        <Box flex={1} textAlign="center">
          <Text color="#B6B6B6" {...typography.paragraph.r4}>
            Gestão:
          </Text>
        </Box>
        <Box flex={1} textAlign="center">
          <Text color="#B6B6B6" {...typography.paragraph.r4}>
            Parceiro:
          </Text>
        </Box>
        <Box flex={1} textAlign="center">
          <Text color="#B6B6B6" {...typography.paragraph.r4}>
            Executor:
          </Text>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt="0.8rem"
      >
        <Box flex={1} textAlign="center">
          <Image
            src="/icons/logo-bndes.svg"
            width={84}
            height={33}
            alt="logo"
            quality={100}
          />
        </Box>
        <Box flex={1} textAlign="center">
          {" "}
          <Image
            src="/icons/logo-idis.svg"
            width={80}
            height={42}
            alt="logo"
            quality={100}
          />
        </Box>
        <Box flex={1} textAlign="center">
          <Image
            src="/icons/logo-umane.svg"
            width={78}
            height={30}
            alt="logo"
            quality={100}
          />
        </Box>
        <Box flex={1} textAlign="center">
          <Image
            src="/icons/logo-mulheres.svg"
            width={77}
            height={45}
            alt="logo"
            quality={100}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
