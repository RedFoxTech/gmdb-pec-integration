export type EarlyDetectionIndicatorsPendingScheduledExamsItemEntity = {
  value: number;
  percentage: number;
  volume: number;
};

export interface EarlyDetectionIndicatorsPendingScheduledExamsEntity {
  age35And45: EarlyDetectionIndicatorsPendingScheduledExamsItemEntity;
  age25To64: EarlyDetectionIndicatorsPendingScheduledExamsItemEntity;
}
