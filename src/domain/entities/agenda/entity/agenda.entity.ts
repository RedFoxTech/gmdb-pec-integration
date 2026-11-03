import { AgendaPeriod, AgendaType } from "@/domain/consts";
import { UnitEntity } from "../../unit";

export interface AgendaEntity {
  id: string;
  unit: UnitEntity;
  type: AgendaType;
  date: string;
  period: AgendaPeriod;
  slots: number;
  availableSlots: number;
  status: string;
  active: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}
