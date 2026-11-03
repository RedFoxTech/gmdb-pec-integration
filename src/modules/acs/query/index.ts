import { sqlInteger, sqlIntegerList } from "src/common/sql";
import { queryAllPatientsByImmunobiological } from "src/modules/patient/query";
import { AcsByRankingFindAllDto } from "../dto/findAllByRanking-dto";
import { AcsFindAllDto } from "../dto/findAll-dto";
import { normalizeQueryToStr } from "src/common/utils";

export const queryAllAcs = (params: AcsFindAllDto) => {
  const IBGE_CODE = parseInt(process.env.IBGE_CODE, 10);

  const { units } = params;

  let queryResult = `
		SELECT
			id_profissional AS id,
			no_profissional as name,
			cns,
			id_unit as "unitId"
		FROM professional pf
		WHERE pf.city_hall_id = ${IBGE_CODE} AND pf.ativo > 0
	`;

  if (units) {
    queryResult += `
			AND pf.id_unit in (${normalizeQueryToStr(units)})
		`;
  }

  return queryResult;
};

export const queryAcsByVaccinationRanking = (
  params: AcsByRankingFindAllDto,
) => {
  const IBGE_CODE = parseInt(process.env.IBGE_CODE, 10);

  const {
    immunobiologicalIds,
    acs,
    units,
    position,
    beginPatientAgeDate,
    endPatientAgeDate,
  } = params;

  let queryResult = `
		with acsWithVaccination as (
			SELECT
				pr.id_profissional::int AS id,
                pr.no_profissional as name,
                pr.cns,
				pr.id_unit as "unitId",
				COUNT(CASE WHEN pt.vaccinated THEN 1 END)::int AS vaccinated,
				COUNT(CASE WHEN pt.vaccinated IS FALSE THEN 1 END)::int AS "notVaccinated"
			FROM professional pr
			LEFT JOIN (${queryAllPatientsByImmunobiological({ immunobiologicalIds, beginAgeDate: beginPatientAgeDate, endAgeDate: endPatientAgeDate })}) pt on (pt.acs->>'id')::int = pr.id_profissional::int
			WHERE pr.city_hall_id = ${IBGE_CODE} AND pr.ativo > 0${units ? ` AND pr.id_unit in (${normalizeQueryToStr(units)})` : ""}
			GROUP BY pr.id_profissional, pr.no_profissional, pr.cns, pr.id_unit
		),
		rankedAcs as (
			SELECT
				av.*,
				DENSE_RANK() OVER (ORDER BY av.vaccinated DESC)::int AS position
			FROM acsWithVaccination av
		)
		SELECT * FROM rankedAcs ra
	`;

  let whereStarted = false;
  if (acs) {
    queryResult += `
		${whereStarted ? " AND" : "WHERE"} ra.id in (${sqlIntegerList(acs)})
		`;
    whereStarted = true;
  }

  if (position) {
    queryResult += `
		${whereStarted ? " AND" : "WHERE"} (
			position IN (
				(SELECT position FROM rankedAcs ORDER BY position ASC LIMIT 2)
			)
			OR position = ${sqlInteger(position)}
			OR position IN (
				SELECT position
				FROM rankedAcs
				ORDER BY position DESC
				LIMIT 2
			)
		)
		`;
    whereStarted = true;
  }

  queryResult += `
		ORDER BY ra.vaccinated DESC
	`;

  return queryResult;
};
