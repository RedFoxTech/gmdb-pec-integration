import { ImmunobiologicalEntity } from "../../immunobiological";
import { PatientEntity } from "../../patient";

export interface VaccinationEntity {
  id: string;
  immunobiological: ImmunobiologicalEntity;
  patient: PatientEntity;
}
