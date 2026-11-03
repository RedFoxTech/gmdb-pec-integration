import { ExamStatusEnum } from "@/domain/consts";
import theme from "@/shared/theme/material-theme";
import { Box } from "@mui/material";
import Text from "../Text";
import typography from "@/shared/theme/typography-theme";
import { appointmentStatusTranslate } from "@/shared/stringUtils";

export type BadgeCampaignStatusProps = {
  status: ExamStatusEnum;
};

const BadgeAppointmentStatus: React.FC<BadgeCampaignStatusProps> = ({
  status,
}) => {
  const badgeColor = {
    [ExamStatusEnum.UP_TO_DATE]: "#2E7D32",
    [ExamStatusEnum.OVERDUE]: "#D32F2F",
    [ExamStatusEnum.ATTENTION]: "#D3A900",
    [ExamStatusEnum.NOT_DEFINED]: "#7C7C7C",
  };

  return (
    <Box
      bgcolor={badgeColor[status]}
      width="fit-content"
      p="0.8rem"
      borderRadius="10rem"
    >
      <Text color={theme.palette.white.main} {...typography.paragraph.l3}>
        {appointmentStatusTranslate[status]}
      </Text>
    </Box>
  );
};

export default BadgeAppointmentStatus;
