import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from "@nestjs/terminus";
import { Public } from "src/common/decorators/public.decorator";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator
  ) {}

  // Liveness probe: Checks if the app is still running
  @Get("/live")
  @Public()
  @HealthCheck()
  async checkLiveness() {
    return this.health.check([]);
  }

  // Readiness probe: Checks if dependencies (e.g., database, external APIs) are healthy
  @Get("/ready")
  @Public()
  @HealthCheck()
  async checkReadiness() {
    return { status: "ok" };
    // return this.health.check([
    //   async () => this.http.pingCheck("google", "https://www.google.com"),
    // ]);
  }
}
