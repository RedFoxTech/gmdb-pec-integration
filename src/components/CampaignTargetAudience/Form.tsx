import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import Zod from "zod";
import { Autocomplete, Button, Select, TextField } from "../common";
import { ageRangeList } from "@/shared/lists";
import { UnitEntity } from "@/domain/entities/unit";
import { SelectOption } from "@/domain/entities/common";
import { useMemo } from "react";
import { TagEntity } from "@/domain/entities/Tag";
import { AgeRangeEnum, SegmentEnum } from "@/domain/consts";
import { RegisterCampaignTargetAudienceDto } from "@/domain/entities/campaign";
import { SegmentEntity } from "@/domain/entities/segment";

const FormSchema = Zod.object({
  patientName: Zod.string().optional(),
  segmentId: Zod.string().optional(),
  ageGroup: Zod.array(Zod.nativeEnum(AgeRangeEnum)),
  tags: Zod.array(Zod.string()),
  unitId: Zod.string().optional(),
});

type FormSchemaProps = Zod.infer<typeof FormSchema>;

export type FormProps = {
  data?: RegisterCampaignTargetAudienceDto;
  units: UnitEntity[];
  tags: TagEntity[];
  segments: SegmentEntity[];
  onSubmit: (data: RegisterCampaignTargetAudienceDto) => void;
};

const defaultAgeGroup = [
  AgeRangeEnum.FIFTEEN_TO_NINETEEN,
  AgeRangeEnum.NINE_TO_ELEVEN,
  AgeRangeEnum.TWELVE_TO_FOURTEEN,
];

export const Form: React.FC<FormProps> = ({
  data,
  units,
  tags,
  segments,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    control,
  } = useForm<FormSchemaProps>({
    defaultValues: {
      patientName: data?.patientName ?? "",
      segmentId: data?.segmentId ?? "-",
      ageGroup: data?.ageGroup || [],
      tags: data?.tags || [],
      unitId: data?.unitId,
    },
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
  });

  const unitOptios: SelectOption[] = useMemo(
    () => [
      { value: undefined, label: "Nenhum" },
      ...units.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    ],
    [units]
  );

  const tagOptions: SelectOption[] = useMemo(
    () =>
      tags.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [tags]
  );

  const segmentOptions: SelectOption[] = useMemo(
    () => [
      // { value: "-", label: "Nenhum" },
      ...segments
        .filter((item) => item.id === SegmentEnum.HPV)
        .map((item) => ({
          value: item.id,
          label: item.name,
        })),
    ],
    [segments]
  );

  const handleSubmit = (data: FormSchemaProps) => {
    onSubmit({
      ...data,
      ageGroup: data.ageGroup.length > 0 ? data.ageGroup : defaultAgeGroup,
      segmentId: data.segmentId === "-" ? undefined : data.segmentId,
      patientName: data.patientName ?? "",
    });
  };

  return (
    <Box component="form" onSubmit={formSubmit(handleSubmit)}>
      <Box display="flex" gap="2.4rem">
        <TextField
          label="Nome paciente"
          size="small"
          placeholder="Digite aqui"
          error={!!errors.patientName}
          helperText={errors.patientName?.message}
          {...register("patientName")}
        />
        <Controller
          render={({ field }) => (
            <Select
              label="Segmento"
              size="small"
              options={segmentOptions}
              error={!!errors.segmentId}
              helperText={errors.segmentId?.message}
              {...field}
            />
          )}
          control={control}
          name={"segmentId"}
        />
        <Controller
          render={({ field }) => (
            <Select
              label="Faixa Etária"
              options={ageRangeList}
              multiple
              size="small"
              error={!!errors.ageGroup}
              helperText={errors.ageGroup?.message}
              {...field}
            />
          )}
          control={control}
          name={"ageGroup"}
        />
      </Box>
      <Box display="flex" gap="2.4rem" mt="2.4rem">
        <Controller
          render={({ field: { ref, value, onChange } }) => (
            <Autocomplete
              ref={ref}
              fullWidth
              multiple
              value={tagOptions.filter((item) =>
                value.includes(item.value as string)
              )}
              label="Etiquetas"
              options={tagOptions}
              size="small"
              error={!!errors.tags}
              helperText={errors.tags?.message}
              onChange={(_, option) =>
                onChange(option?.map((item) => item.value))
              }
            />
          )}
          control={control}
          name={"tags"}
        />
        <Controller
          render={({ field: { ref, value, onChange } }) => {
            return (
              <Autocomplete
                ref={ref}
                fullWidth
                value={unitOptios.find(
                  (item) => value === (item.value as string)
                )}
                label="UBS"
                options={unitOptios}
                size="small"
                error={!!errors.unitId}
                helperText={errors.unitId?.message}
                onChange={(_, option) => onChange(option?.value)}
              />
            );
          }}
          control={control}
          name={"unitId"}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" mt="2.4rem">
        <Button type="submit" variant="outlined">
          Definir
        </Button>
      </Box>
    </Box>
  );
};
