import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import * as bodyParser from "body-parser";
import { BigIntInterceptor } from "./common/interceptor/big-int-interceptor";

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    })
  );

  // app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new BigIntInterceptor());

  const config = new DocumentBuilder()
    .setTitle("Projeto Vacinação")
    .setDescription("Projeto Vacinação - API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  if (isSwaggerEnabled()) {
    SwaggerModule.setup("api", app, document);
  }

  app.use(helmet());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.enableCors({ origin: corsOrigins() });

  await app.listen(process.env.PORT);
  console.log(`Application is running ✅ - PORT ${process.env.PORT}`);
}

// Swagger lists every route, so it stays off unless enabled or running in development
function isSwaggerEnabled(): boolean {
  if (process.env.SWAGGER_ENABLED !== undefined) {
    return process.env.SWAGGER_ENABLED === "true";
  }
  return process.env.NODE_ENV === "development";
}

// CORS_ORIGINS is a comma-separated list; when empty, any origin is accepted
function corsOrigins(): string[] | boolean {
  const origins = (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (origins.length === 0) {
    console.warn("CORS_ORIGINS not set: accepting requests from any origin");
    return true;
  }
  return origins;
}

bootstrap();
