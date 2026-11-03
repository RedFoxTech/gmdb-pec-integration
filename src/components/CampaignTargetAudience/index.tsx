import { Box } from "@mui/material";
import { Button, Text, TextField } from "../common";
import typography from "@/shared/theme/typography-theme";
import { Dialog } from "../dialogs";
import { useEffect, useMemo, useState } from "react";
import { Form } from "./Form";
import { usePatient, useSegment, useTag, useUnit } from "@/hooks";
import { RegisterCampaignTargetAudienceDto } from "@/domain/entities/campaign";
import { TablePatientsCapaign } from "../Tables";
import { getDateRangeByAgeRange } from "@/shared/stringUtils";
import { AgeRangeEnum, ImmunobiolocalsEnum } from "@/domain/consts";
import { GetPatientsDto } from "@/domain/entities/patient";

export type CampaignTargetAudienceProps = {
  targetAudience?: RegisterCampaignTargetAudienceDto;
  disabled?: boolean;
  onSubmit: (data: RegisterCampaignTargetAudienceDto) => void;
  onExportData?: () => void;
};

const MIN_DATE = `${new Date().getFullYear() - 14}-01-01`;
const MAX_DATE = `${new Date().getFullYear() - 9}-12-31`;

const defaultAgeGroup = [
  AgeRangeEnum.FIFTEEN_TO_NINETEEN,
  AgeRangeEnum.NINE_TO_ELEVEN,
  AgeRangeEnum.TWELVE_TO_FOURTEEN,
];

const CampaignTargetAudience: React.FC<CampaignTargetAudienceProps> = ({
  targetAudience,
  disabled,
  onSubmit,
  onExportData,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedTargetAudience, setSelectedTargetAudience] =
    useState(targetAudience);
  const [currentAudienceSize, setCurrentAudienceSize] = useState(0);

  const { units } = useUnit("capaign-target-audience", {
    getUnitsOptions: {
      enabled: true,
    },
  });

  const { tags } = useTag({
    getTagsOptions: {
      enabled: true,
    },
  });

  const { segments } = useSegment({
    getSegmentsOptions: {
      enabled: true,
    },
  });

  const selectedTargetAudienceParams: GetPatientsDto = useMemo(() => {
    const dateRange =
      selectedTargetAudience?.ageGroup &&
      selectedTargetAudience?.ageGroup.length > 0
        ? getDateRangeByAgeRange(selectedTargetAudience?.ageGroup)
        : {
            begin: MIN_DATE,
            end: MAX_DATE,
          };

    return {
      immunobiologicalIds: ImmunobiolocalsEnum.HPV,
      patientName: selectedTargetAudience?.patientName,
      tags: selectedTargetAudience?.tags.join("|"),
      units: selectedTargetAudience?.unitId,
      segments: selectedTargetAudience?.segmentId,
      beginAgeDate: dateRange.begin,
      endAgeDate: dateRange.end,
    };
  }, [selectedTargetAudience]);

  const { allPatientsData, allPatientsDataMeta } = usePatient(
    "campaign-target-audience",
    {
      getAllPatientsOptions: {
        enabled: Boolean(selectedTargetAudience),
        params: selectedTargetAudienceParams,
      },
    }
  );

  const handleSubmit = () => {
    const data: RegisterCampaignTargetAudienceDto = selectedTargetAudience || {
      patientName: "",
      tags: [],
      ageGroup: defaultAgeGroup,
    };

    onSubmit(data);
    setShowForm(false);
  };

  useEffect(() => {
    if (allPatientsDataMeta) {
      setCurrentAudienceSize(allPatientsDataMeta.totalItems);
    }
  }, [allPatientsDataMeta]);

  useEffect(() => {
    setSelectedTargetAudience(targetAudience);
  }, [targetAudience]);

  return (
    <Box>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          gap="1rem"
          mb="2.4rem"
        >
          <Text {...typography.title.h3l}>Público alvo</Text>
          <Box display="flex" gap="1rem">
            <Button
              variant="outlined"
              disabled={disabled}
              onClick={() => setShowForm(true)}
            >
              Definir público
            </Button>
            <Button
              variant="outlined"
              disabled={!disabled}
              onClick={() => onExportData?.()}
            >
              exportar
            </Button>
          </Box>
        </Box>
        <TextField
          label="Quantidade de destinátarios"
          disabled
          value={`${currentAudienceSize} contato${
            currentAudienceSize > 1 ? "s" : ""
          }`}
        />
      </Box>
      <Dialog
        open={showForm}
        title="Público alvo"
        doneText="salvar"
        persist
        actions
        onClose={() => setShowForm(false)}
        onCancel={() => setShowForm(false)}
        onDone={handleSubmit}
      >
        <Box width="94rem" maxWidth="100%">
          <Form
            data={targetAudience}
            units={units}
            tags={tags}
            segments={segments}
            onSubmit={setSelectedTargetAudience}
          />
          {selectedTargetAudience && (
            <Box mt="2.4rem">
              <TablePatientsCapaign data={allPatientsData} />
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default CampaignTargetAudience;
