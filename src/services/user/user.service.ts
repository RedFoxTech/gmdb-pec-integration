import api from "../api/api";
import { AxiosInstance } from "axios";
import { getAuthToken } from "../api/utils/tokenUtils";
import { parseObjectToQueryString } from "@/shared/stringUtils";
import {
  GetAllUsersDto,
  GetUsersEntity,
  RegisterUserDto,
  UpdateUserDto,
  UserAdminEntity,
  UserAuthEntity,
} from "@/domain/entities/user";

export class UserService {
  private readonly api: AxiosInstance = api;
  private readonly path: string = "/user";

  constructor() {
    this.makePath = this.makePath.bind(this);
    this.me = this.me.bind(this);
    this.getAll = this.getAll.bind(this);
    this.register = this.register.bind(this);
    this.update = this.update.bind(this);
  }

  private makePath(path: string): string {
    return `${this.path}/${path}`;
  }

  async me(): Promise<UserAuthEntity> {
    try {
      console.log("getAuthToken()", getAuthToken());
      const result = await this.api.get<UserAuthEntity>(this.makePath("me"), {
        headers: {
          authorization: getAuthToken(),
        },
      });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAll(data: GetAllUsersDto): Promise<GetUsersEntity> {
    try {
      const result = await this.api.get<GetUsersEntity>(
        `${this.path}/${parseObjectToQueryString(data)}`,
        {
          headers: {
            authorization: getAuthToken(),
          },
        }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async register(data: RegisterUserDto): Promise<UserAdminEntity> {
    try {
      const result = await this.api.post<UserAdminEntity>(this.path, data, {
        headers: {
          authorization: getAuthToken(),
        },
      });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(data: UpdateUserDto): Promise<UserAdminEntity> {
    try {
      const result = await this.api.patch<UserAdminEntity>(
        this.makePath(data.id),
        data.data,
        {
          headers: {
            authorization: getAuthToken(),
          },
        }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
