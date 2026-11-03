import { PatientSchedulingStatus } from "@/domain/consts";
import theme from "@/shared/theme/material-theme";
import { Box } from "@mui/material";
import Text from "../Text";
import typography from "@/shared/theme/typography-theme";

export type BadgePatientSchedulingStatusProps = {
  status: PatientSchedulingStatus;
};

const BadgePatientSchedulingStatus: React.FC<
  BadgePatientSchedulingStatusProps
> = ({ status }) => {
  const badgeColor = {
    [PatientSchedulingStatus.APPOITNEMNT_PERFORMED]: theme.palette.success.main,
    [PatientSchedulingStatus.APPOITNEMNT_NOT_PERFORMED]: "#EF6C00",
  };

  return (
    <Box
      bgcolor={badgeColor[status]}
      width="fit-content"
      p="0.8rem"
      borderRadius="10rem"
    >
      <Text color={theme.palette.white.main} {...typography.paragraph.l3}>
        {status}
      </Text>
    </Box>
  );
};

export default BadgePatientSchedulingStatus;
