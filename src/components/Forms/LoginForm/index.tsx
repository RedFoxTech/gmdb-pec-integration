import {
  Autocomplete,
  Button,
  PasswordInput,
  TextField,
} from "@/components/common";
import { Box } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import Zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MakeLoginDto } from "@/domain/entities/auth";
import useCityHall from "@/hooks/useCityHall";

const LoginFormSchema = Zod.object({
  cityHallId: Zod.string().min(1, "Campo obrigatório"),
  email: Zod.string().min(1, "Campo obrigatório").email("E-mail inválido"),
  password: Zod.string().min(1, "Campo obrigatório"),
});

type LoginFormSchemaProps = Zod.infer<typeof LoginFormSchema>;

export type LoginFormProps = {
  loading?: boolean;
  onSubmit: (data: MakeLoginDto) => void;
  onCityHallChange: (value: string) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({
  loading,
  onSubmit,
  onCityHallChange,
}) => {
  const { cityHallOptions } = useCityHall({
    getCityHallOptions: { enabled: true },
  });

  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    control,
  } = useForm<LoginFormSchemaProps>({
    defaultValues: {
      cityHallId: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginFormSchema),
    mode: "onBlur",
  });

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      gap="1.6rem"
      onSubmit={formSubmit(onSubmit)}
    >
      <Controller
        render={({ field: { ref, value, onChange } }) => (
          <Autocomplete
            ref={ref}
            fullWidth
            value={cityHallOptions.find((item) => item.value === value)}
            label="Prefeitura"
            options={cityHallOptions}
            error={!!errors.cityHallId}
            helperText={errors.cityHallId?.message}
            onChange={(_, option) => {
              onCityHallChange(option?.label ?? ("" as string));
              onChange(option?.value);
            }}
          />
        )}
        control={control}
        name={"cityHallId"}
      />
      <TextField
        label="Email"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register("email")}
      />
      <PasswordInput
        label="Senha"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register("password")}
      />
      <Button fullWidth sx={{ py: "1.2rem" }} type="submit" loading={loading}>
        Entrar
      </Button>
    </Box>
  );
};

export default LoginForm;
