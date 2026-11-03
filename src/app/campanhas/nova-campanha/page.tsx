"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button, Text } from "@/components/common";
import typography from "@/shared/theme/typography-theme";
import { Box, Container, IconButton } from "@mui/material";
import { KeyboardBackspace as IconKeyboardBackspace } from "@mui/icons-material";
import { CampaignForm } from "@/components/Forms";
import CampaignTargetAudience from "@/components/CampaignTargetAudience";
import { useEffect, useMemo, useState } from "react";
import {
  RegisterCampaignDto,
  RegisterCampaignTargetAudienceDto,
  UpdateCampaignDataDto,
} from "@/domain/entities/campaign";
import useCampaign from "@/hooks/useCampaign";
import { useSnackbar } from "@/hooks";
import { SnackbarType } from "@/contexts/SnackbarContext";
import { PageEnum } from "@/domain/consts";

const FORM_ID = "form-campaigns";

const NewCampaigns = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const campaignId = searchParams.get("id");

  const [targetAudience, setTargetAudience] =
    useState<RegisterCampaignTargetAudienceDto>();

  const [formDisabled, setFormDisabled] = useState(Boolean(campaignId));

  const {
    registerCampaign,
    updateCampaign,
    campaigns,
    getGeneralReportRefetch,
    getCampaignTargetAudienceReportRefetch,
  } = useCampaign({
    getCampaignsOptions: {
      enabled: true,
    },
    getGeneralReportOptions: {
      params: {
        id: campaignId || "",
      },
    },
    getCampaignTargetAudiencelReportOptions: {
      params: {
        id: campaignId || "",
      },
    },
  });

  const selectedCampaign = useMemo(
    () => campaigns.find((item) => item.id === campaignId),
    [campaignId, campaigns]
  );

  useEffect(() => {
    if (selectedCampaign) {
      setTargetAudience({
        patientName: selectedCampaign.campaignTarget.patientName,
        segmentId: selectedCampaign.campaignTarget.segment?.id,
        unitId: selectedCampaign.campaignTarget.unit?.id,
        tags: selectedCampaign.campaignTarget.tags.map((item) => item.tag.id),
        ageGroup: selectedCampaign.campaignTarget.ageGroup,
      });
    }
  }, [selectedCampaign]);

  const { showSnackBar } = useSnackbar();

  const handleRegister = async (data: Omit<RegisterCampaignDto, "target">) => {
    if (targetAudience) {
      const result = await registerCampaign({
        ...data,
        target: targetAudience,
      });

      if (result?.error) {
        showSnackBar?.({
          message:
            result.error.response?.data.message ?? "Um erro inesperado ocorreu",
          type: SnackbarType.ERROR,
        });
      } else if (result.data) {
        showSnackBar?.({
          message: "Campanha cadastrada com sucesso",
          type: SnackbarType.SUCCESS,
        });
        router.push(PageEnum.CAMPAIGNS);
      }
    }
  };

  const handleUpdate = async (data: Omit<UpdateCampaignDataDto, "target">) => {
    if (targetAudience && selectedCampaign) {
      const result = await updateCampaign({
        id: selectedCampaign.id,
        data: {
          ...data,
          campaignTargetId: selectedCampaign.campaignTarget.id,
          target: targetAudience,
          campaignStatus:
            data.campaignStatus || selectedCampaign.campaignStatus,
        },
      });

      if (result?.error) {
        showSnackBar?.({
          message:
            result.error.response?.data.message ?? "Um erro inesperado ocorreu",
          type: SnackbarType.ERROR,
        });
      } else if (result.data) {
        showSnackBar?.({
          message: "Campanha atualizada com sucesso",
          type: SnackbarType.SUCCESS,
        });
        setFormDisabled(true);
      }
    }
  };

  const hanldeSubmit = (
    data: Omit<RegisterCampaignDto | UpdateCampaignDataDto, "target">
  ) => {
    if (selectedCampaign) {
      handleUpdate(data as UpdateCampaignDataDto);
    } else {
      handleRegister(data as RegisterCampaignDto);
    }
  };

  const handleEnableForm = () => {
    setTimeout(() => {
      setFormDisabled(false);
    }, 200);
  };

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        my="3.2rem"
      >
        <Box display="flex" alignItems="center" gap="1rem">
          <IconButton
            aria-label="voltar"
            size="small"
            onClick={() => router.back()}
          >
            <IconKeyboardBackspace sx={{ width: "3rem", height: "3rem" }} />
          </IconButton>
          <Text {...typography.title.h3l}>Nova campanha</Text>
        </Box>
        <Box display="flex" gap="1.6rem">
          {selectedCampaign && !formDisabled && (
            <Button variant="outlined" onClick={() => setFormDisabled(true)}>
              Cancelar
            </Button>
          )}
          {selectedCampaign && formDisabled ? (
            <>
              <Button
                type="button"
                variant="outlined"
                onClick={handleEnableForm}
              >
                Editar
              </Button>
              <Button type="button" onClick={() => getGeneralReportRefetch()}>
                Gerar relatório
              </Button>
            </>
          ) : (
            <Button type="submit" form={FORM_ID}>
              Salvar
            </Button>
          )}
        </Box>
      </Box>
      <Box>
        <CampaignForm
          formId={FORM_ID}
          data={selectedCampaign}
          disabled={formDisabled}
          onSubmit={hanldeSubmit}
        />
      </Box>
      <Box mt="2.4rem">
        <CampaignTargetAudience
          targetAudience={targetAudience}
          disabled={formDisabled}
          onSubmit={setTargetAudience}
          onExportData={getCampaignTargetAudienceReportRefetch}
        />
      </Box>
    </Container>
  );
};

export default NewCampaigns;
