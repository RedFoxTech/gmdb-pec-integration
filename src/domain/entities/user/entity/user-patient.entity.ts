import { GenderEnum } from "@/domain/consts";
import { UserEntity } from "./user.entity";
import { UserAddressEntity } from "../../address";

export interface UserPatientEntity extends UserEntity {
  document: string;
  birthday: string;
  gender: GenderEnum;
  phone: string;
  responsibleName: string;
  responsibleDocument: string;
  addresses: UserAddressEntity[];
}
