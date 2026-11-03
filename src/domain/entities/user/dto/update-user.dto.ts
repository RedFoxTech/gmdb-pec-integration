import { RegisterUserDto } from "./register-user.dto";

export type UpdateUserDataDto = Omit<RegisterUserDto, "password"> & {};

export interface UpdateUserDto {
  id: string;
  data: UpdateUserDataDto;
}
