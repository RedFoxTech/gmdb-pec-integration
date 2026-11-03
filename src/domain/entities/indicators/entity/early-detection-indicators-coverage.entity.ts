export type EarlyDetectionIndicatorsCoverageItemEntity = {
  ageOthers: number;
  ageOthersPercent: number;
  age35And45: number;
  age35And45Percent: number;
  ageOthersLessThanCurrent?: boolean;
  age35And45LessThanCurrent?: boolean;
};

export interface EarlyDetectionIndicatorsCoverageEntity {
  current: EarlyDetectionIndicatorsCoverageItemEntity;
  lastMounth: EarlyDetectionIndicatorsCoverageItemEntity;
  lastYear: EarlyDetectionIndicatorsCoverageItemEntity;
}
