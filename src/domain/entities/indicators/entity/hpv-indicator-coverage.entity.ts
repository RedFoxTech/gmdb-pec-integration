export type HpvIndicatorCoverageItemEntity = {
  value: number;
  percentage?: number;
  lessThanCurrent?: boolean;
  notAvailable?: boolean;
};

export interface HpvIndicatorCoverageEntity {
  general: HpvIndicatorCoverageItemEntity;
  female: HpvIndicatorCoverageItemEntity;
  male: HpvIndicatorCoverageItemEntity;
  lastMounth: HpvIndicatorCoverageItemEntity;
  lastYear: HpvIndicatorCoverageItemEntity;
}
