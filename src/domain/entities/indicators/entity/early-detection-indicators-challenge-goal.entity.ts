export type EarlyDetectionIndicatorsChallengeGoalItemEntity = {
  value: number;
  percentage: number;
};

export interface EarlyDetectionIndicatorsChallengeGoalEntity {
  age35And45: EarlyDetectionIndicatorsChallengeGoalItemEntity;
  age25To64: EarlyDetectionIndicatorsChallengeGoalItemEntity;
}
