import { Select, Text } from "@/components/common";
import { CampaignStatusEnum } from "@/domain/consts";
import { campaignStatusList } from "@/shared/lists";
import typography from "@/shared/theme/typography-theme";
import { Box } from "@mui/material";
import { FormEvent, useState } from "react";

export type CampaignStatusChangeFormProps = {
  formId: string;
  onSubmit: (data: CampaignStatusEnum) => void;
};

const CampaignStatusChangeForm: React.FC<CampaignStatusChangeFormProps> = ({
  formId,
  onSubmit,
}) => {
  const [status, setStatus] = useState<CampaignStatusEnum>();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status) {
      onSubmit(status);
    }
  };

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit}>
      <Text {...typography.title.h2l} mb="2.4rem">
        Status da Campanha
      </Text>
      <Select
        value={status}
        label="Status"
        options={campaignStatusList}
        onChange={(e) => setStatus(e.target.value as CampaignStatusEnum)}
      ></Select>
    </Box>
  );
};

export default CampaignStatusChangeForm;
