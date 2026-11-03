import { UserProfiles, UserTypes } from "@/domain/consts";

export interface RegisterUserDto {
  profileId: UserProfiles;
  userTypeId: UserTypes;
  name: string;
  email: string;
  phone: string;
  password: string;
  cityHallId: string;
}
