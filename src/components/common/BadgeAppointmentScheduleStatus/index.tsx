import { ExamAppointmentStatusEnum } from "@/domain/consts";
import theme from "@/shared/theme/material-theme";
import { Box } from "@mui/material";
import Text from "../Text";
import typography from "@/shared/theme/typography-theme";
import { appointmentScheduleStatusTranslate } from "@/shared/stringUtils";

export type BadgeCampaignStatusProps = {
  status: ExamAppointmentStatusEnum;
};

const BadgeAppointmentScheduleStatus: React.FC<BadgeCampaignStatusProps> = ({
  status,
}) => {
  const badgeColor = {
    [ExamAppointmentStatusEnum.NOT_APPLICABLE]: "#7C7C7C",
    [ExamAppointmentStatusEnum.PENDING]: "#D32F2F",
    [ExamAppointmentStatusEnum.SCHEDULED]: "#2196F3",
  };

  return (
    <Box
      bgcolor={badgeColor[status]}
      width="fit-content"
      p="0.8rem"
      borderRadius="10rem"
    >
      <Text color={theme.palette.white.main} {...typography.paragraph.l3}>
        {appointmentScheduleStatusTranslate[status]}
      </Text>
    </Box>
  );
};

export default BadgeAppointmentScheduleStatus;
