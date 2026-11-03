import { sqlInteger } from "src/common/sql";
import { queryAllPatientsByImmunobiological } from "src/modules/patient/query";
import { queryUnit } from "../../../query";
import { UnitByRankingFindAllDto } from "../dto/findAllByRanking-dto";
import { UnitsByIdDto } from "../dto/findById-dto";
import { normalizeQueryToStr } from "src/common/utils";

export const queryAllUnit = `
SELECT
  nu_cnes AS id,
  no_unidade as name,
  logradouro as address,
  nu_logradouro as "addressNumber",
  bairro as neighborhood,
  cep as zipcode
FROM (${queryUnit}) AS un
`;

export const queryUnitsById = (params: UnitsByIdDto) => `
SELECT
  nu_cnes AS id,
  no_unidade as name,
  logradouro as address,
  nu_logradouro as "addressNumber",
  bairro as neighborhood,
  cep as zipcode
FROM (${queryUnit}) as un
WHERE nu_cnes in (${normalizeQueryToStr(params.ids)})
`;

export const queryUnitsByVaccinationRanking = (
  params: UnitByRankingFindAllDto,
) => {
  const {
    immunobiologicalIds,
    units,
    position,
    beginPatientAgeDate,
    endPatientAgeDate,
  } = params;

  let queryResult = `
    with unitsWithVaccination as (
      SELECT
        un.nu_cnes AS id,
        un.no_unidade as name,
        un.logradouro as address,
        un.nu_logradouro as "addressNumber",
        un.bairro as neighborhood,
        un.cep as zipcode,
        COUNT(CASE WHEN pt.vaccinated THEN 1 END)::int AS vaccinated,
        COUNT(CASE WHEN pt.vaccinated IS FALSE THEN 1 END)::int AS "notVaccinated"
      FROM (${queryUnit}) un
      LEFT JOIN (${queryAllPatientsByImmunobiological({ immunobiologicalIds, beginAgeDate: beginPatientAgeDate, endAgeDate: endPatientAgeDate })}) pt on (pt.unit->>'id') = un.nu_cnes
      GROUP BY un.nu_cnes, un.no_unidade, un.logradouro, un.nu_logradouro, un.bairro, un.cep
    ),
    rankedUnits as (
      SELECT
        uv.*,
        DENSE_RANK() OVER (ORDER BY uv.vaccinated DESC)::int AS position
      FROM unitsWithVaccination uv
    )
    SELECT * FROM rankedUnits ru
  `;

  let whereStarted = false;
  if (units) {
    queryResult += `
    ${whereStarted ? " AND" : "WHERE"} ru.id in (${normalizeQueryToStr(units)})
    `;
    whereStarted = true;
  }

  if (position) {
    queryResult += `
    ${whereStarted ? " AND" : "WHERE"} (
      position IN (
        (SELECT position FROM rankedUnits ORDER BY position ASC LIMIT 2)
      )
      OR position = ${sqlInteger(position)}
      OR position IN (
        SELECT position
        FROM rankedUnits
        ORDER BY position DESC
        LIMIT 2
      )
    )
    `;
    whereStarted = true;
  }

  queryResult += `
    ORDER BY ru.vaccinated DESC
  `;

  return queryResult;
};
