"use client";

import {
  ImmunobiolocalsEnum,
  SegmentEnum,
  VaccinationConsentStatusEnum,
} from "@/domain/consts";
import { usePatient, useSnackbar, useTag } from "@/hooks";
import { Box, IconButton, Tab, Tabs } from "@mui/material";
import {
  Diversity3 as Diversity3Icon,
  VaccinesOutlined as VaccinesOutlinedIcon,
  Block as BlockIcon,
  Download as DownloadIcon,
  KeyboardBackspace as IconKeyboardBackspace,
} from "@mui/icons-material";
import { useMemo, useState } from "react";
import { Button, GenderComparator, Text } from "@/components/common";
import AcsByVaccinationRanking from "../AcsByVaccinationRanking";
import { UnitByVaccinationRankingEntity } from "@/domain/entities/unit";
import { AcsByVaccinationRankingEntity } from "@/domain/entities/acs";
import typography from "@/shared/theme/typography-theme";
import { TablePatients } from "@/components/Tables";
import { PatientEntity, UpdatePatientDataDto } from "@/domain/entities/patient";
import PatientDetails from "../PatientDetails";
import { convertToBase64 } from "@/shared/file";
import { SnackbarType } from "@/contexts/SnackbarContext";

const MIN_DATE = `${new Date().getFullYear() - 14}-01-01`;
const MAX_DATE = `${new Date().getFullYear() - 9}-12-31`;

const FORM_ID = "form-patient-details-ranking";

enum tabsId {
  VACCINATED = 0,
  NOT_VACCINATED = 1,
}

export type VaccinationRankingDetailsProps = {
  unitRanking?: UnitByVaccinationRankingEntity;
  acsRanking?: AcsByVaccinationRankingEntity;
  onBack?: () => void;
};

const VaccinationRankingDetails: React.FC<VaccinationRankingDetailsProps> = ({
  unitRanking,
  acsRanking,
  onBack,
}) => {
  const [selectedTab, setSelectedTab] = useState(tabsId.VACCINATED);
  const [vaccinatedPagination, setVaccinatedPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [notVaccinatedPagination, setNotVaccinatedPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [selectedAcs, setSelectedAcs] = useState<
    AcsByVaccinationRankingEntity | undefined
  >(acsRanking);
  const [selectedAcsFilter, setSelectedAcsFilter] = useState<
    string | undefined
  >();
  const [selectedPatientForDetails, setSelectedPatientForDetails] =
    useState<PatientEntity>();

  const {
    vaccinatedPatients,
    vaccinatedPatientsMeta,
    vaccinatedPatientsLoading,
    notVaccinatedPatientsData,
    notVaccinatedPatientsMeta,
    notVaccinatedPatientsLoading,
    vaccinationChart,
    vaccinationChartLoading,
    vaccinatedPatientsRefetch,
    notVaccinatedPatientsRefetch,
    updatePatient,
    patientsReportRefetch,
    patientsReportLoading,
  } = usePatient("vaccination-ranking-details", {
    getVaccinatedPatientsOptions: {
      params: {
        ...vaccinatedPagination,
        immunobiologicalIds: ImmunobiolocalsEnum.HPV,
        segmentsIds: SegmentEnum.HPV,
        acs: selectedAcs?.id,
        beginAgeDate: MIN_DATE,
        endAgeDate: MAX_DATE,
      },
      enabled: Boolean(selectedAcs) && selectedTab === tabsId.VACCINATED,
    },
    getNotVaccinatedPatientsOptions: {
      params: {
        ...notVaccinatedPagination,
        immunobiologicalIds: ImmunobiolocalsEnum.HPV,
        segmentsIds: SegmentEnum.HPV,
        acs: selectedAcs?.id,
        beginAgeDate: MIN_DATE,
        endAgeDate: MAX_DATE,
      },
      enabled: Boolean(selectedAcs) && selectedTab === tabsId.NOT_VACCINATED,
    },
    getVaccinationChartOptions: {
      enabled: true,
      params: {
        immunobiologicalIds: ImmunobiolocalsEnum.HPV,
        segmentsIds: SegmentEnum.HPV,
        beginAgeDate: MIN_DATE,
        endAgeDate: MAX_DATE,
        acs: selectedAcs?.id ?? selectedAcsFilter,
        units: selectedAcs?.id ? undefined : unitRanking?.id,
      },
    },
    getPatientsReportOptions: {
      params: {
        segmentsIds: SegmentEnum.HPV,
        vaccinated: selectedTab === tabsId.VACCINATED,
        immunobiologicalIds: ImmunobiolocalsEnum.HPV,
        beginAgeDate: MIN_DATE,
        endAgeDate: MAX_DATE,
        acs: selectedAcs?.id,
      },
    },
  });

  const { showSnackBar } = useSnackbar();

  const { tagsRefetch } = useTag();

  const genderComparatorData = useMemo(
    () => [
      {
        title: "Total de Jovens",
        icon: Diversity3Icon,
        total: vaccinationChart?.total ?? 0,
        totalFemale: vaccinationChart?.totalFemale ?? 0,
        totalMale: vaccinationChart?.totalMale ?? 0,
        generalTotalFemale: vaccinationChart?.total ?? 0,
        generalTotalMale: vaccinationChart?.total ?? 0,
      },
      {
        title: "Total Vacinados",
        icon: VaccinesOutlinedIcon,
        total: vaccinationChart?.totalVaccinated ?? 0,
        totalFemale: vaccinationChart?.totalFemaleVaccinated ?? 0,
        totalMale: vaccinationChart?.totalMaleVaccinated ?? 0,
        generalTotal: vaccinationChart?.total ?? 0,
        generalTotalFemale: vaccinationChart?.totalFemale ?? 0,
        generalTotalMale: vaccinationChart?.totalMale ?? 0,
      },
      {
        title: "Total Não Vacinados",
        icon: BlockIcon,
        total: vaccinationChart?.totalNotVaccinated ?? 0,
        totalFemale: vaccinationChart?.totalFemaleNotVaccinated ?? 0,
        totalMale: vaccinationChart?.totalMaleNotVaccinated ?? 0,
        generalTotal: vaccinationChart?.total ?? 0,
        generalTotalFemale: vaccinationChart?.totalFemale ?? 0,
        generalTotalMale: vaccinationChart?.totalMale ?? 0,
      },
    ],
    [vaccinationChart]
  );

  const handleUpdatePatient = async (data: {
    consentId?: string;
    consentStatus: VaccinationConsentStatusEnum;
    tags: string[];
    file?: File;
  }) => {
    if (selectedPatientForDetails) {
      const body: UpdatePatientDataDto = {
        patientPecId: selectedPatientForDetails.patientPecId,
        segmentId: SegmentEnum.HPV,
        consentStatus: data.consentStatus,
        tags: data.tags,
      };

      if (data.file) {
        body.consentFile = await convertToBase64(data.file);
      }

      const result = await updatePatient({
        data: body,
      });

      if (result?.error) {
        showSnackBar?.({
          message:
            result.error.response?.data.message ?? "Um erro inesperado ocorreu",
          type: SnackbarType.ERROR,
        });
      } else if (result.data) {
        tagsRefetch();
        vaccinatedPatientsRefetch();
        notVaccinatedPatientsRefetch();
        setSelectedPatientForDetails(undefined);
        showSnackBar?.({
          message: "Dados atualizado com sucesso",
          type: SnackbarType.SUCCESS,
        });
        handleBack();
      }
    }
  };

  const handleBack = () => {
    if (selectedPatientForDetails) {
      setSelectedPatientForDetails(undefined);
      return;
    }
    if (unitRanking && selectedAcs) {
      setSelectedAcs(undefined);
      return;
    }

    onBack?.();
  };

  return (
    <Box>
      <Box display="flex" gap="1.2rem" mb="2.4rem">
        <IconButton aria-label="voltar" size="small" onClick={handleBack}>
          <IconKeyboardBackspace sx={{ width: "3rem", height: "3rem" }} />
        </IconButton>
        <Text {...typography.title.h2l}>
          {selectedAcs ? "Paciente" : "ACS Ranking"}
        </Text>
      </Box>
      {selectedPatientForDetails ? (
        <Box position="relative">
          <PatientDetails
            patient={selectedPatientForDetails}
            formId={FORM_ID}
            segment={SegmentEnum.HPV}
            onSubmit={handleUpdatePatient}
          />
          <Box
            display="flex"
            justifyContent="flex-end"
            position="sticky"
            bottom={0}
          >
            <Button type="submit" form={FORM_ID} variant="contained">
              Salvar
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          {selectedAcs ? (
            <Box display="flex" my="2.4rem">
              <Box flex={1}>
                <Text {...typography.paragraph.l1} mb="0.4rem">
                  ACS
                </Text>
                <Text {...typography.title.h3l}>{selectedAcs?.name}</Text>
              </Box>
              <Box flex={1}>
                <Text {...typography.paragraph.l1} mb="0.4rem">
                  ACS Ranking
                </Text>
                <Text {...typography.title.h3l}>{selectedAcs?.position}</Text>
              </Box>
            </Box>
          ) : (
            <Box display="flex" my="2.4rem">
              <Box flex={1}>
                <Text {...typography.paragraph.l1} mb="0.4rem">
                  UBS
                </Text>
                <Text {...typography.title.h3l}>{unitRanking?.name}</Text>
              </Box>
              <Box flex={1}>
                <Text {...typography.paragraph.l1} mb="0.4rem">
                  Ranking vacinação
                </Text>
                <Text {...typography.title.h3l}>{unitRanking?.position}</Text>
              </Box>
            </Box>
          )}
          <Box display="flex" gap="1.8rem" mt="1.2rem">
            {genderComparatorData.map((item) => (
              <Box flex={1} key={item.title}>
                <GenderComparator
                  title={item.title}
                  titleIcon={
                    <item.icon
                      color="primary"
                      sx={{ width: "1.8rem", height: "1.8rem" }}
                    />
                  }
                  total={item.total}
                  totalFemale={item.totalFemale}
                  totalMale={item.totalMale}
                  generalTotalFemale={item.generalTotalFemale}
                  generalTotalMale={item.generalTotalMale}
                  loading={vaccinationChartLoading}
                />
              </Box>
            ))}
          </Box>
          <Box
            display="flex"
            justifyContent={selectedAcs ? "space-between" : "flex-end"}
            my="2.4rem"
          >
            {selectedAcs && (
              <Box flex={1}>
                <Tabs
                  value={selectedTab}
                  onChange={(_, index) => setSelectedTab(index)}
                  aria-label="basic tabs example"
                >
                  <Tab label="Vacinados" value={tabsId.VACCINATED} />
                  <Tab label="Não vacinados" value={tabsId.NOT_VACCINATED} />
                </Tabs>
              </Box>
            )}
            {selectedAcs && (
              <Box height="3.6rem">
                <Button
                  variant="outlined"
                  startIcon={
                    <DownloadIcon sx={{ width: "2rem", height: "2rem" }} />
                  }
                  disabled={patientsReportLoading}
                  loading={patientsReportLoading}
                  onClick={() => patientsReportRefetch()}
                >
                  Exportar lista
                </Button>
              </Box>
            )}
          </Box>
          {selectedAcs ? (
            <Box>
              {selectedTab === tabsId.VACCINATED && (
                <TablePatients
                  data={vaccinatedPatients}
                  segment={SegmentEnum.HPV}
                  pagination={{
                    count: vaccinatedPatientsMeta?.totalItems ?? 0,
                    rowsPerPageOptions: [10, 25, 50],
                    rowsPerPage: vaccinatedPagination.pageSize,
                    page: vaccinatedPagination.page,
                    onPageChange: (value) =>
                      setVaccinatedPagination((v) => ({ ...v, page: value })),
                    onRowsPerPageChange: (value) =>
                      setVaccinatedPagination((v) => ({
                        ...v,
                        pageSize: value,
                      })),
                  }}
                  loading={vaccinatedPatientsLoading}
                  onClick={(item) => setSelectedPatientForDetails(item)}
                />
              )}
              {selectedTab === tabsId.NOT_VACCINATED && (
                <TablePatients
                  data={notVaccinatedPatientsData}
                  segment={SegmentEnum.HPV}
                  pagination={{
                    count: notVaccinatedPatientsMeta?.totalItems ?? 0,
                    rowsPerPageOptions: [10, 25, 50],
                    rowsPerPage: notVaccinatedPagination.pageSize,
                    page: notVaccinatedPagination.page,
                    onPageChange: (value) =>
                      setNotVaccinatedPagination((v) => ({
                        ...v,
                        page: value,
                      })),
                    onRowsPerPageChange: (value) =>
                      setNotVaccinatedPagination((v) => ({
                        ...v,
                        pageSize: value,
                      })),
                  }}
                  loading={notVaccinatedPatientsLoading}
                  onClick={(item) => setSelectedPatientForDetails(item)}
                />
              )}
            </Box>
          ) : (
            <Box>
              <AcsByVaccinationRanking
                unitId={unitRanking?.id}
                onSelectAcs={(item) => setSelectedAcs(item)}
                onFilterChange={(acsId) => setSelectedAcsFilter(acsId)}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default VaccinationRankingDetails;
