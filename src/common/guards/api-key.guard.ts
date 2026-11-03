import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { timingSafeEqual } from "crypto";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly validApiKey: Buffer;

  constructor(
    private configService: ConfigService,
    private reflector: Reflector
  ) {
    // Without API_KEY every request would match an absent header, so refuse to start
    const apiKey = this.configService.get<string>("API_KEY");
    if (!apiKey) {
      throw new Error("API_KEY environment variable is required");
    }
    this.validApiKey = Buffer.from(apiKey);
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers["x-api-key"];

    if (typeof apiKey !== "string" || !this.isValidApiKey(apiKey)) {
      throw new UnauthorizedException("Invalid API key");
    }

    return true;
  }

  private isValidApiKey(apiKey: string): boolean {
    const received = Buffer.from(apiKey);
    return (
      received.length === this.validApiKey.length &&
      timingSafeEqual(received, this.validApiKey)
    );
  }
}
