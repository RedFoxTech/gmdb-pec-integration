import { HpvIndicatorChalengeGoalEntity } from "./hpv-indicator-chalenge-goal.entity";
import { HpvIndicatorCoverageRangeEntity } from "./hpv-indicator-coverage-range.entity";
import { HpvIndicatorCoverageEntity } from "./hpv-indicator-coverage.entity";
import { HpvIndicatorNumberVaccinationsAdministeredEntity } from "./hpv-indicator-number-vaccinations-administered.entity";
import { HpvIndicatorNotConsentEntity } from "./hpv-indicator-not-consent.entity";

export interface GetHpvIndicatorsEntity {
  numberVaccinationsAdministered?: HpvIndicatorNumberVaccinationsAdministeredEntity;
  coverageRange?: HpvIndicatorCoverageRangeEntity[];
  coverage?: HpvIndicatorCoverageEntity;
  challengeGoal?: HpvIndicatorChalengeGoalEntity;
  notConsent?: HpvIndicatorNotConsentEntity;
}
