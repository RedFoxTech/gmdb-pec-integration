import { AcsEntity } from "./acs.entity";

export interface AcsByVaccinationRankingEntity extends AcsEntity {
  vaccinated: number;
  notVaccinated: number;
  position: number;
}
