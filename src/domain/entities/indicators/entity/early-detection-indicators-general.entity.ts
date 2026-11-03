export type EarlyDetectionIndicatorsGeneralItemEntity = {
  total: number;
  age25To64: number;
  age35And45: number;
};

export interface EarlyDetectionIndicatorsGeneralEntity {
  all: EarlyDetectionIndicatorsGeneralItemEntity;
  examUpToDate: EarlyDetectionIndicatorsGeneralItemEntity;
  examPending: EarlyDetectionIndicatorsGeneralItemEntity;
  examsWithoutColect: number;
}
