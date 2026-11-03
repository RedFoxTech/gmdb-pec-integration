import { UnitEntity } from "./unit.entity";

export interface UnitByVaccinationRankingEntity extends UnitEntity {
  vaccinated: number;
  notVaccinated: number;
  position: number;
}
