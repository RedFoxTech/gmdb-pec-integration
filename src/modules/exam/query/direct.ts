import { sqlInteger, sqlIntegerList, sqlText } from "src/common/sql";
import {
  queryExamsAppointments,
  queryPatient,
  queryUnit,
  queryAppointments,
} from "../../../query";
import { ExamFindAllDto } from "../dto/findAll-dto";

export const queryAll = (params: ExamFindAllDto) => {
  const {
    patientName,
    acs,
    units,
    examStatus,
    examAppointmentStatus,
    patientBeginAgeDate,
    patientEndAgeDate,
    examDateTo,
  } = params;

  const now = examDateTo ? `'${sqlText(examDateTo)}'::DATE` : "CURRENT_DATE";

  let queryResult = `
    WITH exams as (
      SELECT distinct on(ap.id_paciente)
        ap.id_paciente as "patientPecId",
        ap.dt_coleta as "colectDate",
        ap.dt_solicitado as "solicitationDate",
        ap.agendado::boolean as scheduled,
        ap.dt_avaliado as "evaluatedDate",
        CASE
          WHEN ap.dt_coleta >= ${now} - INTERVAL '1 year' THEN 2  -- Em dia
          WHEN ap.dt_coleta >= ${now} - INTERVAL '3 years' THEN 1 -- Atenção
          ELSE 0 -- Vencido
        END AS status,
        CASE
          WHEN ap.dt_coleta >= ${now} - INTERVAL '1 year' THEN 2 -- Não aplicável
          WHEN ap.agendado = 1 THEN 1 -- Agendado
          ELSE 0 -- Pendente
        END AS "scheduleStatus",
        json_build_object(
          'patientPecId', p.id_paciente,
          'name', p.no_cidadao,
          'document', p.cpf,
          'birthdate', p.dt_nascimento,
          'cns', p.cns,
          'gender', CASE
            WHEN p.sexo = 'F' THEN 'Feminino'
            ELSE 'Masculino'
          END,
          'address', p.logradouro,
          'neighborhood', p.bairro,
          'phone', p.contato,
          'email', null::text,
          'responsibleName', p.no_mae,
          'responsibleDocument', null::text,
          'acs', CASE
            WHEN p.id_profissional IS NOT NULL THEN json_build_object(
              'id', p.id_profissional::int,
              'name', p.no_prof_cad
            )
            ELSE NULL
          END,
          'unit', CASE
            WHEN un.nu_cnes IS NOT NULL THEN json_build_object(
              'id', un.nu_cnes,
              'name', un.no_unidade,
              'address', un.logradouro,
              'addressNumber', un.nu_logradouro,
              'neighborhood', un.bairro,
              'zipcode', un.cep
            )
            ELSE NULL
          END
        ) as patient
      FROM (${queryExamsAppointments(examDateTo)}) ap
      INNER JOIN (${queryPatient}) p on p.id_paciente = ap.id_paciente
      LEFT JOIN (${queryUnit}) un ON un.nu_cnes = p.nu_cnes
  `;

  let whereStarted = false;

  if (patientName) {
    queryResult += `
    ${whereStarted ? " AND" : " WHERE"} lower(p.no_cidadao) ILIKE lower('%${sqlText(patientName)}%')
    `;
    whereStarted = true;
  }

  if (acs) {
    const acsNotNull = acs
      .split("|")
      .filter((item) => item !== "null")
      .map((item) => sqlInteger(item))
      .join(",");
    if (acsNotNull.length > 0) {
      queryResult += `
      ${whereStarted ? " AND" : " WHERE"} (p.id_profissional IS NOT null AND p.id_profissional IN (${acsNotNull})
      `;
      whereStarted = true;
    }
    if (acs.includes("null")) {
      queryResult += `
      ${acsNotNull.length > 0 ? " OR " : whereStarted ? " AND (" : " WHERE ("}p.id_profissional IS null
      `;
      whereStarted = true;
    }
    queryResult += ")";
  }

  if (units) {
    const unitsNotNull = units
      .split("|")
      .filter((item) => item !== "null")
      .map((n) => `'${sqlText(n)}'`)
      .join(",");
    if (unitsNotNull.length > 0) {
      queryResult += `
      ${whereStarted ? " AND" : " WHERE"} (p.nu_cnes IS NOT null AND p.nu_cnes IN (${unitsNotNull})
      `;
      whereStarted = true;
    }
    if (units.includes("null")) {
      queryResult += `
      ${unitsNotNull.length > 0 ? " OR " : whereStarted ? " AND (" : " WHERE ("}p.nu_cnes IS null
      `;
      whereStarted = true;
    }
    queryResult += ")";
  }

  if (patientBeginAgeDate || patientEndAgeDate) {
    queryResult += whereStarted ? " AND" : " WHERE";
    if (patientBeginAgeDate && patientEndAgeDate) {
      queryResult += ` p.dt_nascimento BETWEEN '${sqlText(patientBeginAgeDate)}' AND '${sqlText(patientEndAgeDate)}'`;
    } else {
      queryResult += ` p.dt_nascimento ${patientBeginAgeDate ? ">" : "<"}= '${sqlText(patientBeginAgeDate || patientEndAgeDate)}'`;
    }
    whereStarted = true;
  }

  queryResult += `)
  SELECT
    ex.*,
    CASE
      WHEN sc.data_agenda IS NULL THEN NULL
      ELSE (sc.data_agenda + sc.hr_agendado::time)::timestamp
    END AS "agendaAt"
  FROM exams ex
  LEFT JOIN  (${queryAppointments}) sc on sc.id_paciente = ex."patientPecId" AND sc.dt_criacao = ex."colectDate"
  `;

  whereStarted = false;
  if (examStatus) {
    queryResult += `
    WHERE ex.status IN (${sqlIntegerList(examStatus)})
    `;
    whereStarted = true;
  }

  if (examAppointmentStatus) {
    queryResult += `
    ${whereStarted ? " AND" : "WHERE"} ex."scheduleStatus" IN (${sqlIntegerList(examAppointmentStatus)})
    `;
    whereStarted = true;
  }

  return queryResult;
};

export const queryExamAppointments = (patientId: string) => {
  return `
  WITH exams as (
    SELECT * FROM (${queryExamsAppointments()}) ex
    WHERE ex.id_paciente = ${sqlInteger(patientId)} AND ex.dt_avaliado IS NOT null
  )
  SELECT
    sc.id_agendamento as id,
    sc.id_paciente as "patientPecId",
    (sc.dt_criacao + sc.hr_cricao::time)::timestamp as "createdAt",
    (sc.data_agenda + sc.hr_agendado::time)::timestamp as "agendaAt"
  FROM (${queryAppointments}) sc
  INNER JOIN exams ex on ex.id_paciente = sc.id_paciente
  WHERE ex.dt_coleta = sc.dt_criacao
  `;
};
