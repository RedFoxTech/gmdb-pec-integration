import { PatientEntity } from "@/domain/entities/patient";
import { Grid2 } from "@mui/material";
import {
  BadgeVaccinationConsentStatus,
  BadgeVaccinationStatus,
  Text,
} from "@/components/common";
import typography from "@/shared/theme/typography-theme";
import dateUtils from "@/shared/date";
import { ageRangeText } from "@/shared/stringUtils";
import { cpfMask } from "@/shared/mask";
import { SegmentEnum, VaccinationConsentStatusEnum } from "@/domain/consts";
import { useMemo } from "react";

export type PatientSectionProps = {
  patient: PatientEntity;
  segment: SegmentEnum;
};

const PatientSection: React.FC<PatientSectionProps> = ({ patient }) => {
  const consentStatus = useMemo(
    () => patient.consents.find((item) => item.segment.id)?.consentStatus,
    [patient],
  );

  return (
    <Grid2 container rowGap="2.4rem">
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          Nome do paciente
        </Text>
        <Text {...typography.title.h3l}>{patient.name}</Text>
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          Status do consetimento
        </Text>
        <BadgeVaccinationConsentStatus
          status={consentStatus ?? VaccinationConsentStatusEnum.PENDING}
        />
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          Status da vacinação
        </Text>
        <BadgeVaccinationStatus vaccinated={patient.vaccinated} />
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          Gênero
        </Text>
        <Text {...typography.title.h3l}>{patient.gender}</Text>
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          Data de nascimento
        </Text>
        <Text {...typography.title.h3l}>
          {dateUtils(patient.birthdate).format("DD/MM/YYYY")}
        </Text>
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          Faixa etária
        </Text>
        <Text {...typography.title.h3l}>
          {ageRangeText(dateUtils().diff(patient.birthdate, "year"))}
        </Text>
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          CPF
        </Text>
        <Text {...typography.title.h3l}>
          {patient.document ? cpfMask(patient.document) : "--"}
        </Text>
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          UBS
        </Text>
        <Text {...typography.title.h3l}>
          {patient.unit?.name ?? "UBS Não Identificada"}
        </Text>
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          ACS responsável
        </Text>
        <Text {...typography.title.h3l}>
          {patient.acs?.name || "ACS Não Identificada"}
        </Text>
      </Grid2>
    </Grid2>
  );
};

export default PatientSection;
