export type HpvIndicatorChalengeGoalItemEntity = {
  value: number;
  percentage?: number;
  lessThanCurrent?: boolean;
  notAvailable?: boolean;
};

export interface HpvIndicatorChalengeGoalEntity {
  general: HpvIndicatorChalengeGoalItemEntity;
  female: HpvIndicatorChalengeGoalItemEntity;
  male: HpvIndicatorChalengeGoalItemEntity;
  lastMounth: HpvIndicatorChalengeGoalItemEntity;
  lastYear: HpvIndicatorChalengeGoalItemEntity;
}
