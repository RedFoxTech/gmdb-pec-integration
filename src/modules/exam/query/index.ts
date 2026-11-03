import { sqlInteger, sqlIntegerList, sqlText } from "src/common/sql";
import { PatientGenderEnum } from "src/modules/patient/patientGender.enum";
import {
  queryExamsAppointments,
  queryPatient,
  queryUnit,
  queryAppointments,
} from "../../../query";
import { ExamFindAllDto } from "../dto/findAll-dto";

const genderMapper = {
  [PatientGenderEnum.MALE]: "M",
  [PatientGenderEnum.FEMALE]: "F",
};

export const buildExamsQuery = (currentData?: string) => {
  const IBGE_CODE = parseInt(process.env.IBGE_CODE, 10);
  const now = currentData ? `'${sqlText(currentData)}'::DATE` : "CURRENT_DATE";

  return `
    WITH citopatologico_coletado AS (
      SELECT * FROM collected
      WHERE city_hall_id = ${IBGE_CODE}
      GROUP BY
        id_atend_coleta, import_version_id, city_hall_id
      ${
        now !== "CURRENT_DATE"
          ? `
      HAVING
          dt_coleta BETWEEN ${now} - INTERVAL '3 years' AND ${now}
      `
          : ""
      }
    ),
    citopatologico_solicitado AS (
      SELECT * FROM requested
      WHERE city_hall_id = ${IBGE_CODE}
      GROUP BY
        id_atend_solicitacao, import_version_id, city_hall_id
        ${
          now !== "CURRENT_DATE"
            ? `
        HAVING
            dt_solicitado BETWEEN ${now} - INTERVAL '3 years' AND ${now}
        `
            : ""
        }
    ),
    citopatologico_avaliado AS (
      SELECT * FROM evaluated
      WHERE city_hall_id = ${IBGE_CODE}
      GROUP BY
        id_atend_avaliado, import_version_id, city_hall_id
        ${
          now !== "CURRENT_DATE"
            ? `
        HAVING
            dt_avaliado BETWEEN ${now} - INTERVAL '3 years' AND ${now}
        `
            : ""
        }
    )
    select
      pt.id_paciente,
      citopatologico_coletado.id_prof_coleta as id_profissional_coleta,
      citopatologico_coletado.dt_coleta, -- data que foi coletado material para exaame
      citopatologico_solicitado.id_prof_solicitacao as id_profissional_solicitacao, -- profissional da consulta
      citopatologico_solicitado.dt_solicitado, -- caso tenha sido solicitado e não coletado na unidade terá a data da solicitação
      CASE
          WHEN citopatologico_solicitado.st_consulta_agendada = 1 or citopatologico_solicitado.st_cuidado_continuo = 1 THEN 1
          ELSE 0
      END AS agendado, -- informa que teve um agendamento ou se foi um cuidado continuado
      citopatologico_avaliado.dt_avaliado,
      citopatologico_coletado.filtro_procedimento as filtro_procedimento_coleteado,
      citopatologico_solicitado.filtro_procedimento as filtro_procedimento_solicitado,
      citopatologico_avaliado.filtro_procedimento as filtro_procedimento_avaliado
    FROM patients pt
      LEFT JOIN citopatologico_coletado ON citopatologico_coletado.id_paciente = pt.id_paciente
      LEFT JOIN citopatologico_solicitado ON citopatologico_solicitado.id_paciente = pt.id_paciente
      LEFT JOIN citopatologico_avaliado ON citopatologico_avaliado.id_paciente = pt.id_paciente
    WHERE pt.city_hall_id = ${IBGE_CODE}
      AND pt.dt_nascimento > ${now} - INTERVAL '65 years' -- filtra idade relacionada ao exame
      AND pt.dt_nascimento <=  ${now} - INTERVAL '25 years'
      AND pt.sexo = 'F' -- busca apenas sexo feminino
`;
};

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
    gender,
    collectionYear,
  } = params;

  const now = examDateTo ? `'${sqlText(examDateTo)}'::DATE` : "CURRENT_DATE";
  const IBGE_CODE = parseInt(process.env.IBGE_CODE, 10);

  let queryResult = `
    WITH exams as (
      SELECT distinct on(ap.id_paciente)
        ap.id_paciente as "patientPecId",
        ap.dt_coleta as "colectDate",
        ap.dt_solicitado as "solicitationDate",
        ap.agendado::boolean as scheduled,
        ap.dt_avaliado as "evaluatedDate",
        CASE
          WHEN GREATEST(ap.dt_solicitado, ap.dt_coleta, ap.dt_avaliado) IS NULL THEN -1 -- Nao definido
          WHEN GREATEST(ap.dt_solicitado, ap.dt_coleta, ap.dt_avaliado) >= ${now} - INTERVAL '1 year' THEN 2  -- Em dia
          WHEN GREATEST(ap.dt_solicitado, ap.dt_coleta, ap.dt_avaliado) >= ${now} - INTERVAL '3 years' THEN 1 -- Atenção
          ELSE 0 -- Vencido
        END AS status,
        CASE
          WHEN GREATEST(ap.dt_solicitado, ap.dt_coleta, ap.dt_avaliado) = ap.dt_avaliado THEN 'dt_avaliado'
          WHEN GREATEST(ap.dt_solicitado, ap.dt_coleta, ap.dt_avaliado) = ap.dt_coleta THEN 'dt_coleta'
          WHEN GREATEST(ap.dt_solicitado, ap.dt_coleta, ap.dt_avaliado) = ap.dt_solicitado THEN 'dt_solicitado'
          ELSE NULL
        END AS "dtUtilizada",
        GREATEST(ap.dt_solicitado, ap.dt_coleta, ap.dt_avaliado) AS "dtEfetiva",
        CASE
          WHEN ap.dt_coleta >= ${now} - INTERVAL '1 year' THEN 2 -- Não aplicável
          WHEN ap.agendado = 1 THEN 1 -- Agendado
          ELSE 0 -- Pendente
        END AS "scheduleStatus",
        COALESCE((ap.filtro_procedimento_coleteado ILIKE ANY (ARRAY['%0201020076%', '%0201020084%'])), false) AS "isHpvDnaCollected",
        COALESCE((ap.filtro_procedimento_solicitado ILIKE ANY (ARRAY['%0201020076%', '%0201020084%'])), false) AS "isHpvDnaRequested",
        COALESCE((ap.filtro_procedimento_avaliado ILIKE ANY (ARRAY['%0201020076%', '%0201020084%'])), false) AS "isHpvDnaEvaluated",
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
      FROM (${buildExamsQuery(examDateTo)}) ap
      INNER JOIN patients p on p.id_paciente = ap.id_paciente and p.city_hall_id = ${IBGE_CODE}
      LEFT JOIN unit un ON un.nu_cnes = p.nu_cnes
  `;

  let whereStarted = false;

  if (patientName) {
    queryResult += `
    ${whereStarted ? " AND" : " WHERE"} lower(p.no_cidadao) ILIKE lower('%${sqlText(patientName)}%')
    `;
    whereStarted = true;
  }

  if (gender) {
    queryResult += `
    ${whereStarted ? " AND" : " WHERE"} p.sexo = '${sqlText(genderMapper[gender])}'
    `;
    whereStarted = true;
  }

  if (collectionYear) {
    queryResult += `
    ${whereStarted ? " AND" : " WHERE"} extract(year from ap.dt_coleta)::int = ${sqlInteger(collectionYear)}
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

  queryResult += `
    ORDER BY ap.id_paciente, GREATEST(ap.dt_solicitado, ap.dt_coleta, ap.dt_avaliado) DESC NULLS LAST
  )
  SELECT
    ex.*,
    CASE
      WHEN sc.data_agenda IS NULL THEN NULL
      ELSE (sc.data_agenda + sc.hr_agendado::time)::timestamp
    END AS "agendaAt"
  FROM exams ex
  LEFT JOIN  appointments sc on sc.id_paciente = ex."patientPecId" AND sc.dt_criacao = ex."colectDate"
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
    SELECT * FROM (${buildExamsQuery()}) ex
    WHERE ex.id_paciente = ${sqlInteger(patientId)} AND ex.dt_avaliado IS NOT null
  )
  SELECT
    sc.id_agendamento as id,
    sc.id_paciente as "patientPecId",
    (sc.dt_criacao + sc.hr_criacao::time)::timestamp as "createdAt",
    (sc.data_agenda + sc.hr_agendado::time)::timestamp as "agendaAt"
  FROM appointments sc
  INNER JOIN exams ex on ex.id_paciente = sc.id_paciente
  WHERE ex.dt_coleta = sc.dt_criacao
  `;
};
