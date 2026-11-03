export type EarlyDetectionIndicatorsPerformedExamsItemEntity = {
  age35And45: number;
  age25To64: number;
};

export interface EarlyDetectionIndicatorsPerformedExamsEntity {
  mounth: EarlyDetectionIndicatorsPerformedExamsItemEntity;
  year: EarlyDetectionIndicatorsPerformedExamsItemEntity;
}
