import { GenderEnum, UserProfiles, UserTypes } from "@/domain/consts";
import { CityHallEntity } from "../../city-hall";

export interface UserAuthEntity {
  id: string;
  userTypeId: UserTypes;
  profileId: UserProfiles;
  name: string;
  email: string;
  document?: string;
  birthday?: string;
  gender?: GenderEnum;
  phone: string;
  responsibleName?: string;
  responsibleDocument?: string;
  cityHall: CityHallEntity;
  status: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
