import { ListMeta } from "../../common";
import { UserAdminEntity } from "./user-admin.entity";
import { UserPatientEntity } from "./user-patient.entity";

export interface GetUsersEntity {
  data: UserAdminEntity[] | UserPatientEntity[];
  meta: ListMeta;
}
