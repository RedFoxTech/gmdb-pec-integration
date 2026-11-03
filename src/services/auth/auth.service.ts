import api from "../api/api";
import { AxiosInstance } from "axios";
import { MakeLoginDto, LoginTokenEntity } from "@/domain/entities/auth";

export class AuthService {
  private readonly api: AxiosInstance = api;
  private readonly path: string = "/auth";

  constructor() {
    this.makePath = this.makePath.bind(this);
    this.login = this.login.bind(this);
  }

  private makePath(path: string): string {
    return `${this.path}/${path}`;
  }

  async login(data: MakeLoginDto): Promise<LoginTokenEntity> {
    try {
      const result = await this.api.post<LoginTokenEntity>(
        this.makePath("login"),
        data
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
