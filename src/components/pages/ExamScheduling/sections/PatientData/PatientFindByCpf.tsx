import { Card, Text, TextField } from "@/components/common";
import theme from "@/shared/theme/material-theme";
import typography from "@/shared/theme/typography-theme";
import { validateCPF } from "@/shared/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import Zod from "zod";
import mask, { removeCpfMask } from "@/shared/mask";

const FormSchema = Zod.object({
  cpf: Zod.string()
    .min(14, "Campo obrigatório")
    .refine(validateCPF, { message: "CPF inválido" }),
});

type FormSchemaProps = Zod.infer<typeof FormSchema>;

export type PatientFindByCpfProps = {
  onSubmit: (cpf: string) => void;
};

const PatientFindByCpf: React.FC<PatientFindByCpfProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit: formSubmitForm,
    setValue,
    formState: { errors },
  } = useForm<FormSchemaProps>({
    defaultValues: {
      cpf: "",
    },
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
  });

  const handleFormCpfSubmit = (data: FormSchemaProps) => {
    onSubmit(removeCpfMask(data.cpf));
    setValue("cpf", "");
  };

  return (
    <Box>
      <Card noBoder bgcolor={theme.palette.white.main} py="3.2rem" mb="1.2rem">
        <Text {...typography.title.h3l}>Buscar pelo CPF</Text>
        <Text color="#9399A4" {...typography.paragraph.l1}>
          Digite o CPF no campo abaixo
        </Text>
        <Box
          component="form"
          mt="2rem"
          display="flex"
          flexDirection="column"
          gap="1rem"
          onSubmit={formSubmitForm(handleFormCpfSubmit)}
        >
          <TextField
            label="CPF"
            placeholder="Digite aqui seu CPF"
            error={!!errors.cpf}
            helperText={errors.cpf?.message}
            maskprops={mask.cpf}
            {...register("cpf")}
          />
          <Button
            fullWidth
            variant="outlined"
            color="success"
            size="large"
            sx={{ py: "1rem" }}
            type="submit"
          >
            buscar
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default PatientFindByCpf;
