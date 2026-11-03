import {
  AgeRangeEnum,
  AgendaPeriod,
  AgendaType,
  CampaignStatusEnum,
  ExamAppointmentStatusEnum,
  ExamStatusEnum,
  SegmentEnum,
  VaccinationConsentStatusEnum,
} from "@/domain/consts";
import { SelectOption } from "@/domain/entities/common";

export const ageRangeList: SelectOption[] = [
  { value: AgeRangeEnum.NINE_TO_ELEVEN, label: "9 a 11 anos" },
  { value: AgeRangeEnum.TWELVE_TO_FOURTEEN, label: "12 a 14 anos" },
  { value: AgeRangeEnum.FIFTEEN_TO_NINETEEN, label: "15 a 19 anos" },
];

export const hpvVaccinationAgeRangeList: SelectOption[] = [
  { value: AgeRangeEnum.NINE_TO_ELEVEN, label: "9 a 11 anos" },
  { value: AgeRangeEnum.TWELVE_TO_FOURTEEN, label: "12 a 14 anos" },
];

export const vaccinationConsentStatusList: SelectOption[] = [
  { value: VaccinationConsentStatusEnum.ALLOWED, label: "Consentido" },
  { value: VaccinationConsentStatusEnum.PENDING, label: "Pendente" },
  { value: VaccinationConsentStatusEnum.DENIED, label: "Não consentido" },
];

export const agendaPeriodList: SelectOption[] = [
  { value: AgendaPeriod.MORNING, label: "Manhã" },
  { value: AgendaPeriod.AFTERNOON, label: "Tarde" },
  { value: AgendaPeriod.EVENING, label: "Noite" },
];

export const agendaTypeList: SelectOption[] = [
  { value: AgendaType.APPOINTMENT, label: "Consulta" },
  { value: AgendaType.SCREENING_EXAM, label: "Exame rastreamento" },
  { value: AgendaType.COMPLETE_VACCINATION, label: "Vacinação completa" },
  { value: AgendaType.CYTOPATHOLOGICAL_EXAM, label: "Exame Citopatologico" },
  { value: AgendaType.COLPOSCOPY_EXAM, label: "Exame Colposcopia" },
];

export const campaignStatusList: SelectOption[] = [
  { value: CampaignStatusEnum.PENDING, label: "Pendente" },
  { value: CampaignStatusEnum.SENT, label: "Enviada" },
  { value: CampaignStatusEnum.DONE, label: "Concluído" },
];

export const EarlyDetectionExamStatusList: SelectOption[] = [
  { value: ExamStatusEnum.UP_TO_DATE, label: "Em dia" },
  { value: ExamStatusEnum.ATTENTION, label: "Atenção" },
  { value: ExamStatusEnum.OVERDUE, label: "Vencido" },
  { value: ExamStatusEnum.NOT_DEFINED, label: "Indefinido" },
];

export const EarlyDetectionExamAppointmentStatusList: SelectOption[] = [
  { value: ExamAppointmentStatusEnum.NOT_APPLICABLE, label: "Não aplicável" },
  { value: ExamAppointmentStatusEnum.PENDING, label: "Pendente" },
  { value: ExamAppointmentStatusEnum.SCHEDULED, label: "Agendado" },
];

export const SegmentList = [
  { id: SegmentEnum.HPV, name: "Vacinação HPV" },
  { id: SegmentEnum.CYTOPATHOLOGY, name: "Detecção Precoce" },
];
