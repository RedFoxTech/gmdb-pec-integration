import { describe, expect, it, jest } from "@jest/globals";
import { BadRequestException } from "@nestjs/common";
import { PatientService } from "./patient.service";

function buildService() {
  const queryRawUnsafe = jest.fn(async (..._args: unknown[]) => [
    { patientPecId: "123" },
  ]);
  const service = new PatientService(
    {} as never,
    { $queryRawUnsafe: queryRawUnsafe } as never,
  );
  return { service, queryRawUnsafe };
}

describe("PatientService.findOne", () => {
  it("sends the CPF as a query parameter, not inside the SQL text", async () => {
    const { service, queryRawUnsafe } = buildService();

    await service.findOne("12345678901");

    const [sql, ...params] = queryRawUnsafe.mock.calls[0];
    expect(sql).not.toContain("12345678901");
    expect(params).toEqual(["12345678901", "12345678901"]);
  });

  it.each([
    "1' OR '1'='1",
    "1; DROP TABLE patients",
    "abc",
    "",
    "1234567890123456789",
  ])("rejects %p without querying the database", async (input) => {
    const { service, queryRawUnsafe } = buildService();

    await expect(service.findOne(input)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(queryRawUnsafe).not.toHaveBeenCalled();
  });
});
