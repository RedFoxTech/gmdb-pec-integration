import { Card, TextField, Text, Button } from "@/components/common";
import { PatientExamSchedulingDto } from "@/domain/entities/patient-scheduling";
import mask, { removeCpfMask, removePhoneMask } from "@/shared/mask";
import theme from "@/shared/theme/material-theme";
import typography from "@/shared/theme/typography-theme";
import { validateCPF } from "@/shared/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import Zod from "zod";

const FormSchema = Zod.object({
  name: Zod.string().min(1, "Campo obrigatório"),
  email: Zod.string().min(1, "Campo obrigatório").email("E-mail inválido"),
  document: Zod.string()
    .min(14, "Campo obrigatório")
    .refine(validateCPF, { message: "CPF inválido" }),
  phone: Zod.string().min(15, "Campo obrigatório"),
});

type FormSchemaProps = Zod.infer<typeof FormSchema>;

export type PatientDataFillProps = {
  onSubmit: (
    data: Omit<
      PatientExamSchedulingDto,
      "agendaId" | "patientId" | "cityHallIbge"
    >
  ) => void;
};

const PatientDataFill: React.FC<PatientDataFillProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
  } = useForm<FormSchemaProps>({
    defaultValues: {
      document: "",
      name: "",
      email: "",
      phone: "",
    },
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
  });

  const handleSubmit = (data: FormSchemaProps) => {
    onSubmit({
      ...data,
      document: removeCpfMask(data.document),
      phone: removePhoneMask(data.phone),
    });
  };

  return (
    <Box>
      <Card noBoder bgcolor={theme.palette.white.main} py="3.2rem" mb="1.2rem">
        <Text {...typography.title.h3l}>Dados</Text>
        <Text color="#9399A4" {...typography.paragraph.l1}>
          Preencha os dados abaixo
        </Text>
      </Card>
      <Card noBoder bgcolor={theme.palette.white.main} py="3.2rem" mb="1.2rem">
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap="2.4rem"
          onSubmit={formSubmit(handleSubmit)}
        >
          <TextField
            label="Nome completo"
            placeholder="Digite aqui seu nome completo"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register("name")}
          />
          <TextField
            label="CPF"
            placeholder="Digite aqui seu CPF"
            error={!!errors.document}
            helperText={errors.document?.message}
            maskprops={mask.cpf}
            {...register("document")}
          />
          <TextField
            label="Email"
            placeholder="Digite aqui seu email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
          />
          <TextField
            label="Telefone (WhatsApp)"
            placeholder="Digite aqui seu telefone"
            error={!!errors.phone}
            helperText={errors.phone?.message}
            maskprops={mask.phone}
            {...register("phone")}
          />
          <Button type="submit" color="success">
            Salvar e continuar
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default PatientDataFill;
