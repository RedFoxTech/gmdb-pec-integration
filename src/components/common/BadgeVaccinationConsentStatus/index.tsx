import { VaccinationConsentStatusEnum } from "@/domain/consts";
import theme from "@/shared/theme/material-theme";
import { Box } from "@mui/material";
import Text from "../Text";
import typography from "@/shared/theme/typography-theme";

export type BadgeVaccinationConsentStatusProps = {
  status: VaccinationConsentStatusEnum;
};

const BadgeVaccinationConsentStatus: React.FC<
  BadgeVaccinationConsentStatusProps
> = ({ status }) => {
  const badgeColor = {
    [VaccinationConsentStatusEnum.ALLOWED]: theme.palette.success.main,
    [VaccinationConsentStatusEnum.DENIED]: theme.palette.error.main,
    [VaccinationConsentStatusEnum.PENDING]: theme.palette.error.main,
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

export default BadgeVaccinationConsentStatus;
