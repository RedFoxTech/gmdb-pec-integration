import { RegisterAgendaDto } from "./register-agenda.dto";

export interface UpdateAgendaDataDto extends RegisterAgendaDto {
  active?: boolean;
  status?: string;
}

export interface UpdateAgendatDto {
  id: string;
  data: UpdateAgendaDataDto;
}
