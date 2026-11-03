import { describe, expect, it } from "@jest/globals";
import * as acsQuery from "./modules/acs/query";
import * as acsDirectQuery from "./modules/acs/query/direct";
import * as examQuery from "./modules/exam/query";
import * as examDirectQuery from "./modules/exam/query/direct";
import * as patientQuery from "./modules/patient/query";
import * as patientDirectQuery from "./modules/patient/query/direct";
import * as unitQuery from "./modules/unit/query";
import * as unitDirectQuery from "./modules/unit/query/direct";
import { queryExamsAppointments } from "./query/exams-appointments.query";
import { PatientGenderEnum } from "./modules/patient/patientGender.enum";

// Characterization tests: the snapshots were recorded from the query builders
// before input escaping was added. For any valid filter the generated SQL must
// stay byte-for-byte identical, so these snapshots must never be updated to
// accept a change in valid-input SQL.

process.env.IBGE_CODE = "2303709";

// Builds the base params, each field alone, and everything together, so every
// "WHERE"/"AND" branch of the builders is exercised.
function variants<T extends object>(
  base: T,
  optional: Partial<Record<keyof T | string, unknown[]>>,
): Array<[string, T]> {
  const result: Array<[string, T]> = [["base", base]];
  const all = { ...base } as Record<string, unknown>;
  for (const [field, values] of Object.entries(optional)) {
    (values as unknown[]).forEach((value, index) => {
      result.push([`${field}#${index}`, { ...base, [field]: value } as T]);
    });
    all[field] = (values as unknown[])[0];
  }
  result.push(["all", all as T]);
  return result;
}

const unitsValues = ["2526565", "2526565|2481286", "null", "2526565|null"];
const acsValues = ["101", "101|202", "null", "101|null"];
const dates = ["2010-01-01", "2010-01-01T03:00:00.000Z"];

const patientCases = variants(
  { immunobiologicalIds: "60|67|68|93" } as Record<string, unknown>,
  {
    vaccinated: [true, false],
    patientName: ["Maria", "José da Silva", "ÂNGELA"],
    acs: acsValues,
    units: unitsValues,
    beginAgeDate: dates,
    endAgeDate: dates,
    patientsIds: ["1", "1|2|3"],
    beginVaccinationDate: dates,
    endVaccinationDate: dates,
  },
);

const examCases = variants({} as Record<string, unknown>, {
  patientName: ["Maria", "José da Silva"],
  acs: acsValues,
  units: unitsValues,
  examStatus: ["2", "2|1|0|-1", "-1"],
  examAppointmentStatus: ["2", "0|1|2"],
  patientBeginAgeDate: dates,
  patientEndAgeDate: dates,
  examDateTo: dates,
  gender: [PatientGenderEnum.FEMALE, PatientGenderEnum.MALE],
  collectionYear: [2024],
});

const rankingCases = variants(
  { immunobiologicalIds: "60|67|68|93" } as Record<string, unknown>,
  {
    acs: acsValues.filter((value) => !value.includes("null")),
    units: ["2526565", "2526565|2481286"],
    position: ["1", "15"],
    beginPatientAgeDate: dates,
    endPatientAgeDate: dates,
  },
);

const builders: Array<[string, (params: never) => unknown, Array<[string, unknown]>]> = [];
for (const [name, mod] of [
  ["patient/index", patientQuery],
  ["patient/direct", patientDirectQuery],
] as const) {
  builders.push([`${name} queryAllPatientsByImmunobiological`, mod.queryAllPatientsByImmunobiological as never, patientCases]);
  builders.push([`${name} queryAllPatientsByImmunobiological hasPni`, ((p: never) => mod.queryAllPatientsByImmunobiological(p, true)) as never, patientCases]);
  builders.push([`${name} queryAllPatientsByImmunobiologicalForExport`, mod.queryAllPatientsByImmunobiologicalForExport as never, patientCases]);
  builders.push([`${name} queryAllPatientsByImmunobiologicalForExport hasPni`, ((p: never) => mod.queryAllPatientsByImmunobiologicalForExport(p, true)) as never, patientCases]);
  builders.push([`${name} queryPatientsById`, mod.queryPatientsById as never, [["one", { ids: "1" }], ["many", { ids: "1|2|3" }]]]);
}
for (const [name, mod] of [
  ["exam/index", examQuery],
  ["exam/direct", examDirectQuery],
] as const) {
  builders.push([`${name} queryAll`, mod.queryAll as never, examCases]);
  builders.push([`${name} queryExamAppointments`, mod.queryExamAppointments as never, [["id", "12345"]]]);
}
builders.push(["exam/index buildExamsQuery", examQuery.buildExamsQuery as never, [["none", undefined], ...dates.map((d, i) => [`date#${i}`, d] as [string, unknown])]]);
builders.push(["query queryExamsAppointments", queryExamsAppointments as never, [["none", undefined], ...dates.map((d, i) => [`date#${i}`, d] as [string, unknown])]]);
for (const [name, mod] of [
  ["acs/index", acsQuery],
  ["acs/direct", acsDirectQuery],
] as const) {
  builders.push([`${name} queryAllAcs`, mod.queryAllAcs as never, [["none", {}], ["one", { units: "2526565" }], ["many", { units: "2526565|2481286" }]]]);
  builders.push([`${name} queryAcsByVaccinationRanking`, mod.queryAcsByVaccinationRanking as never, rankingCases]);
}
for (const [name, mod] of [
  ["unit/index", unitQuery],
  ["unit/direct", unitDirectQuery],
] as const) {
  builders.push([`${name} queryUnitsById`, mod.queryUnitsById as never, [["one", { ids: "2526565" }], ["many", { ids: "2526565|2481286" }]]]);
  builders.push([`${name} queryUnitsByVaccinationRanking`, mod.queryUnitsByVaccinationRanking as never, rankingCases]);
}

describe("SQL generated for valid filters", () => {
  for (const [builderName, build, cases] of builders) {
    describe(builderName, () => {
      it.each(cases)("%s", (_caseName, params) => {
        expect(build(params as never)).toMatchSnapshot();
      });
    });
  }
});
