"use client";

import { Button, InputDate, Select, Text } from "@/components/common";
import { Dialog } from "@/components/dialogs";
import { CampaignStatusChangeForm } from "@/components/Forms";
import { TableCampaign } from "@/components/Tables";
import { SnackbarType } from "@/contexts/SnackbarContext";
import { CampaignStatusEnum, PageEnum } from "@/domain/consts";
import { CampaignEntity, GetCampaignsDto } from "@/domain/entities/campaign";
import { useSnackbar } from "@/hooks";
import useCampaign from "@/hooks/useCampaign";
import typography from "@/shared/theme/typography-theme";
import { Box, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dateUtils from "@/shared/date";
import { campaignStatusList } from "@/shared/lists";

const FORM_UPDATE_STATUS_ID = "form-campaign-update-status";

const Campaigns = () => {
  const router = useRouter();

  const [filter, setFilter] = useState<{
    publicationDate: string;
    createdAt: string;
    campaignStatus: CampaignStatusEnum[];
  }>({
    publicationDate: "",
    createdAt: "",
    campaignStatus: [],
  });
  const [selectedFilters, setSelectedFilters] = useState<GetCampaignsDto>({});

  const {
    campaigns,
    campaignsDataRefetch,
    updateCampaign,
    updateCampaignLoading,
  } = useCampaign({
    getCampaignsOptions: {
      enabled: true,
      params: selectedFilters,
    },
  });

  const { showSnackBar } = useSnackbar();

  const [showForm, setShowForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignEntity>();

  const handleOpenUpdateStatusForm = (data: CampaignEntity) => {
    setSelectedCampaign(data);
    setShowForm(true);
  };

  const handleUpdateStatus = async (status: CampaignStatusEnum) => {
    if (selectedCampaign) {
      const result = await updateCampaign({
        id: selectedCampaign.id,
        data: {
          title: selectedCampaign.title,
          description: selectedCampaign.description,
          message: selectedCampaign.message,
          campaignTargetId: selectedCampaign.campaignTarget.id,
          publicationDate: selectedCampaign.publicationDate,
          campaignStatus: status,
          target: {
            patientName: selectedCampaign.campaignTarget.patientName,
            unitId: selectedCampaign.campaignTarget.unit?.id,
            segmentId: selectedCampaign.campaignTarget.segment?.id,
            tags: selectedCampaign.campaignTarget.tags.map(
              (item) => item.tag.id
            ),
            ageGroup: selectedCampaign.campaignTarget.ageGroup,
          },
        },
      });

      if (result?.error) {
        showSnackBar?.({
          message:
            result.error.response?.data.message ?? "Um erro inesperado ocorreu",
          type: SnackbarType.ERROR,
        });
      } else if (result.data) {
        campaignsDataRefetch();
        handleCloseForm();
        showSnackBar?.({
          message: "Campanha atualizada com sucesso",
          type: SnackbarType.SUCCESS,
        });
      }
    }
  };

  const handleCloseForm = () => {
    setSelectedCampaign(undefined);
    setShowForm(false);
  };

  const handleSubmitFilter = () => {
    setSelectedFilters({
      publicationDate: filter.publicationDate,
      createdAt: filter.createdAt,
      campaignStatus: filter.campaignStatus.join("|"),
    });
  };

  return (
    <Container>
      <Text {...typography.title.h1l}>Navegador virtual de campanhas</Text>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt="3.2rem"
      >
        <Text {...typography.title.h3l}>Campanhas criadas</Text>
        <div>
          <Button onClick={() => router.push(PageEnum.NEW_CAMPAIGNS)}>
            Nova campanha
          </Button>
        </div>
      </Box>
      <Box display="flex" gap="1.3rem" mt="6rem" mb="3rem">
        <Box maxWidth="20rem" width="100%">
          <Select
            value={filter.campaignStatus}
            label="Status da campanha"
            options={campaignStatusList}
            multiple
            size="small"
            onChange={(e) =>
              setFilter({
                ...filter,
                campaignStatus: e.target.value as CampaignStatusEnum[],
              })
            }
          />
        </Box>
        <Box maxWidth="20rem" width="100%">
          <InputDate
            value={filter.createdAt ? dateUtils(filter.createdAt) : null}
            fullWidth
            size="small"
            label="Data inicio"
            onChange={(value) =>
              setFilter({
                ...filter,
                createdAt: value?.format("YYYY-MM-DD") ?? "",
              })
            }
          />
        </Box>
        <Box maxWidth="20rem" width="100%">
          <InputDate
            value={
              filter.publicationDate ? dateUtils(filter.publicationDate) : null
            }
            fullWidth
            size="small"
            label="Data fim"
            onChange={(value) =>
              setFilter({
                ...filter,
                publicationDate: value?.format("YYYY-MM-DD") ?? "",
              })
            }
          />
        </Box>
        <Button variant="contained" onClick={handleSubmitFilter}>
          Filtrar
        </Button>
      </Box>
      <Box mt="3.2rem">
        <TableCampaign
          data={campaigns}
          onStatusChange={handleOpenUpdateStatusForm}
          onClick={(data) =>
            router.push(`${PageEnum.NEW_CAMPAIGNS}?id=${data.id}`)
          }
        />
      </Box>
      <Dialog
        open={showForm}
        title="Alterar Status"
        doneText="salvar"
        persist
        formId={FORM_UPDATE_STATUS_ID}
        actions
        isCancelDisabled={updateCampaignLoading}
        isDoneDisabled={updateCampaignLoading}
        isDoneLoading={updateCampaignLoading}
        onClose={handleCloseForm}
        onCancel={handleCloseForm}
      >
        <Box minWidth="96rem" maxWidth="100%">
          <CampaignStatusChangeForm
            formId={FORM_UPDATE_STATUS_ID}
            onSubmit={handleUpdateStatus}
          />
        </Box>
      </Dialog>
    </Container>
  );
};

export default Campaigns;
