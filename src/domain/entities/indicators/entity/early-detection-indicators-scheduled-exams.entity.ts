export type EarlyDetectionIndicatorsScheduledExamsItemEntity = {
  value: number;
  percentage: number;
};

export interface EarlyDetectionIndicatorsScheduledExamsEntity {
  age35And45: EarlyDetectionIndicatorsScheduledExamsItemEntity;
  age25To64: EarlyDetectionIndicatorsScheduledExamsItemEntity;
}
