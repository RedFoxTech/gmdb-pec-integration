import { EarlyDetectionIndicatorsChallengeGoalEntity } from "./early-detection-indicators-challenge-goal.entity";
import { EarlyDetectionIndicatorsCoverageEntity } from "./early-detection-indicators-coverage.entity";
import { EarlyDetectionIndicatorsDetectionTrackingEntity } from "./early-detection-indicators-detection-tracking.entity";
import { EarlyDetectionIndicatorsGeneralEntity } from "./early-detection-indicators-general.entity";
import { EarlyDetectionIndicatorsPendingScheduledExamsEntity } from "./early-detection-indicators-pending-scheduled-exams.entity";
import { EarlyDetectionIndicatorsPerformedExamsHpvDnaEntity } from "./early-detection-indicators-performed-exams-hpv-dna.entity";
import { EarlyDetectionIndicatorsPerformedExamsEntity } from "./early-detection-indicators-performed-exams.entity";
import { EarlyDetectionIndicatorsScheduledExamsEntity } from "./early-detection-indicators-scheduled-exams.entity";

export interface GetEarlyDetectionIndicatorsEntity {
  general?: EarlyDetectionIndicatorsGeneralEntity;
  coverage?: EarlyDetectionIndicatorsCoverageEntity;
  scheduledExams?: EarlyDetectionIndicatorsScheduledExamsEntity;
  pendingScheduledExams?: EarlyDetectionIndicatorsPendingScheduledExamsEntity;
  challengeGoal?: EarlyDetectionIndicatorsChallengeGoalEntity;
  detectionTracking?: EarlyDetectionIndicatorsDetectionTrackingEntity[];
  performedExams?: EarlyDetectionIndicatorsPerformedExamsEntity;
  performedExamsHpvDna?: EarlyDetectionIndicatorsPerformedExamsHpvDnaEntity;
}
