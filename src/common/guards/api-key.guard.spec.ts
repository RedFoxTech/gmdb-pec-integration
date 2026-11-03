import { describe, expect, it } from "@jest/globals";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { ApiKeyGuard } from "./api-key.guard";

function buildContext(headers: Record<string, string>): ExecutionContext {
  return {
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({ getRequest: () => ({ headers }) }),
  } as unknown as ExecutionContext;
}

function buildGuard(apiKey: string | undefined, isPublic = false) {
  const configService = { get: () => apiKey } as unknown as ConfigService;
  const reflector = {
    getAllAndOverride: () => isPublic,
  } as unknown as Reflector;
  return new ApiKeyGuard(configService, reflector);
}

describe("ApiKeyGuard", () => {
  it("fails to start when API_KEY is not configured", () => {
    expect(() => buildGuard(undefined)).toThrow("API_KEY");
    expect(() => buildGuard("")).toThrow("API_KEY");
  });

  it("accepts a request with the configured key", () => {
    const guard = buildGuard("correct-key");
    expect(guard.canActivate(buildContext({ "x-api-key": "correct-key" }))).toBe(
      true,
    );
  });

  it("rejects a request without key", () => {
    const guard = buildGuard("correct-key");
    expect(() => guard.canActivate(buildContext({}))).toThrow(
      UnauthorizedException,
    );
  });

  it("rejects a request with a wrong key", () => {
    const guard = buildGuard("correct-key");
    expect(() =>
      guard.canActivate(buildContext({ "x-api-key": "wrong-key" })),
    ).toThrow(UnauthorizedException);
    expect(() =>
      guard.canActivate(buildContext({ "x-api-key": "correct-ke" })),
    ).toThrow(UnauthorizedException);
  });

  it("lets public routes through without key", () => {
    const guard = buildGuard("correct-key", true);
    expect(guard.canActivate(buildContext({}))).toBe(true);
  });
});
