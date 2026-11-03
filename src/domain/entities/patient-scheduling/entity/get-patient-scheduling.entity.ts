import { PatientSchedulingEntity } from "..";
import { ListMeta } from "../../common";

export interface GetPatientSchedulingEntity {
  data: PatientSchedulingEntity[];
  meta: ListMeta;
}
