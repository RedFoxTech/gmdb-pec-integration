export type HpvIndicatorCoverageRangeItemEntity = {
  value: number;
  percentage?: number;
};

export interface HpvIndicatorCoverageRangeEntity {
  age: HpvIndicatorCoverageRangeItemEntity;
  femaleTotal: HpvIndicatorCoverageRangeItemEntity;
  femaleVaccinated: HpvIndicatorCoverageRangeItemEntity;
  femaleNotVaccinated: HpvIndicatorCoverageRangeItemEntity;
  maleTotal: HpvIndicatorCoverageRangeItemEntity;
  maleVaccinated: HpvIndicatorCoverageRangeItemEntity;
  maleNotVaccinated: HpvIndicatorCoverageRangeItemEntity;
  generalTotal: HpvIndicatorCoverageRangeItemEntity;
  generalVaccinated: HpvIndicatorCoverageRangeItemEntity;
  generalNotVaccinated: HpvIndicatorCoverageRangeItemEntity;
}
