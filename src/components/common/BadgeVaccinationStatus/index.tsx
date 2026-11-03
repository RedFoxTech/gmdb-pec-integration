import theme from "@/shared/theme/material-theme";
import { Box } from "@mui/material";
import Text from "../Text";
import typography from "@/shared/theme/typography-theme";

export type BadgeVaccinationStatusProps = {
  vaccinated: boolean;
};

const BadgeVaccinationStatus: React.FC<BadgeVaccinationStatusProps> = ({
  vaccinated,
}) => {
  return (
    <Box
      bgcolor={
        vaccinated ? theme.palette.success.main : theme.palette.success.main
      }
      width="fit-content"
      p="0.8rem"
      borderRadius="10rem"
    >
      <Text color={theme.palette.white.main} {...typography.paragraph.l3}>
        {vaccinated ? "Vacindado" : "Não vacinado"}
      </Text>
    </Box>
  );
};

export default BadgeVaccinationStatus;
