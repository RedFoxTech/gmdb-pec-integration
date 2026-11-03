import { UserEntity } from "./user.entity";

export interface UserAdminEntity extends UserEntity {
  email: string;
}
