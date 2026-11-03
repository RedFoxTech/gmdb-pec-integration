import { PasswordInput, TextField, Text } from "@/components/common";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import Zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import mask, { removePhoneMask } from "@/shared/mask";
import typography from "@/shared/theme/typography-theme";
import { RegisterUserDto, UserAdminEntity } from "@/domain/entities/user";
import { passwordValidationRegex } from "@/shared/formUtils";

const FormSchema = Zod.object({
  name: Zod.string().min(1, "Campo obrigatório"),
  email: Zod.string().min(1, "Campo obrigatório").email("E-mail inválido"),
  phone: Zod.string().min(1, "Campo obrigatório"),
  password: Zod.string()
    .min(6, "A senha deve ter no mínimo 6 caráteres")
    .max(20, "A senha deve ter no máximo 20 caráteres")
    .regex(
      passwordValidationRegex,
      "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número"
    ),
  confirmPassword: Zod.string().min(
    6,
    "A senha deve ter no mínimo 6 caráteres"
  ),
}).superRefine((data, ctx) => {
  if (
    data.confirmPassword.length >= 6 &&
    data.password !== data.confirmPassword
  ) {
    ctx.addIssue({
      code: Zod.ZodIssueCode.custom,
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    });
  }
});

type FormSchemaProps = Zod.infer<typeof FormSchema>;

export type UserFormProps = {
  formId: string;
  data?: UserAdminEntity;
  onSubmit: (
    data: Omit<RegisterUserDto, "profileId" | "userTypeId" | "cityHallId">
  ) => void;
};

const UserForm: React.FC<UserFormProps> = ({ formId, data, onSubmit }) => {
  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
  } = useForm<FormSchemaProps>({
    defaultValues: {
      name: data?.name ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
  });

  const handleSubmit = (data: FormSchemaProps) => {
    onSubmit({
      name: data.name,
      email: data.email,
      phone: removePhoneMask(data.phone),
      password: data.password,
    });
  };

  return (
    <Box
      id={formId}
      component="form"
      display="flex"
      flexDirection="column"
      gap="2.4rem"
      onSubmit={formSubmit(handleSubmit)}
    >
      <Box display="flex" flexDirection="column" gap="2.4rem">
        <Text {...typography.title.h3l}>Usuário</Text>
        <TextField
          label="Nome"
          placeholder="Digite aqui"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
        />
        <Box display="flex" gap="2.4rem">
          <TextField
            label="E-mail"
            placeholder="Digite aqui"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
          />
          <TextField
            label="Telefone"
            placeholder="Digite aqui"
            maskprops={mask.phone}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            {...register("phone")}
          />
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap="2.4rem">
        <Text {...typography.title.h3l}>Senha</Text>
        <PasswordInput
          label="Senha"
          placeholder="Digite aqui"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
        />
        <PasswordInput
          label="Confirmação da senha*"
          placeholder="Digite aqui"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Box>
          <Text {...typography.paragraph.sb1x} color="#909090" mb="1rem">
            Sua senha deve ter entre 6 e 20 caracteres e incluir pelo menos:
          </Text>
          <Box
            component="ul"
            pl="1rem"
            sx={{
              listStyleType: "none",
              "li::before": {
                content: "'•'",
                left: 0,
                fontSize: 20,
                color: "#909090",
              },
            }}
          >
            <Box component="li" sx={{ display: "flex", gap: "1rem" }}>
              <Text {...typography.paragraph.l1} color="#909090">
                Uma letra maiúscula
              </Text>
            </Box>
            <Box component="li" sx={{ display: "flex", gap: "1rem" }}>
              <Text {...typography.paragraph.l1} color="#909090">
                Uma letra minúscula
              </Text>
            </Box>
            <Box component="li" sx={{ display: "flex", gap: "1rem" }}>
              <Text {...typography.paragraph.l1} color="#909090">
                Um número
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserForm;
