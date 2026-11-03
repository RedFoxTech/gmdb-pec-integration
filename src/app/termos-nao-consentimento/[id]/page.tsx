"use client";

import { Box, TextField } from "@mui/material";
import { Button, Card, Text } from "@/components/common";
import typography from "@/shared/theme/typography-theme";
import theme from "@/shared/theme/material-theme";
import dateUtils from "@/shared/date";
import { usePatient, useSnackbar } from "@/hooks";
import { useParams, useSearchParams } from "next/navigation";
import Zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SnackbarType } from "@/contexts/SnackbarContext";
import { SegmentEnum } from "@/domain/consts";

const FormSchema = Zod.object({
  responsibleName: Zod.string().min(1, "Campo obrigatório"),
  responsibleDocument: Zod.string().min(1, "Campo obrigatório"),
});

type FormSchemaProps = Zod.infer<typeof FormSchema>;

const NotConsentTerms = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const cityHallIbge = searchParams.get("cityHall");

  const { consentFormPatientInfo, notConsentVaccination } = usePatient(
    "not-consent-terms",
    {
      getConsentFormPatientInfo: {
        enabled: true,
        params: {
          pecId: patientId,
          cityHallIbge: cityHallIbge ?? "",
        },
      },
    }
  );
  const { showSnackBar } = useSnackbar();

  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
  } = useForm<FormSchemaProps>({
    defaultValues: {
      responsibleName: "",
      responsibleDocument: "",
    },
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
  });

  const handleNotConsentVaccination = async (data: FormSchemaProps) => {
    if (consentFormPatientInfo && patientId) {
      const result = await notConsentVaccination({
        id: patientId,
        data: {
          ...data,
          cityHallIbge: cityHallIbge!,
          segmentId: SegmentEnum.HPV,
        },
      });
      if (result?.error) {
        showSnackBar?.({
          message:
            result.error.response?.data.message ?? "Um erro inesperado ocorreu",
          type: SnackbarType.ERROR,
        });
      } else {
        showSnackBar?.({
          message: "Dados atualizado com sucesso",
          type: SnackbarType.SUCCESS,
        });
      }
    }
  };

  if (!consentFormPatientInfo) {
    return null;
  }

  return (
    <Box bgcolor="#F7F7F8" minHeight="100%" width="100%" p="4.8rem">
      <Box
        component="form"
        width="100%"
        maxWidth="56.1rem"
        margin="auto"
        onSubmit={formSubmit(handleNotConsentVaccination)}
      >
        <Card
          noBoder
          bgcolor={theme.palette.white.main}
          py="3.2rem"
          mb="1.2rem"
        >
          <Text component="h1" {...typography.title.h3l}>
            TERMO DE NÃO CONSENTIMENTO PARA ADMINISTRAÇÃO DA VACINA CONTRA O HPV
          </Text>
          <Text color={theme.palette.grey[800]} {...typography.paragraph.l1}>
            NÃO Consentimento para vacinação HPV
          </Text>
        </Card>
        <Card
          noBoder
          bgcolor={theme.palette.white.main}
          py="3.2rem"
          mb="1.2rem"
        >
          <Text component="h2" {...typography.title.h3l}>
            Paciente
          </Text>
          <Text
            color={theme.palette.grey[800]}
            {...typography.paragraph.l2}
            mb="1.6rem"
          >
            Confirme os dados do paciente
          </Text>
          <Text {...typography.paragraph.l1} mb="0.4rem">
            Nome do paciente
          </Text>
          <Text {...typography.title.h4l}>{consentFormPatientInfo?.name}</Text>
          <Box display="flex" gap="6rem" mt="1.4rem">
            <Box>
              <Text {...typography.paragraph.l1} mb="0.4rem">
                Data de nascimento
              </Text>
              <Text {...typography.title.h4l}>
                {dateUtils(consentFormPatientInfo?.birthday).format(
                  "DD/MM/YYYY"
                )}
              </Text>
            </Box>
            <Box>
              <Text {...typography.paragraph.l1} mb="0.4rem">
                CPF
              </Text>
              <Text {...typography.title.h4l}>
                {consentFormPatientInfo?.document}
              </Text>
            </Box>
          </Box>
        </Card>
        <Card
          noBoder
          bgcolor={theme.palette.white.main}
          py="3.2rem"
          mb="1.2rem"
        >
          <Text component="h2" {...typography.title.h3l}>
            Campanha de Vacinação Contra o HPV
          </Text>
          <Text
            color={theme.palette.grey[800]}
            {...typography.paragraph.l1}
            mb="1.6rem"
          >
            Importância e Informações da Campanha
          </Text>
          <Text {...typography.paragraph.l1} mb="2.4rem">
            A vacinação contra o HPV é uma iniciativa de saúde pública que visa
            proteger contra doenças relacionadas ao Papilomavírus Humano (HPV),
            incluindo diversos tipos de câncer.
          </Text>
          <Text {...typography.paragraph.l1} mb="2.4rem">
            A vacina é indicada para crianças e adolescentes de 9 a 14 anos e é
            administrada em duas doses, conforme o calendário vacinal
            recomendado pelo Ministério da Saúde.
          </Text>
          <Text {...typography.paragraph.l1}>
            A participação na campanha é gratuita e os dados fornecidos serão
            utilizados exclusivamente para fins de controle vacinal e registro
            da campanha.
          </Text>
        </Card>
        <Card
          noBoder
          bgcolor={theme.palette.white.main}
          py="3.2rem"
          mb="1.2rem"
        >
          <Text component="h2" {...typography.title.h3l}>
            PREENCHA AQUI OS SEUS DADOS
          </Text>
          <Text
            color={theme.palette.grey[800]}
            {...typography.paragraph.l1}
            mb="1.6rem"
          >
            Confirmação do Não Consentimento para Vacinação
          </Text>
          <Box display="flex" alignItems="center" gap="1.2rem" mb="3rem">
            <Text {...typography.paragraph.l1}>Eu,</Text>
            <TextField
              placeholder="Digite seu nome"
              error={!!errors.responsibleName}
              helperText={errors.responsibleName?.message}
              {...register("responsibleName")}
            />
          </Box>
          <Box display="flex" alignItems="center" gap="1.2rem" mb="3rem">
            <Text {...typography.paragraph.l1} whiteSpace="nowrap">
              portador(a) do CPF
            </Text>
            <TextField
              placeholder="Digite seu CPF"
              error={!!errors.responsibleDocument}
              helperText={errors.responsibleDocument?.message}
              {...register("responsibleDocument")}
            />
          </Box>
          <Text {...typography.paragraph.l1}>
            responsável legal pelo(a) menor declaro neste termo:
          </Text>
          <Box pl="2rem" my="2rem">
            <ol>
              <Text {...typography.paragraph.l1} component="li" mb="2rem">
                Fui devidamente informado(a) sobre a disponibilidade da vacina
                contra o HPV oferecida pela [NOME DA INSTITUIÇÃO/SECRETARIA DE
                SAÚDE] e seus benefícios, riscos e indicações, conforme
                informações fornecidas pela equipe de saúde.
              </Text>
              <Text {...typography.paragraph.l1} component="li" mb="2rem">
                Após análise das informações apresentadas, opto por NÃO
                AUTORIZAR a administração da referida vacina em meu(sua)
                filho(a) ou dependente legal no momento.
              </Text>
              <Text {...typography.paragraph.l1} component="li" mb="2rem">
                Estou ciente de que a vacina contra o HPV é recomendada pelas
                autoridades de saúde nacionais e internacionais para prevenir
                doenças causadas pelo papilomavírus humano, incluindo câncer de
                colo do útero e outras condições associadas.
              </Text>
              <Text {...typography.paragraph.l1} component="li" mb="2rem">
                Reconheço que esta decisão é de minha exclusiva responsabilidade
                e que terei acesso à vacinação em momento futuro, caso decida
                autorizar.
              </Text>
              <Text {...typography.paragraph.l1} component="li">
                Declaro que esta decisão reflete minha vontade e está de acordo
                com meu direito como responsável legal, conforme previsto na
                legislação vigente.
              </Text>
            </ol>
          </Box>
          <Text {...typography.paragraph.l1}>São Paulo - SP</Text>
          <Text {...typography.paragraph.l1}>
            {dateUtils().format("DD/MM/YYYY")}
          </Text>
        </Card>
        <Card
          noBoder
          bgcolor={theme.palette.white.main}
          py="3.2rem"
          mb="1.2rem"
        >
          <Button
            variant="outlined"
            color="error"
            type="submit"
            fullWidth
            sx={{ py: "1.2rem" }}
          >
            Não autorizo
          </Button>
        </Card>
      </Box>
    </Box>
  );
};

export default NotConsentTerms;
