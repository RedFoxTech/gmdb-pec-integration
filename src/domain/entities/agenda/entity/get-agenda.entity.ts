import { ListMeta } from "../../common";
import { AgendaEntity } from "./agenda.entity";

export interface GetAgendaEntity {
  data: AgendaEntity[];
  meta: ListMeta;
}
