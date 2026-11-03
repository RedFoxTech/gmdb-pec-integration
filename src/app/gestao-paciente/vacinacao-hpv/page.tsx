"use client";

import { Box, Container, Tab, Tabs, TextField } from "@mui/material";
import {
  Autocomplete,
  Button,
  GenderComparator,
  // InputDate,
  Select,
  Text,
} from "@/components/common";
// import dayjs from "dayjs";
import typography from "@/shared/theme/typography-theme";
import {
  Diversity3 as Diversity3Icon,
  VaccinesOutlined as VaccinesOutlinedIcon,
  Block as BlockIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { useMemo, useState } from "react";
import { TablePatients } from "@/components/Tables";
import {
  GetPatientsDto,
  PatientEntity,
  UpdatePatientDataDto,
} from "@/domain/entities/patient";
import {
  hpvVaccinationAgeRangeList,
  vaccinationConsentStatusList,
} from "@/shared/lists";
import {
  ImmunobiolocalsEnum,
  SegmentEnum,
  VaccinationConsentStatusEnum,
} from "@/domain/consts";
import { useAcs, usePatient, useSnackbar, useTag, useUnit } from "@/hooks";
import { SelectOption } from "@/domain/entities/common";
import { Dialog } from "@/components/dialogs";
import {
  AcsByVaccinationRanking,
  PatientDetails,
  UnitsByVaccinationRanking,
  VaccinationRankingDetails,
} from "@/components/sections";
import { SnackbarType } from "@/contexts/SnackbarContext";
import { convertToBase64 } from "@/shared/file";
import { getDateRangeByAgeRange } from "@/shared/stringUtils";
import { UnitByVaccinationRankingEntity } from "@/domain/entities/unit";
import { AcsByVaccinationRankingEntity } from "@/domain/entities/acs";

enum tabsId {
  VACCINATED = 0,
  NOT_VACCINATED = 1,
  UNIT_RANKING = 2,
  ACS_RANKING = 3,
}

const FORM_ID = "form-patient-details";

const MIN_DATE = `${new Date().getFullYear() - 14}-01-01`;
const MAX_DATE = `${new Date().getFullYear() - 9}-12-31`;

const HpvVaccination = () => {
  const [selectedTab, setSelectedTab] = useState(tabsId.VACCINATED);
  const [selectedPatients, setSelectedPatients] = useState<PatientEntity[]>([]);
  const [selectedPatientForDetails, setSelectedPatientForDetails] =
    useState<PatientEntity>();
  const [selectedUnit, setSelectedUnit] =
    useState<UnitByVaccinationRankingEntity>();
  const [selectedAcs, setSelectedAcs] =
    useState<AcsByVaccinationRankingEntity>();

  const [vaccinatedPagination, setVaccinatedPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [notVaccinatedPagination, setNotVaccinatedPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  // function getYearRange(year?: number) {
  //   if (!year)
  //     return {
  //       beginVaccinationDate: undefined,
  //       endVaccinationDate: undefined,
  //     };
  //   const firstDay = new Date(year, 0, 1);

  //   const lastDay = new Date(year, 11, 31);

  //   return {
  //     beginVaccinationDate: firstDay.toISOString().slice(0, 10),
  //     endVaccinationDate: lastDay.toISOString().slice(0, 10),
  //   };
  // }

  // const defaultVaccinationDate = getYearRange(new Date().getFullYear());

  const [filter, setFilter] = useState<{
    patientName: string;
    unit: string[];
    acs: string[];
    age: number[];

    consentStatus: VaccinationConsentStatusEnum[];
    beginVaccinationDate?: string;
    endVaccinationDate?: string;
  }>({
    patientName: "",
    unit: [],
    acs: [],
    age: [],
    consentStatus: [],
    // ...defaultVaccinationDate,
  });

  const [selectedFilters, setSelectedFilters] = useState<GetPatientsDto>({
    immunobiologicalIds: ImmunobiolocalsEnum.HPV,
    beginAgeDate: MIN_DATE,
    endAgeDate: MAX_DATE,
    // ...defaultVaccinationDate,
  });

  const {
    vaccinatedPatients,
    vaccinatedPatientsMeta,
    vaccinatedPatientsLoading,
    notVaccinatedPatientsData,
    notVaccinatedPatientsMeta,
    notVaccinatedPatientsLoading,
    vaccinationChart,
    vaccinationChartLoading,
    updatePatient,
    updatePatientLoading,
    vaccinatedPatientsRefetch,
    notVaccinatedPatientsRefetch,
    patientsReportRefetch,
    patientsReportLoading,
  } = usePatient("hpv-vaccination", {
    getVaccinatedPatientsOptions: {
      params: {
        segmentsIds: SegmentEnum.HPV,
        ...selectedFilters,
        ...vaccinatedPagination,
      },
      enabled: selectedTab === tabsId.VACCINATED,
    },
    getNotVaccinatedPatientsOptions: {
      params: {
        segmentsIds: SegmentEnum.HPV,
        ...selectedFilters,
        ...notVaccinatedPagination,
      },
      enabled: selectedTab === tabsId.NOT_VACCINATED,
    },
    getVaccinationChartOptions: {
      enabled: true,
      params: {
        immunobiologicalIds: ImmunobiolocalsEnum.HPV,
        segmentsIds: SegmentEnum.HPV,
        beginAgeDate: selectedFilters.beginAgeDate,
        endAgeDate: selectedFilters.endAgeDate,
        patientName: selectedFilters.patientName,
        consentStatus: selectedFilters.consentStatus,
        units: selectedFilters.units,
        acs: selectedFilters.acs,
        // beginVaccinationDate: selectedFilters.beginVaccinationDate,
        // endVaccinationDate: selectedFilters.endVaccinationDate,
      },
    },
    getPatientsReportOptions: {
      params: {
        segmentsIds: SegmentEnum.HPV,
        vaccinated: selectedTab === tabsId.VACCINATED,
        ...selectedFilters,
      },
    },
  });

  const { units } = useUnit("hpv-vaccination", {
    getUnitsOptions: {
      enabled: true,
    },
  });

  const { acsList } = useAcs("hpv-vaccination", {
    getAcsListOptions: {
      enabled: true,
      params: {
        units: selectedFilters.units,
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
    [vaccinationChart],
  );

  const unitOptios: SelectOption[] = useMemo(() => {
    const options = units.map((item) => ({
      value: item.id,
      label: `${item.name} - ${item.address ?? ""}, ${
        item.addressNumber ?? ""
      }`,
    }));

    return [{ value: "null", label: "UBS Não Identificada" }, ...options];
  }, [units]);

  const acsOptios: SelectOption[] = useMemo(() => {
    const options = acsList.map((item) => ({
      value: item.id,
      label: item.name,
    }));

    return [{ value: "null", label: "ACS Não Identificada" }, ...options];
  }, [acsList]);

  const handleSubmitFilter = () => {
    const dateFilter =
      filter.age.length > 0
        ? getDateRangeByAgeRange(filter.age)
        : {
            begin: MIN_DATE,
            end: MAX_DATE,
          };

    setSelectedFilters({
      immunobiologicalIds: ImmunobiolocalsEnum.HPV,
      units: filter.unit.join("|"),
      consentStatus: filter.consentStatus.join("|"),
      beginAgeDate: dateFilter.begin,
      endAgeDate: dateFilter.end,
      acs: filter.acs.join("|"),

      patientName: filter.patientName,
      // endVaccinationDate: filter.endVaccinationDate,
      // beginVaccinationDate: filter.beginVaccinationDate,
    });
  };

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
      }
    }
  };

  const handleCloseRankingInfo = () => {
    setSelectedAcs(undefined);
    setSelectedUnit(undefined);
  };

  const handleChangeTab = (tab: tabsId) => {
    if (
      !(
        (selectedTab === tabsId.VACCINATED && tab === tabsId.NOT_VACCINATED) ||
        (selectedTab === tabsId.NOT_VACCINATED && tab === tabsId.VACCINATED)
      )
    ) {
      setSelectedFilters({
        immunobiologicalIds: ImmunobiolocalsEnum.HPV,
        beginAgeDate: MIN_DATE,
        endAgeDate: MAX_DATE,
      });
    }
    setSelectedTab(tab);
  };

  return (
    <Container>
      <Text {...typography.title.h1l} py="1.6rem">
        Gestão do paciente - Vacinação HPV
      </Text>
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
      <Box mt="2.4rem">
        <Box display="flex" alignItems="center">
          <Box flex={1}>
            <Tabs
              value={selectedTab}
              onChange={(_, index) => handleChangeTab(index)}
              aria-label="basic tabs example"
            >
              <Tab label="Vacinados" value={tabsId.VACCINATED} />
              <Tab label="Não vacinados" value={tabsId.NOT_VACCINATED} />
              <Tab label="UBS ranking " value={tabsId.UNIT_RANKING} />
              <Tab label="ACS ranking " value={tabsId.ACS_RANKING} />
            </Tabs>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            my="2.4rem"
            height="3.6rem"
          >
            {(selectedTab === tabsId.VACCINATED ||
              selectedTab === tabsId.NOT_VACCINATED) && (
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
            )}
          </Box>
        </Box>
        <Box mt="1.6rem">
          {(selectedTab === tabsId.VACCINATED ||
            selectedTab === tabsId.NOT_VACCINATED) && (
            <Box display="flex" gap="1.3rem" mb="1.6rem">
              <Box flex={1}>
                <TextField
                  label="Nome do paciente"
                  value={filter.patientName}
                  size="small"
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      patientName: e.target.value,
                    })
                  }
                />
              </Box>
              <Box flex={1}>
                <Autocomplete
                  value={unitOptios.filter((item) =>
                    filter.unit.includes(item.value as string),
                  )}
                  label="UBS"
                  options={unitOptios}
                  multiple
                  size="small"
                  onChange={(_, value) =>
                    setFilter({
                      ...filter,
                      unit: value.map((item) => item.value as string),
                    })
                  }
                />
              </Box>
              <Box flex={1}>
                <Autocomplete
                  value={acsOptios.filter((item) =>
                    filter.acs.includes(item.value as string),
                  )}
                  label="ACS"
                  options={acsOptios}
                  multiple
                  size="small"
                  onChange={(_, value) =>
                    setFilter({
                      ...filter,
                      acs: value.map((item) => item.value as string),
                    })
                  }
                />
              </Box>
              <Box flex={1}>
                <Select
                  value={filter.age}
                  label="Faixa etária"
                  options={hpvVaccinationAgeRangeList}
                  multiple
                  size="small"
                  onChange={(item) =>
                    setFilter({
                      ...filter,
                      age: item.target.value as number[],
                    })
                  }
                />
              </Box>
              {/*<Box flex={1}>
                <InputDate
                  value={
                    filter.beginVaccinationDate
                      ? dayjs(filter.beginVaccinationDate)
                      : null
                  }
                  label="Ano de vacinação"
                  views={["year"]}
                  size="small"
                  maxDate={dayjs()}
                  onChange={(date) => {
                    setFilter({
                      ...filter,
                      ...getYearRange(date?.year()),
                    });
                  }}
                />
              </Box>*/}
              <Box flex={1}>
                <Select
                  value={filter.consentStatus}
                  label="Status Consentimento"
                  options={vaccinationConsentStatusList}
                  multiple
                  size="small"
                  onChange={(item) =>
                    setFilter({
                      ...filter,
                      consentStatus: item.target
                        .value as VaccinationConsentStatusEnum[],
                    })
                  }
                />
              </Box>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSubmitFilter}
              >
                Filtrar
              </Button>
            </Box>
          )}
          {selectedTab === tabsId.VACCINATED && (
            <TablePatients
              data={vaccinatedPatients}
              segment={SegmentEnum.HPV}
              selectedPatients={selectedPatients}
              onSelect={setSelectedPatients}
              pagination={{
                count: vaccinatedPatientsMeta?.totalItems ?? 0,
                rowsPerPageOptions: [10, 25, 50],
                rowsPerPage: vaccinatedPagination.pageSize,
                page: vaccinatedPagination.page,
                onPageChange: (value) =>
                  setVaccinatedPagination((v) => ({ ...v, page: value })),
                onRowsPerPageChange: (value) =>
                  setVaccinatedPagination((v) => ({ ...v, pageSize: value })),
              }}
              loading={vaccinatedPatientsLoading}
              onClick={(item) => setSelectedPatientForDetails(item)}
            />
          )}
          {selectedTab === tabsId.NOT_VACCINATED && (
            <TablePatients
              data={notVaccinatedPatientsData}
              segment={SegmentEnum.HPV}
              selectedPatients={selectedPatients}
              onSelect={setSelectedPatients}
              pagination={{
                count: notVaccinatedPatientsMeta?.totalItems ?? 0,
                rowsPerPageOptions: [10, 25, 50],
                rowsPerPage: notVaccinatedPagination.pageSize,
                page: notVaccinatedPagination.page,
                onPageChange: (value) =>
                  setNotVaccinatedPagination((v) => ({ ...v, page: value })),
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
          {selectedTab === tabsId.UNIT_RANKING && (
            <UnitsByVaccinationRanking
              aboveContent
              onSelectUnit={(item) => setSelectedUnit(item)}
              onFilterChange={(unitId) =>
                setSelectedFilters((value) => ({ ...value, unitId }))
              }
            />
          )}
          {selectedTab === tabsId.ACS_RANKING && (
            <AcsByVaccinationRanking
              aboveContent
              onSelectAcs={(item) => setSelectedAcs(item)}
              onFilterChange={(acsId) =>
                setSelectedFilters((value) => ({ ...value, acsId }))
              }
            />
          )}
        </Box>
      </Box>
      <Dialog
        open={Boolean(selectedPatientForDetails)}
        title="Paciente"
        doneText="Salvar"
        isDoneDisabled={updatePatientLoading}
        isDoneLoading={updatePatientLoading}
        formId={FORM_ID}
        actions
        onClose={() => setSelectedPatientForDetails(undefined)}
      >
        <Box width="96rem" maxWidth="100%">
          {selectedPatientForDetails && (
            <PatientDetails
              patient={selectedPatientForDetails}
              formId={FORM_ID}
              segment={SegmentEnum.HPV}
              onSubmit={handleUpdatePatient}
            />
          )}
        </Box>
      </Dialog>
      <Dialog
        open={Boolean(selectedAcs || selectedUnit)}
        doneText="Fechar"
        actions
        hideClose
        persist
        onDone={handleCloseRankingInfo}
      >
        <Box width="96rem" maxWidth="100%">
          {(selectedAcs || selectedUnit) && (
            <VaccinationRankingDetails
              unitRanking={selectedUnit}
              acsRanking={selectedAcs}
              onBack={handleCloseRankingInfo}
            />
          )}
        </Box>
      </Dialog>
    </Container>
  );
};

export default HpvVaccination;
