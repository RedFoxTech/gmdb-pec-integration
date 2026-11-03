import { sqlInteger, sqlIntegerList, sqlText } from "src/common/sql";
import { queryPatient, queryVaccination, queryUnit } from "../../../query";
import { PatientByImmunobiologicalFindAllDto } from "../dto/findAllByImmunobiological-dto";
import { FindManyByIdDto } from "../dto/findMany-dto";

export const queryAllPatientsByImmunobiological = (
  params: PatientByImmunobiologicalFindAllDto,
  hasPni?: boolean,
) => {
  const {
    vaccinated,
    immunobiologicalIds,
    patientName,
    acs,
    units,
    beginAgeDate,
    endAgeDate,
    patientsIds,
    beginVaccinationDate,
    endVaccinationDate,
  } = params;

  let queryResult = `
    WITH patients AS (SELECT
      p.*,
      CASE
        WHEN p.id_profissional IS NOT NULL THEN json_build_object(
          'id', p.id_profissional::int,
          'name', p.no_prof_cad
        )
        ELSE NULL
      END AS acs,
      CASE
        WHEN un.nu_cnes IS NOT NULL THEN json_build_object(
          'id', un.nu_cnes,
          'name', un.no_unidade,
          'address', un.logradouro,
          'addressNumber', un.nu_logradouro,
          'neighborhood', un.bairro,
          'zipcode', un.cep
        )
        ELSE NULL
      END AS unit
    FROM (${queryPatient}) p
    LEFT JOIN (${queryUnit}) un ON un.nu_cnes = p.nu_cnes`;

  let whereStarted = false;
  if (patientsIds) {
    whereStarted = true;
    queryResult += `
    WHERE p.id_paciente in (${sqlIntegerList(patientsIds)})
    `;
  }

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

  if (beginAgeDate || endAgeDate) {
    queryResult += whereStarted ? " AND" : " WHERE";
    if (beginAgeDate && endAgeDate) {
      queryResult += ` p.dt_nascimento BETWEEN '${sqlText(beginAgeDate)}' AND '${sqlText(endAgeDate)}'`;
    } else {
      queryResult += ` p.dt_nascimento ${beginAgeDate ? ">" : "<"}= '${sqlText(beginAgeDate || endAgeDate)}'`;
    }
    whereStarted = true;
  }

  queryResult += `),
  vaccinations AS (SELECT * FROM (${queryVaccination}) vc`;
  if (beginVaccinationDate || endVaccinationDate) {
    if (beginVaccinationDate && endVaccinationDate) {
      queryResult += `
        WHERE vc.dt_aplicacao BETWEEN '${sqlText(beginVaccinationDate)}' AND '${sqlText(endVaccinationDate)}'
      `;
    } else {
      queryResult += `
        WHERE vc.dt_aplicacao ${beginVaccinationDate ? ">" : "<"}= '${sqlText(beginVaccinationDate || endVaccinationDate)}'
      `;
    }
  }
  queryResult += `),
    patientsWithVaccinations AS (SELECT pt.*, vc.id_imuno, vc.dt_aplicacao  FROM patients pt
    LEFT JOIN vaccinations vc ON vc.id_paciente = pt.id_paciente
    WHERE vc.id_paciente IS NOT null),
    fromVaccination as (
    SELECT
      DISTINCT ON (pw.id_paciente)
      pw.id_paciente as "patientPecId",
      pw.no_cidadao as name,
      pw.cpf as document,
      pw.dt_nascimento as birthdate,
      pw.cns,
      CASE
        WHEN pw.sexo = 'F' THEN 'Feminino'
        ELSE 'Masculino'
      END AS gender,
      pw.logradouro as address,
      pw.bairro as neighborhood,
      pw.contato as phone,
      null::text as email,
      pw.no_mae as "responsibleName",
      null::text as "responsibleDocument",
      true as vaccinated,
      pw.dt_aplicacao as "applicationDate",
      pw.acs,
      pw.unit
    FROM patientsWithVaccinations pw
    WHERE pw.id_imuno IN (${sqlIntegerList(immunobiologicalIds)}))
  `;

  if (hasPni) {
    queryResult += `,
    input_data(name, birthdate, applicationDate) AS (
      SELECT name, birthdate, applicationDate
      FROM ROWS FROM (
        unnest($1::varchar[]),
        unnest($2::date[]),
        unnest($3::date[])
      ) AS t(name, birthdate, applicationDate)
    ),
    patientsUpdated AS (SELECT
      p.id_paciente as "patientPecId",
      p.no_cidadao as name,
      p.cpf as document,
      p.dt_nascimento as birthdate,
      p.cns,
      CASE
        WHEN p.sexo = 'F' THEN 'Feminino'
        ELSE 'Masculino'
      END AS gender,
      p.logradouro as address,
      p.bairro as neighborhood,
      p.contato as phone,
      null::text as email,
      p.no_mae as "responsibleName",
      null::text as "responsibleDocument",
      true as vaccinated,
      i.applicationDate as "applicationDate",
      p.acs,
      p.unit
    FROM patients p
      JOIN input_data i ON lower(p.no_cidadao::varchar) = i.name AND DATE(p.dt_nascimento) = i.birthdate AND p.id_paciente NOT IN (SELECT pw."patientPecId" FROM fromVaccination pw)),
    fullyVaccinated AS (
      SELECT * FROM fromVaccination
      union all
      SELECT * FROM patientsUpdated
    )
    `;
  } else {
    queryResult += `,
    fullyVaccinated AS (SELECT * FROM fromVaccination)
    `;
  }

  if (vaccinated) {
    queryResult += `,
    filteredPatients AS (SELECT * FROM fullyVaccinated)
    `;
  } else {
    queryResult += `,
      notVaccinated AS (SELECT
        pt.id_paciente as "patientPecId",
        pt.no_cidadao as name,
        pt.cpf as document,
        pt.dt_nascimento as birthdate,
        pt.cns,
        CASE
          WHEN pt.sexo = 'F' THEN 'Feminino'
          ELSE 'Masculino'
        END AS gender,
        pt.logradouro as address,
        pt.bairro as neighborhood,
        pt.contato as phone,
        null::text as email,
        pt.no_mae as "responsibleName",
        null::text as "responsibleDocument",
        false as vaccinated,
        null::date as "applicationDate",
        pt.acs,
        pt.unit
      FROM patients pt WHERE pt.id_paciente NOT IN (SELECT pw."patientPecId" FROM fullyVaccinated pw)),
    `;

    // if (vaccinated === undefined) {
    queryResult += `
      filteredPatients AS (
        select * from fullyVaccinated
        union all
        select * from notVaccinated
      )
      `;
    // } else {
    //   queryResult += `
    //   filteredPatients AS (SELECT * FROM notVaccinated)
    //   `;
    // }
  }

  queryResult += `
  SELECT * FROM (
    SELECT DISTINCT ON (fp.name, fp.birthdate) * FROM filteredPatients fp
    ORDER BY name, birthdate, vaccinated DESC
  ) sub
  ${vaccinated === undefined ? "" : `WHERE sub.vaccinated = ${vaccinated ? "true" : "false"}`}
  ORDER BY name
  `;

  return queryResult;
};

// Expects $1 and $2 bound to the same id or CPF value
export const queryPatientByIdOrCpf = () => `
  SELECT
    p.id_paciente as "patientPecId",
    p.no_cidadao as name,
    p.cpf as document,
    p.dt_nascimento as birthdate,
    p.cns,
    CASE
      WHEN p.sexo = 'F' THEN 'Feminino'
      ELSE 'Masculino'
    END AS gender,
    p.logradouro as address,
    p.bairro as neighborhood,
    p.contato as phone,
    null::text as email,
    p.no_mae as "responsibleName",
    null::text as "responsibleDocument",
    CASE
      WHEN p.id_profissional IS NOT NULL THEN json_build_object(
        'id', p.id_profissional::int,
        'name', p.no_prof_cad
      )
      ELSE NULL
    END AS acs,
    CASE
        WHEN un.nu_cnes IS NOT NULL THEN json_build_object(
          'id', un.nu_cnes,
          'name', un.no_unidade,
          'address', un.logradouro,
          'addressNumber', un.nu_logradouro,
          'neighborhood', un.bairro,
          'zipcode', un.cep
        )
        ELSE NULL
      END AS unit
  FROM (${queryPatient}) p
  LEFT JOIN (${queryUnit}) un ON un.nu_cnes = p.nu_cnes
  WHERE p.id_paciente = $1::bigint OR p.cpf = $2
`;

export const queryPatientsById = (params: FindManyByIdDto) => `
  SELECT
    p.id_paciente as "patientPecId",
    p.no_cidadao as name,
    p.cpf as document,
    p.dt_nascimento as birthdate,
    p.cns,
    CASE
      WHEN p.sexo = 'F' THEN 'Feminino'
      ELSE 'Masculino'
    END AS gender,
    p.logradouro as address,
    p.bairro as neighborhood,
    p.contato as phone,
    null::text as email,
    p.no_mae as "responsibleName",
    null::text as "responsibleDocument",
    CASE
      WHEN p.id_profissional IS NOT NULL THEN json_build_object(
        'id', p.id_profissional::int,
        'name', p.no_prof_cad
      )
      ELSE NULL
    END AS acs,
    CASE
        WHEN un.nu_cnes IS NOT NULL THEN json_build_object(
          'id', un.nu_cnes,
          'name', un.no_unidade,
          'address', un.logradouro,
          'addressNumber', un.nu_logradouro,
          'neighborhood', un.bairro,
          'zipcode', un.cep
        )
        ELSE NULL
      END AS unit
  FROM (${queryPatient}) p
  LEFT JOIN (${queryUnit}) un ON un.nu_cnes = p.nu_cnes
  WHERE p.id_paciente IN (${sqlIntegerList(params.ids)})
`;

export const queryAllPatientsByImmunobiologicalForExport = (
  params: PatientByImmunobiologicalFindAllDto,
  hasPni?: boolean,
) => {
  const {
    vaccinated,
    immunobiologicalIds,
    patientName,
    acs,
    units,
    beginAgeDate,
    endAgeDate,
    patientsIds,
    beginVaccinationDate,
    endVaccinationDate,
  } = params;

  let queryResult = `
    WITH patients AS (SELECT
      p.*,
      CASE
        WHEN p.id_profissional IS NOT NULL THEN json_build_object(
          'id', p.id_profissional::int,
          'name', p.no_prof_cad
        )
        ELSE NULL
      END AS acs,
      CASE
        WHEN un.nu_cnes IS NOT NULL THEN json_build_object(
          'id', un.nu_cnes,
          'name', un.no_unidade,
          'address', un.logradouro,
          'addressNumber', un.nu_logradouro,
          'neighborhood', un.bairro,
          'zipcode', un.cep
        )
        ELSE NULL
      END AS unit
    FROM (${queryPatient}) p
    LEFT JOIN (${queryUnit}) un ON un.nu_cnes = p.nu_cnes`;

  let whereStarted = false;
  if (patientsIds) {
    whereStarted = true;
    queryResult += `
    WHERE p.id_paciente in (${sqlIntegerList(patientsIds)})
    `;
  }

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

  if (beginAgeDate || endAgeDate) {
    queryResult += whereStarted ? " AND" : " WHERE";
    if (beginAgeDate && endAgeDate) {
      queryResult += ` p.dt_nascimento BETWEEN '${sqlText(beginAgeDate)}' AND '${sqlText(endAgeDate)}'`;
    } else {
      queryResult += ` p.dt_nascimento ${beginAgeDate ? ">" : "<"}= '${sqlText(beginAgeDate || endAgeDate)}'`;
    }
    whereStarted = true;
  }

  queryResult += `),
  vaccinations AS (SELECT * FROM (${queryVaccination}) vc`;
  if (beginVaccinationDate || endVaccinationDate) {
    if (beginVaccinationDate && endVaccinationDate) {
      queryResult += `
        WHERE vc.dt_aplicacao BETWEEN '${sqlText(beginVaccinationDate)}' AND '${sqlText(endVaccinationDate)}'
      `;
    } else {
      queryResult += `
        WHERE vc.dt_aplicacao ${beginVaccinationDate ? ">" : "<"}= '${sqlText(beginVaccinationDate || endVaccinationDate)}'
      `;
    }
  }
  queryResult += `),
    patientsWithVaccinations AS (SELECT pt.*, vc.id_imuno, vc.dt_aplicacao, vc.no_imunobiologico, vc.no_dose FROM patients pt
    LEFT JOIN vaccinations vc ON vc.id_paciente = pt.id_paciente
    WHERE vc.id_paciente IS NOT null),
    fromVaccination as (
    SELECT
      pw.id_paciente as "patientPecId",
      pw.no_cidadao as name,
      pw.cpf as document,
      pw.dt_nascimento as birthdate,
      pw.cns,
      CASE
        WHEN pw.sexo = 'F' THEN 'Feminino'
        ELSE 'Masculino'
      END AS gender,
      pw.logradouro as address,
      pw.bairro as neighborhood,
      pw.contato as phone,
      null::text as email,
      pw.no_mae as "responsibleName",
      null::text as "responsibleDocument",
      true as vaccinated,
      pw.no_imunobiologico as immunobiological,
      pw.no_dose as dose,
      pw.dt_aplicacao as "applicationDate",
      pw.acs,
      pw.unit,
      false as "updatedWithPni"
    FROM patientsWithVaccinations pw
    WHERE pw.id_imuno IN (${sqlIntegerList(immunobiologicalIds)}))
  `;

  if (hasPni) {
    queryResult += `,
    input_data(name, birthdate, applicationDate) AS (
      SELECT name, birthdate, applicationDate
      FROM ROWS FROM (
        unnest($1::varchar[]),
        unnest($2::date[]),
        unnest($3::date[])
      ) AS t(name, birthdate, applicationDate)
    ),
    patientsUpdated AS (SELECT
      p.id_paciente as "patientPecId",
      p.no_cidadao as name,
      p.cpf as document,
      p.dt_nascimento as birthdate,
      p.cns,
      CASE
        WHEN p.sexo = 'F' THEN 'Feminino'
        ELSE 'Masculino'
      END AS gender,
      p.logradouro as address,
      p.bairro as neighborhood,
      p.contato as phone,
      null::text as email,
      p.no_mae as "responsibleName",
      null::text as "responsibleDocument",
      true as vaccinated,
      'Vacina HPV quadrivalente'::text as immunobiological,
      null::text as dose,
      i.applicationDate as "applicationDate",
      p.acs,
      p.unit,
      true as "updatedWithPni"
    FROM patients p
      JOIN input_data i ON lower(p.no_cidadao::varchar) = i.name AND DATE(p.dt_nascimento) = i.birthdate
      WHERE p.id_paciente NOT IN (SELECT pw."patientPecId" FROM fromVaccination pw)
    ),
    fullyVaccinated AS (
      SELECT * FROM fromVaccination
      union all
      SELECT * FROM patientsUpdated
    )
    `;
  } else {
    queryResult += `,
    fullyVaccinated AS (SELECT * FROM fromVaccination)
    `;
  }

  if (vaccinated) {
    queryResult += `,
    filteredPatients AS (SELECT * FROM fullyVaccinated),
    `;
  } else {
    queryResult += `,
      notVaccinated AS (SELECT
        pt.id_paciente as "patientPecId",
        pt.no_cidadao as name,
        pt.cpf as document,
        pt.dt_nascimento as birthdate,
        pt.cns,
        CASE
          WHEN pt.sexo = 'F' THEN 'Feminino'
          ELSE 'Masculino'
        END AS gender,
        pt.logradouro as address,
        pt.bairro as neighborhood,
        pt.contato as phone,
        null::text as email,
        pt.no_mae as "responsibleName",
        null::text as "responsibleDocument",
        false as vaccinated,
        null::text as immunobiological,
        null::text as dose,
        null::date as "applicationDate",
        pt.acs,
        pt.unit,
        false as "updatedWithPni"
      FROM patients pt WHERE pt.id_paciente NOT IN (SELECT pw."patientPecId" FROM fullyVaccinated pw)),
    `;

    // if (vaccinated === undefined) {
    queryResult += `
      filteredPatients AS (
        select * from fullyVaccinated
        union all
        select * from notVaccinated
      ),
      `;
    // } else {
    //   queryResult += `
    //   filteredPatients AS (SELECT * FROM notVaccinated),
    //   `;
    // }
  }

  // queryResult += `
  // SELECT * FROM filteredPatients fp
  // `;

  queryResult += `
  non_nulls AS (
    SELECT DISTINCT ON (name, birthdate, immunobiological) *
    FROM filteredPatients
    WHERE immunobiological IS NOT NULL
  ),
  nulls AS (
    SELECT DISTINCT ON (name, birthdate) *
    FROM filteredPatients t
    WHERE immunobiological IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM filteredPatients
        WHERE name = t.name
          AND birthdate = t.birthdate
          AND immunobiological IS NOT NULL
      )
  ),
  finalResult as (
    SELECT * FROM non_nulls
    UNION ALL
    SELECT * FROM nulls
  )
  SELECT * FROM finalResult fn
  ${vaccinated === undefined ? "" : `WHERE fn.vaccinated = ${vaccinated ? "true" : "false"}`}
  ORDER BY name;
  `;
  return queryResult;
};
