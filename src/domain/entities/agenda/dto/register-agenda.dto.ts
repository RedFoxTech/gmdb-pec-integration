import { AgendaPeriod, AgendaType } from "@/domain/consts";

export interface RegisterAgendaDto {
  unitId: string;
  type: AgendaType;
  date: string;
  period: AgendaPeriod;
  slots: number;
}
