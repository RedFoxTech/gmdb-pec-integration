import {
  AgendaPeriod,
  AgeRangeEnum,
  ExamAppointmentStatusEnum,
  ExamStatusEnum,
  GenderEnum,
} from "@/domain/consts";

export const numberFormatWithOpttions = (
  value: number,
  options?: Intl.NumberFormatOptions,
) => value.toLocaleString("pt-BR", options);

export const genderAbbreviation = (value: GenderEnum) => {
  const abbreviations = {
    [GenderEnum.FEMALE]: "F",
    [GenderEnum.MALE]: "M",
  };

  return abbreviations[value];
};

export const ageRangeText = (age: number) => {
  if (age <= 11) {
    return "9 a 11 anos";
  }
  if (age <= 14) {
    return "12 a 14 anos";
  }

  return "15 a 19 anos";
};

export const ageRangeEarlyDetection = (age: number) => {
  switch (age) {
    case 35:
      return "35 anos";
    case 45:
      return "45 anos";
    default:
      return "25 a 64 anos";
  }
};

export const timeByPeriod = (period: AgendaPeriod) => {
  switch (period) {
    case AgendaPeriod.MORNING:
      return "09:00";
    case AgendaPeriod.AFTERNOON:
      return "13:00";
    default:
      return "18:00";
  }
};

export const parseObjectToQueryString = (data?: { [x: string]: any }) =>
  data
    ? "?" +
      Object.keys(data)
        .reduce((result: string[], key) => {
          if (data[key] !== undefined) {
            return [...result, `${key}=${data[key]}`];
          }
          return result;
        }, [])
        .join("&")
    : "";

export const getNameFirst2Letters = (name: string) => {
  const split = name.split(" ");
  let text = "" + split[0][0];
  if (split[1]) {
    text += split[1][0];
  }
  return text;
};

export const getDateRangeByAgeRange = (
  ageEnums: AgeRangeEnum[],
  currentYear = new Date().getFullYear(),
) => {
  const ageRangeMap: Record<AgeRangeEnum, { min: number; max: number }> = {
    [AgeRangeEnum.NINE_TO_ELEVEN]: { min: 9, max: 11 },
    [AgeRangeEnum.TWELVE_TO_FOURTEEN]: { min: 12, max: 14 },
    [AgeRangeEnum.FIFTEEN_TO_NINETEEN]: { min: 15, max: 19 },
  };
  let minBirthYear = currentYear;
  let maxBirthYear = 0;

  for (const ageEnum of ageEnums) {
    const ageRange = ageRangeMap[ageEnum];
    const birthYearMin = currentYear - ageRange.max;
    const birthYearMax = currentYear - ageRange.min;

    minBirthYear = Math.min(minBirthYear, birthYearMin);
    maxBirthYear = Math.max(maxBirthYear, birthYearMax);
  }

  return {
    begin: `${minBirthYear}-01-01`,
    end: `${maxBirthYear}-12-31`,
  };
};

export const appointmentStatusTranslate = {
  [ExamStatusEnum.ATTENTION]: "Atenção",
  [ExamStatusEnum.OVERDUE]: "Vencido",
  [ExamStatusEnum.UP_TO_DATE]: "Em dia",
  [ExamStatusEnum.NOT_DEFINED]: "Indefinido",
};

export const appointmentScheduleStatusTranslate = {
  [ExamAppointmentStatusEnum.NOT_APPLICABLE]: "Não aplicável",
  [ExamAppointmentStatusEnum.PENDING]: "Pendente",
  [ExamAppointmentStatusEnum.SCHEDULED]: "Agendado",
};

export const normalizeCityHall = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
