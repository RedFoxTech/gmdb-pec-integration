import { describe, expect, it } from "@jest/globals";
import { BadRequestException } from "@nestjs/common";
import { sqlInteger, sqlIntegerList, sqlText } from "./sql";
import { normalizeQueryToStr } from "./utils";
import { queryAllPatientsByImmunobiological } from "src/modules/patient/query";
import { queryAll as queryAllExams, queryExamAppointments } from "src/modules/exam/query";
import { queryAcsByVaccinationRanking } from "src/modules/acs/query";
import { queryUnitsById } from "src/modules/unit/query";

process.env.IBGE_CODE = "2303709";

const INJECTION = "x') OR 1=1 --";

describe("sqlText", () => {
  it("keeps values without quotes unchanged", () => {
    expect(sqlText("José da Silva")).toBe("José da Silva");
    expect(sqlText("2010-01-01T03:00:00.000Z")).toBe("2010-01-01T03:00:00.000Z");
  });

  it("doubles single quotes so they cannot close the SQL string", () => {
    expect(sqlText("D'Ávila")).toBe("D''Ávila");
    expect(sqlText(INJECTION)).toBe("x'') OR 1=1 --");
  });

  it("rejects backslashes and NUL characters", () => {
    expect(() => sqlText("a\\' OR 1=1")).toThrow(BadRequestException);
    expect(() => sqlText("a\0b")).toThrow(BadRequestException);
  });
});

describe("sqlInteger and sqlIntegerList", () => {
  it("accept integers, including negative status codes", () => {
    expect(sqlInteger("15")).toBe("15");
    expect(sqlInteger(2024)).toBe("2024");
    expect(sqlIntegerList("2|1|0|-1")).toBe("2,1,0,-1");
  });

  it.each(["1 OR 1=1", "1); DROP TABLE patients; --", "abc", "", "1.5"])(
    "rejects %p",
    (value) => {
      expect(() => sqlInteger(value)).toThrow(BadRequestException);
      expect(() => sqlIntegerList(`1|${value}`)).toThrow(BadRequestException);
    },
  );
});

describe("query builders with malicious filters", () => {
  const countQuotes = (sql: string) => (sql.match(/'/g) ?? []).length;

  it("keeps an injected patient name inside the ILIKE string", () => {
    const safe = queryAllPatientsByImmunobiological({
      immunobiologicalIds: "60",
      patientName: "Maria",
    } as never);
    const attacked = queryAllPatientsByImmunobiological({
      immunobiologicalIds: "60",
      patientName: INJECTION,
    } as never);
    expect(attacked).toContain("ILIKE lower('%x'') OR 1=1 --%')");
    // Only the doubled quote is added; the string literal still closes where it should
    expect(countQuotes(attacked) - countQuotes(safe)).toBe(2);
  });

  it("keeps injected unit codes inside their string literals", () => {
    expect(normalizeQueryToStr(`2526565|${INJECTION}`)).toBe(
      "'2526565','x'') OR 1=1 --'",
    );
    expect(queryUnitsById({ ids: `2526565|${INJECTION}` } as never)).toContain(
      "'x'') OR 1=1 --'",
    );
  });

  it.each([
    ["patientsIds", { immunobiologicalIds: "60", patientsIds: "1) OR (1=1" }],
    ["immunobiologicalIds", { immunobiologicalIds: "60) OR (1=1" }],
    ["acs", { immunobiologicalIds: "60", acs: "101|1) OR (1=1" }],
    ["birth date", { immunobiologicalIds: "60", beginAgeDate: "a\\' OR 1=1" }],
  ])("rejects an injected %s in the patient query", (_field, params) => {
    expect(() => queryAllPatientsByImmunobiological(params as never)).toThrow(
      BadRequestException,
    );
  });

  it.each([
    ["examStatus", { examStatus: "2) OR (1=1" }],
    ["examAppointmentStatus", { examAppointmentStatus: "1) OR (1=1" }],
    ["acs", { acs: "1) OR (1=1" }],
  ])("rejects an injected %s in the exam query", (_field, params) => {
    expect(() => queryAllExams(params as never)).toThrow(BadRequestException);
  });

  it("rejects an injected patient id in exam appointments", () => {
    expect(() => queryExamAppointments("1 OR 1=1")).toThrow(BadRequestException);
  });

  it.each([
    ["acs", { immunobiologicalIds: "60", acs: "1) OR (1=1" }],
    ["position", { immunobiologicalIds: "60", position: "1 OR 1=1" }],
  ])("rejects an injected %s in the ACS ranking", (_field, params) => {
    expect(() => queryAcsByVaccinationRanking(params as never)).toThrow(
      BadRequestException,
    );
  });
});
