export enum GenderEnum {
  FEMALE = "Feminino",
  MALE = "Masculino",
}

export enum AgeRangeEnum {
  NINE_TO_ELEVEN = 0,
  TWELVE_TO_FOURTEEN = 1,
  FIFTEEN_TO_NINETEEN = 2,
}

export enum PageEnum {
  LOGIN = "/login",
  PATIENT_MANAGEMENT_VACCINATION_HPV = "/gestao-paciente/vacinacao-hpv",
  PATIENT_MANAGEMENT_EARLY_DETECTION = "/gestao-paciente/deteccao-precoce",
  NOT_CONSENT_TERMS = "/termos-nao-consentimento",
  USERS = "/usuarios",
  AGENDA = "/agenda",
  SCHEDULINGS = "/agenda/agendamentos",
  EXAM_SCHEDULING = "/agendamento-exame",
  CAMPAIGNS = "/campanhas",
  NEW_CAMPAIGNS = "/campanhas/nova-campanha",
  PANEL = "/painel",
  PANEL_VACINNATION_COVERAGE = "/painel/cobertura-vacinal-hpv",
  PANEL_EARLY_DETECTION = "/painel/deteccao-precoce",
  PANEL_MORTALITY_RATE = "/painel/taxa-mortalidade",
}

export enum CookieKeys {
  AUTH_TOKEN = "token",
  USER_ROLE = "role",
}

export enum LocalStorageKeys {
  CITY_HALL = "prefeitura",
}

export enum ResponseStatus {
  UNAUTHORIZED = 401,
  NO_PERMISSION = 403,
  NO_FOUND = 404,
  BAD_GETEWAY = 502,
}

export enum UserProfiles {
  MASTER_ADMIN = "65a53574-e553-406c-add4-ac0a12e2fa10",
  ADMIN = "2758ef72-114d-42d8-a158-d9c67efb4f2b",
  PATIENT = "7389657f-2d10-4cf3-8090-3cd281d2fc58",
  UNAUTHORIZED = "1",
  AUTHORIZED = "2",
}

export enum UserTypes {
  ADMIN = "9f3f16b2-ac32-4b74-9927-9d5fafcfedf9",
  CUSTOMER = "af94caf7-3627-4070-a25f-81a301f9392e",
}
