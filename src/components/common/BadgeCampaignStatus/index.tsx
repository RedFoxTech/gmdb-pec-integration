import { CampaignStatusEnum } from "@/domain/consts";
import theme from "@/shared/theme/material-theme";
import { Box } from "@mui/material";
import Text from "../Text";
import typography from "@/shared/theme/typography-theme";

export type BadgeCampaignStatusProps = {
  status: CampaignStatusEnum;
};

const BadgeCampaignStatus: React.FC<BadgeCampaignStatusProps> = ({
  status,
}) => {
  const badgeColor = {
    [CampaignStatusEnum.DONE]: "#2E7D32",
    [CampaignStatusEnum.PENDING]: "#EF6C00",
    [CampaignStatusEnum.SENT]: theme.palette.primary.main,
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

export default BadgeCampaignStatus;
