import { ListMeta } from "../../common";
import { PatientEntity } from "./patient.entity";

export interface GetPatientsEntity {
  data: PatientEntity[];
  meta: ListMeta;
}
