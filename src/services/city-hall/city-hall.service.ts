import { CityHallOptionEntity } from "@/domain/entities/city-hall";
import api from "../api/api";
import { AxiosInstance } from "axios";

export class CityHallService {
  private readonly api: AxiosInstance = api;
  private readonly path: string = "/city-hall";

  constructor() {
    this.makePath = this.makePath.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  private makePath(path: string): string {
    return `${this.path}/${path}`;
  }

  async getOptions(): Promise<CityHallOptionEntity[]> {
    try {
      const result = await this.api.get<CityHallOptionEntity[]>(
        this.makePath("options")
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
