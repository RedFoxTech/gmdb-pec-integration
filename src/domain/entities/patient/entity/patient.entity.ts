import { UnitEntity } from "../../unit";
import { TagEntity } from "../../Tag";
import { SegmentEntity } from "../../segment";
import { AcsEntity } from "../../acs";
import { ConsentEntity } from "../../consent";
import { GenderEnum } from "@/domain/consts";

export type PatientTagEntity = {
  tag: TagEntity;
};

export type PatientSegmentEntity = {
  segment: SegmentEntity;
};

export interface PatientEntity {
  id: string;
  patientPecId: string;
  name: string;
  document?: string;
  birthdate: string;
  cns?: string;
  gender: GenderEnum;
  neighborhood?: string;
  phone?: string;
  email?: string;
  responsibleName?: string;
  responsibleDocument?: string;
  vaccinated: boolean;
  applicationDate?: string;
  acs?: AcsEntity;
  tags: PatientTagEntity[];
  segments: PatientSegmentEntity[];
  consents: ConsentEntity[];
  unit?: UnitEntity;
}
