import {
  TextField,
  Text,
  InputDate,
  Select,
  FileUpload,
  Button,
} from "@/components/common";
import {
  CampaignEntity,
  RegisterCampaignDto,
  UpdateCampaignDataDto,
} from "@/domain/entities/campaign";
import typography from "@/shared/theme/typography-theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { Dayjs } from "dayjs";
import { Controller, useForm } from "react-hook-form";
import Zod from "zod";
import dateUtils from "@/shared/date";
import { useEffect } from "react";
import { campaignStatusList } from "@/shared/lists";
import { CampaignStatusEnum } from "@/domain/consts";
import { convertToBase64 } from "@/shared/file";
import { FileDto } from "@/domain/entities/common";
import { ContentCopy as IconContentCopy } from "@mui/icons-material";
import { useSnackbar } from "@/hooks";
import { SnackbarType } from "@/contexts/SnackbarContext";

export type CampaignFormProps = {
  formId: string;
  data?: CampaignEntity;
  disabled?: boolean;
  onSubmit: (
    data: Omit<RegisterCampaignDto | UpdateCampaignDataDto, "target">
  ) => void;
};

const CampaignForm: React.FC<CampaignFormProps> = ({
  formId,
  data,
  disabled,
  onSubmit,
}) => {
  const FormSchema = Zod.object({
    title: Zod.string().min(1, "Campo obrigatório"),
    description: Zod.string().min(1, "Campo obrigatório"),
    publicationDate: Zod.custom<Dayjs>(
      (val: Dayjs | undefined) => val && val.isValid(),
      {
        message: "Campo obrigatório",
      }
    ),
    message: Zod.string().min(1, "Campo obrigatório"),
    fileCreative: data
      ? Zod.custom<File | undefined>((file) => file instanceof File, {
          message: "Campo obrigatório",
        })
          .refine(
            (fileCreative) =>
              fileCreative && fileCreative.size <= 3 * 1024 * 1024,
            {
              message: "File size must be less than 3MB",
            }
          )
          .optional()
      : Zod.custom<File | undefined>((file) => file instanceof File, {
          message: "Campo obrigatório",
        }).refine(
          (fileCreative) =>
            fileCreative && fileCreative.size <= 3 * 1024 * 1024,
          {
            message: "File size must be less than 3MB",
          }
        ),
    campaignStatus: Zod.nativeEnum(CampaignStatusEnum).optional(),
  });

  type FormSchemaProps = Zod.infer<typeof FormSchema>;

  const {
    handleSubmit: formSubmit,
    formState: { errors },
    control,
    reset,
    getValues,
  } = useForm<FormSchemaProps>({
    defaultValues: {
      title: "",
      description: "",
      message: "",
    },
    resolver: zodResolver(FormSchema),
    mode: "onSubmit",
  });

  const { showSnackBar } = useSnackbar();

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        description: data.description,
        message: data.message,
        publicationDate: dateUtils(data.publicationDate).utc(),
        campaignStatus: data.campaignStatus,
      });
    }
  }, [data, reset]);

  const handleSubmit = async (data: FormSchemaProps) => {
    let file: FileDto | undefined;
    if (data.fileCreative) {
      file = await convertToBase64(data.fileCreative);
    }

    onSubmit({
      ...data,
      publicationDate: data.publicationDate.toISOString(),
      fileCreative: file,
    });
  };

  const handleMessageCopy = () => {
    navigator.clipboard.writeText(getValues("message"));

    showSnackBar?.({
      message: "Mensagem copiada!",
      type: SnackbarType.SUCCESS,
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
      <Box>
        <Text {...typography.title.h3l} mb="2rem">
          Campanha
        </Text>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Título da campanha"
              placeholder="Digite aqui"
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={disabled}
              required
            />
          )}
        />
      </Box>
      <Box mb="2.4rem">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Descrição da campanha"
              placeholder="Digite aqui"
              error={!!errors.description}
              helperText={errors.description?.message}
              multiline
              disabled={disabled}
              required
            />
          )}
        />
      </Box>
      <Box display="flex" gap="2.4rem">
        <Box width="24rem" maxWidth="100%">
          <Text {...typography.title.h3l} mb="2rem">
            Disparo
          </Text>
          <Controller
            render={({ field: { value, ...data } }) => (
              <InputDate
                value={value || null}
                disablePast
                fullWidth
                label="Data do disparo"
                disabled={disabled}
                error={!!errors.publicationDate}
                helperText={errors.publicationDate?.message}
                required
                {...data}
              />
            )}
            control={control}
            name={"publicationDate"}
          />
        </Box>
        {data && (
          <Box width="24rem" maxWidth="100%">
            <Text {...typography.title.h3l} mb="2rem">
              Status
            </Text>
            <Controller
              render={({ field }) => (
                <Select
                  label="Status da campanha"
                  options={campaignStatusList}
                  disabled={disabled}
                  error={!!errors.campaignStatus}
                  helperText={errors.campaignStatus?.message}
                  required
                  {...field}
                />
              )}
              control={control}
              name={"campaignStatus"}
            />
          </Box>
        )}
      </Box>
      <Box>
        <Box display="flex" justifyContent="space-between">
          <Text {...typography.title.h3l} mb="2rem">
            Mensagem
          </Text>
          {disabled && (
            <Box>
              <Button
                variant="outlined"
                size="medium"
                startIcon={<IconContentCopy />}
                onClick={handleMessageCopy}
              >
                Copiar mensagem
              </Button>
            </Box>
          )}
        </Box>
        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Mensagem da campanha"
              placeholder="Digite aqui"
              error={!!errors.message}
              helperText={errors.message?.message}
              multiline
              disabled={disabled}
              required
            />
          )}
        />
      </Box>
      <Box>
        <Text {...typography.title.h3l} mb="2rem">
          Criativo da Campanha
        </Text>

        <Controller
          render={({ field: { onChange, value } }) => (
            <FileUpload
              value={{
                name: value?.name ?? data?.fileCreative.customName ?? "",
                size: value?.size,
                file: value,
                url: value ? undefined : data?.fileCreative.url,
              }}
              types={["svg", "png", "jpg", "jpeg", "gif"]}
              maxSize={3}
              disabled={disabled}
              error={!!errors.fileCreative}
              helperText={errors.fileCreative?.message}
              onChange={onChange}
            />
          )}
          control={control}
          name={"fileCreative"}
        />
      </Box>
    </Box>
  );
};

export default CampaignForm;
