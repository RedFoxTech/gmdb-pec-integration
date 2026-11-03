import { Grid2 } from "@mui/material";
import {
  BadgeAppointmentScheduleStatus,
  BadgeAppointmentStatus,
  Text,
} from "@/components/common";
import typography from "@/shared/theme/typography-theme";
import dateUtils from "@/shared/date";
import { ageRangeEarlyDetection } from "@/shared/stringUtils";
import { cpfMask } from "@/shared/mask";
import { SegmentEnum } from "@/domain/consts";
import { ExamEntity } from "@/domain/entities/exam";

export type PatientExamSectionProps = {
  exam: ExamEntity;
  segment: SegmentEnum;
};

const PatientExamSection: React.FC<PatientExamSectionProps> = ({ exam }) => {
  return (
    <Grid2 container rowGap="2.4rem">
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          Nome do paciente
        </Text>
        <Text {...typography.title.h3l}>{exam.patient.name}</Text>
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          Status do Exame
        </Text>
        <BadgeAppointmentStatus status={exam.status} />
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          Status do Agendamento
        </Text>
        <BadgeAppointmentScheduleStatus status={exam.scheduleStatus} />
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          Gênero
        </Text>
        <Text {...typography.title.h3l}>{exam.patient.gender}</Text>
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          Data de nascimento
        </Text>
        <Text {...typography.title.h3l}>
          {dateUtils(exam.patient.birthdate).format("DD/MM/YYYY")}
        </Text>
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          Faixa etária
        </Text>
        <Text {...typography.title.h3l}>
          {ageRangeEarlyDetection(
            dateUtils().diff(exam.patient.birthdate, "year"),
          )}
        </Text>
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          CPF
        </Text>
        <Text {...typography.title.h3l}>
          {exam.patient.document ? cpfMask(exam.patient.document) : "--"}
        </Text>
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          UBS
        </Text>
        <Text {...typography.title.h3l}>
          {exam.patient.unit?.name ?? "UBS Não Identificada"}
        </Text>
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          ACS responsável
        </Text>
        <Text {...typography.title.h3l}>
          {exam.patient.acs?.name || "ACS Não Identificada"}
        </Text>
      </Grid2>
      <Grid2 size={{ xs: 4 }}>
        <Text {...typography.paragraph.l1} mb="0.4rem">
          Data do último exame
        </Text>
        <Text {...typography.title.h3l}>
          {exam.dtEfetiva
            ? dateUtils(exam.dtEfetiva).format("DD/MM/YYYY")
            : "Indefinida"}
        </Text>
      </Grid2>
    </Grid2>
  );
};

export default PatientExamSection;
