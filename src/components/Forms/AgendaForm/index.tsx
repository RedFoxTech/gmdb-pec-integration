import {
  Autocomplete,
  InputDate,
  Select,
  Text,
  TextField,
} from "@/components/common";
import { Box } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import Zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitEntity } from "@/domain/entities/unit";
import { SelectOption } from "@/domain/entities/common";
import { useMemo } from "react";
import typography from "@/shared/theme/typography-theme";
import { agendaPeriodList, agendaTypeList } from "@/shared/lists";
import { Dayjs } from "dayjs";
import { AgendaEntity, RegisterAgendaDto } from "@/domain/entities/agenda";
import { AgendaPeriod, AgendaType } from "@/domain/consts";
import dateUtils from "@/shared/date";

const FormSchema = Zod.object({
  unitId: Zod.string().min(1, "Campo obrigatório"),
  type: Zod.nativeEnum(AgendaType, {
    required_error: "Campo obrigatório",
  }),
  date: Zod.custom<Dayjs>((val: Dayjs | undefined) => val && val.isValid(), {
    message: "Campo obrigatório",
  }),
  period: Zod.nativeEnum(AgendaPeriod, {
    required_error: "Campo obrigatório",
  }),
  slots: Zod.string().min(1, "Campo obrigatório"),
});

type FormSchemaProps = Zod.infer<typeof FormSchema>;

export type AgendaFormProps = {
  formId: string;
  units: UnitEntity[];
  data?: AgendaEntity;
  onSubmit: (data: RegisterAgendaDto) => void;
};

const AgendaForm: React.FC<AgendaFormProps> = ({
  formId,
  units,
  data,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    control,
  } = useForm<FormSchemaProps>({
    defaultValues: {
      unitId: data?.unit.id ?? "",
      type: data?.type,
      slots: data?.slots.toString() ?? "",
      date: data?.date ? dateUtils(data.date) : undefined,
      period: data?.period,
    },
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
  });

  const unitOptios: SelectOption[] = useMemo(
    () =>
      units.map((item) => ({
        value: item.id,
        label: `${item.name} - ${item.address}, ${item.addressNumber}`,
      })),
    [units]
  );

  const handleSubmit = (data: FormSchemaProps) => {
    onSubmit({
      ...data,
      slots: parseInt(data.slots),
      date: data.date.toISOString(),
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
      <Box mt="4.8rem">
        <Text {...typography.title.h3l} mb="1rem">
          Unidade Básica de Saúde
        </Text>
        <Controller
          render={({ field: { onChange, ref, value } }) => (
            <Autocomplete
              ref={ref}
              value={unitOptios.find((item) => item.id === value)}
              label="Unidade Básica de Saúde"
              options={unitOptios}
              required
              error={!!errors.unitId}
              helperText={errors.unitId?.message}
              onChange={(_, option) => onChange(option?.value)}
            />
          )}
          control={control}
          name={"unitId"}
        />
      </Box>
      <Box>
        <Text {...typography.title.h3l} mb="1rem">
          Tipo da agenda
        </Text>
        <Controller
          render={({ field: { onChange, ref, value } }) => (
            <Autocomplete
              ref={ref}
              value={agendaTypeList.find((item) => item.id === (value ?? ""))}
              label="Exames/Procedimentos"
              options={agendaTypeList}
              required
              error={!!errors.type}
              helperText={errors.type?.message}
              onChange={(_, option) => onChange(option?.value)}
            />
          )}
          control={control}
          name={"type"}
        />
      </Box>

      <Box display="flex" gap="2.4rem">
        <Box flex={1}>
          <Text {...typography.title.h3l} mb="1rem">
            Data
          </Text>
          <Controller
            render={({ field: { value, ...data } }) => (
              <InputDate
                value={value || null}
                disablePast
                fullWidth
                label="Data de inicio"
                required
                error={!!errors.date}
                helperText={errors.date?.message}
                {...data}
              />
            )}
            control={control}
            name={"date"}
          />
        </Box>
        <Box flex={1}>
          <Text {...typography.title.h3l} mb="1rem">
            Período
          </Text>
          <Controller
            render={({ field: { onChange, ref, value } }) => (
              <Select
                ref={ref}
                value={value}
                label="Período"
                options={agendaPeriodList}
                required
                error={!!errors.period}
                helperText={errors.period?.message}
                onChange={(item) => onChange(item.target.value)}
              />
            )}
            control={control}
            name={"period"}
          />
        </Box>
        <Box flex={1}>
          <Text {...typography.title.h3l} mb="1rem">
            Vagas
          </Text>
          <TextField
            label="Número de vagas disponíveis"
            error={!!errors.slots}
            helperText={errors.slots?.message}
            maskprops={{ mask: Number }}
            required
            {...register("slots")}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AgendaForm;
