import { PatientEntity } from "@/domain/entities/patient";
import { Box, Grid2 } from "@mui/material";
import { ContentCopy as IconContentCopy } from "@mui/icons-material";
import { Button, FileUpload, Select, Text } from "@/components/common";
import typography from "@/shared/theme/typography-theme";
import { vaccinationConsentStatusList } from "@/shared/lists";
import {
  PageEnum,
  SegmentEnum,
  VaccinationConsentStatusEnum,
} from "@/domain/consts";
import theme from "@/shared/theme/material-theme";
import { useAuthUser, useFile, useSnackbar } from "@/hooks";
import { SnackbarType } from "@/contexts/SnackbarContext";
import { useMemo } from "react";
import { cpfMask, phoneMask } from "@/shared/mask";

export type ResponsibleSectionProps = {
  patient: PatientEntity;
  segment: SegmentEnum;
  selectedConsentStatus?: VaccinationConsentStatusEnum;
  onChangeSelectedConsentStatus?: (value: VaccinationConsentStatusEnum) => void;
  selectedFile?: File;
  onChangeSelectedFile?: (value?: File) => void;
};

const ResponsibleSection: React.FC<ResponsibleSectionProps> = ({
  patient,
  segment,
  selectedConsentStatus,
  onChangeSelectedConsentStatus,
  selectedFile,
  onChangeSelectedFile,
}) => {
  const { showSnackBar } = useSnackbar();
  const { authUser } = useAuthUser();

  const handleConsentCopy = () => {
    const { protocol, host } = window.location;
    navigator.clipboard.writeText(
      `${protocol}//${host}${PageEnum.NOT_CONSENT_TERMS}/${patient.patientPecId}?cityHall=${authUser?.cityHall.coIbge}`
    );

    showSnackBar?.({
      message: "Link copiado!",
      type: SnackbarType.SUCCESS,
    });
  };

  const currentPatientFile = useMemo(
    () => patient.consents.find((item) => item.segment.id === segment),
    [patient, segment]
  )?.consentFile;

  const { privateFileUrl } = useFile({
    getPrivateUrlOptions: {
      enabled: Boolean(currentPatientFile?.name),
      params: currentPatientFile?.name || "",
    },
  });

  const fileValueProps = useMemo(() => {
    if (!selectedFile && !currentPatientFile) {
      return undefined;
    }

    return {
      name: selectedFile?.name ?? currentPatientFile?.customName ?? "",
      size: selectedFile?.size,
      url: privateFileUrl?.url,
      file: selectedFile,
    };
  }, [selectedFile, currentPatientFile, privateFileUrl]);

  return (
    <Box>
      <Box mb="3.6rem">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb="3.6rem"
        >
          <Text {...typography.title.h3l}>Consentimento</Text>
          <div>
            <Button
              variant="outlined"
              size="medium"
              startIcon={<IconContentCopy />}
              onClick={handleConsentCopy}
            >
              copiar link do consentimento
            </Button>
          </div>
        </Box>
        <Box display="flex" gap="4rem">
          <Box width="19rem" maxWidth="100%">
            <Text {...typography.paragraph.l1} mb="1rem">
              Status do consentimento
            </Text>
            <Select
              value={selectedConsentStatus}
              label="Status"
              options={vaccinationConsentStatusList}
              disabled={!Boolean(selectedFile || currentPatientFile)}
              onChange={(item) =>
                onChangeSelectedConsentStatus?.(
                  item.target.value as VaccinationConsentStatusEnum
                )
              }
            />
          </Box>
          <Box width="0.1rem" bgcolor={theme.palette.grey[200]} />
          <Box flex={1}>
            <Text {...typography.paragraph.l1} mb="1rem">
              Upload do consentimento
            </Text>
            <FileUpload
              value={fileValueProps}
              types={["svg", "png", "jpg", "jpeg", "gif"]}
              maxSize={3}
              onChange={onChangeSelectedFile}
              onDelete={() => onChangeSelectedFile?.(undefined)}
            />
          </Box>
        </Box>
      </Box>
      <Box>
        <Text {...typography.title.h3l} mb="3.6rem">
          Responsável
        </Text>
        <Grid2 container rowGap="2.4rem">
          <Grid2 size={{ xs: 4 }}>
            <Text {...typography.paragraph.l1} mb="0.4rem">
              Nome do responsável
            </Text>
            <Text {...typography.title.h3l}>
              {patient.responsibleName || "--"}
            </Text>
          </Grid2>
          <Grid2 size={{ xs: 4 }}>
            <Text {...typography.paragraph.l1} mb="0.4rem">
              CPF
            </Text>
            <Text {...typography.title.h3l}>
              {patient.responsibleDocument
                ? cpfMask(patient.responsibleDocument)
                : "--"}
            </Text>
          </Grid2>
          <Grid2 size={{ xs: 4 }}>
            <Text {...typography.paragraph.l1} mb="0.4rem">
              Telefone
            </Text>
            <Text {...typography.title.h3l}>{phoneMask(patient.phone)}</Text>
          </Grid2>
          <Grid2 size={{ xs: 4 }}>
            <Text {...typography.paragraph.l1} mb="0.4rem">
              Cidade
            </Text>
            <Text {...typography.title.h3l}>
              {/* {patient.user.addresses[0]?.city || "--"} */}
              {"--"}
            </Text>
          </Grid2>
          <Grid2 size={{ xs: 4 }}>
            <Text {...typography.paragraph.l1} mb="0.4rem">
              Bairro
            </Text>
            <Text {...typography.title.h3l}>
              {/* {patient.user.addresses[0]?.address2 || "--"} */}
              {"--"}
            </Text>
          </Grid2>
          <Grid2 size={{ xs: 4 }}>
            <Text {...typography.paragraph.l1} mb="0.4rem">
              Endereço
            </Text>
            <Text {...typography.title.h3l}>
              {/* {patient.user.addresses[0]?.address || "--"} */}
              {"--"}
            </Text>
          </Grid2>
          <Grid2 size={{ xs: 4 }}>
            <Text {...typography.paragraph.l1} mb="0.4rem">
              Número
            </Text>
            <Text {...typography.title.h3l}>
              {/* {patient.user.addresses[0]?.number || "--"} */}
              {"--"}
            </Text>
          </Grid2>
          <Grid2 size={{ xs: 4 }}>
            <Text {...typography.paragraph.l1} mb="0.4rem">
              CEP
            </Text>
            <Text {...typography.title.h3l}>
              {/* {patient.user.addresses[0]
                ? zipcodeMask(patient.user.addresses[0].zipCode)
                : "--"} */}
              {"--"}
            </Text>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default ResponsibleSection;
