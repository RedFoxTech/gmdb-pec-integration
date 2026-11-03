"use client";

import { Box, Container } from "@mui/material";
import {
  Autocomplete,
  Button,
  ComparatorIndicator,
  // InputDate,
  Select,
  Text,
  TextField,
} from "@/components/common";
// import dayjs from "dayjs";
import typography from "@/shared/theme/typography-theme";
import { useMemo, useState } from "react";
import {
  ExamAppointmentStatusEnum,
  ExamStatusEnum,
  GenderEnum,
  IndicatorsEarlyDetectionTypeEnum,
  SegmentEnum,
} from "@/domain/consts";
import { TableEarlyDetection } from "@/components/Tables";
import {
  Circle as CircleIcon,
  Search as SearchIcon,
  Diversity3Outlined as Diversity3OutlinedIcon,
  HealthAndSafetyOutlined as HealthAndSafetyOutlinedIcon,
  Download as DownloadIcon,
  GppMaybeOutlined as GppMaybeOutlinedIcon,
  WaterDropOutlined as WaterDropOutlinedIcon,
} from "@mui/icons-material";
import {
  useAcs,
  useExam,
  useIndicators,
  usePatient,
  useSnackbar,
  useTag,
  useUnit,
} from "@/hooks";
import { SelectOption } from "@/domain/entities/common";
import {
  EarlyDetectionExamAppointmentStatusList,
  EarlyDetectionExamStatusList,
} from "@/shared/lists";
import { Dialog } from "@/components/dialogs";
import { ExamEntity, GetExamsDto } from "@/domain/entities/exam";
import { ExamDetails } from "@/components/sections";
import { UpdatePatientDataDto } from "@/domain/entities/patient";
import { SnackbarType } from "@/contexts/SnackbarContext";
import dateUtils from "@/shared/date";
import { percentageByTotal } from "@/shared/numberUtils";
import IndicatorCard from "@/components/common/IndicatorCard";

const FORM_ID = "form-patient-details";

const MIN_DATE = `${new Date().getFullYear() - 64}-01-01`;
const MAX_DATE = `${new Date().getFullYear() - 25}-12-31`;

const PatientManagementEarlyDetection = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [filter, setFilter] = useState<{
    patientName: string;
    unit: string[];
    acs: string[];
    examStatus: ExamStatusEnum[];
    examAppointmentStatus: ExamAppointmentStatusEnum[];

    collectionYear?: number;
  }>({
    patientName: "",
    unit: [],
    acs: [],
    examStatus: [],
    examAppointmentStatus: [],
    // collectionYear: new Date().getFullYear(),
  });

  const [selectedFilters, setSelectedFilters] = useState<GetExamsDto>({
    // collectionYear: new Date().getFullYear(),
  });

  const [selectedAppointmentForDetails, setSelectedAppointmentForDetails] =
    useState<ExamEntity>();

  const {
    exams,
    examsMeta,
    examsRefetch,
    examsLoading,
    isExporting,
    startExamExportStream,
  } = useExam({
    getExamsOptions: {
      enabled: true,
      params: {
        ...selectedFilters,
        ...pagination,
        patientBeginAgeDate: MIN_DATE,
        patientEndAgeDate: MAX_DATE,
        gender: GenderEnum.FEMALE,
      },
    },
    getExamsReportOptions: {
      params: {
        ...selectedFilters,
        patientBeginAgeDate: MIN_DATE,
        patientEndAgeDate: MAX_DATE,
      },
    },
  });

  const { units } = useUnit("early-detection", {
    getUnitsOptions: {
      enabled: true,
    },
  });

  const { acsList } = useAcs("early-detection", {
    getAcsListOptions: {
      enabled: true,
      params: {
        units: selectedFilters.units,
      },
    },
  });

  const { updatePatient, updatePatientLoading } = usePatient("early-detection");

  const { tagsRefetch } = useTag();

  const { showSnackBar } = useSnackbar();

  const { earlyDetectionIndicators } = useIndicators({
    getEarlyDetectionIndicators: {
      enabled: true,
      params: {
        year: dateUtils().format("YYYY"),
        types: IndicatorsEarlyDetectionTypeEnum.GENERAL,
        patientName: selectedFilters.patientName,
        acs: selectedFilters.acs,
        units: selectedFilters.units,
        examStatus: selectedFilters.examStatus,
        examAppointmentStatus: selectedFilters.examAppointmentStatus,
        gender: GenderEnum.FEMALE,
        // collectionYear: selectedFilters.collectionYear,
      },
    },
  });

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
    setSelectedFilters({
      units: filter.unit.join("|"),
      examStatus: filter.examStatus.join("|"),
      examAppointmentStatus: filter.examAppointmentStatus.join("|"),
      acs: filter.acs.join("|"),
      patientName: filter.patientName,
      // collectionYear: filter.collectionYear,
    });
  };

  const handleUpdatePatient = async (data: { tags: string[] }) => {
    if (selectedAppointmentForDetails) {
      const body: UpdatePatientDataDto = {
        patientPecId: selectedAppointmentForDetails.patientPecId,
        segmentId: SegmentEnum.CYTOPATHOLOGY,
        tags: data.tags,
      };

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
        examsRefetch();
        setSelectedAppointmentForDetails(undefined);
        showSnackBar?.({
          message: "Dados atualizado com sucesso",
          type: SnackbarType.SUCCESS,
        });
      }
    }
  };

  const indicatorsData = useMemo(() => {
    const general = earlyDetectionIndicators?.general;
    return [
      {
        title: "Total de Mulheres",
        icon: () => (
          <Diversity3OutlinedIcon
            color="primary"
            sx={{ width: "2.4rem", height: "2.4rem" }}
          />
        ),
        total: general?.all.total ?? 0,
        descLeft: "25 a 64 anos",
        totalLeft: general?.all.age25To64 ?? 0,
        percentageLeft: percentageByTotal(
          general?.all.age25To64 ?? 0,
          general?.all.total ?? 0,
        ),
        descRight: "35 e 45 anos",
        totalRight: general?.all.age35And45 ?? 0,
        percentageRight: percentageByTotal(
          general?.all.age35And45 ?? 0,
          general?.all.total ?? 0,
        ),
      },
      {
        title: "Mulheres com exames em dia",
        icon: () => (
          <HealthAndSafetyOutlinedIcon
            color="primary"
            sx={{ width: "2.4rem", height: "2.4rem" }}
          />
        ),
        total: general?.examUpToDate.total ?? 0,
        descLeft: "25 a 64 anos | Exames <= 1 ano",
        totalLeft: general?.examUpToDate.age25To64 ?? 0,
        percentageLeft: percentageByTotal(
          general?.examUpToDate.age25To64 ?? 0,
          general?.all.total ?? 0,
        ),
        descRight: "35 e 45 anos | Exames <= 1 ano",
        totalRight: general?.examUpToDate.age35And45 ?? 0,
        percentageRight: percentageByTotal(
          general?.examUpToDate.age35And45 ?? 0,
          general?.all.total ?? 0,
        ),
      },
      {
        title: "Mulheres com exames pendentes",
        icon: () => (
          <GppMaybeOutlinedIcon
            color="primary"
            sx={{ width: "2.4rem", height: "2.4rem" }}
          />
        ),
        total: general?.examPending.total ?? 0,
        descLeft: "25 a 64 anos | Exames > 1 ano",
        totalLeft: general?.examPending.age25To64 ?? 0,
        percentageLeft: percentageByTotal(
          general?.examPending.age25To64 ?? 0,
          general?.all.total ?? 0,
        ),
        descRight: "35 e 45 anos | Exames > 1 ano",
        totalRight: general?.examPending.age35And45 ?? 0,
        percentageRight: percentageByTotal(
          general?.examPending.age35And45 ?? 0,
          general?.all.total ?? 0,
        ),
      },
    ];
  }, [earlyDetectionIndicators]);

  return (
    <Container>
      <Text component="h1" {...typography.title.h1l}>
        Detecção precoce{" "}
      </Text>
      <Box display="flex" gap="1.8rem" mt="2.8rem">
        {indicatorsData.map((item) => (
          <Box key={item.title} flex={1}>
            <ComparatorIndicator
              title={item.title}
              titleIcon={<item.icon />}
              total={item.total}
              totalLeft={item.totalLeft}
              percentageLeft={item.percentageLeft}
              textLeft={item.descLeft}
              totalRight={item.totalRight}
              percentageRight={item.percentageRight}
              textRight={item.descRight}
              noData={!earlyDetectionIndicators?.general}
              loading={examsLoading}
            />
          </Box>
        ))}
      </Box>
      <Box display="flex" gap="1.8rem" mt="2.8rem">
        <Box flex={1}>
          <IndicatorCard
            title="Pacientes com exames sem data definida"
            total={earlyDetectionIndicators?.general?.examsWithoutColect}
            titleIcon={
              <WaterDropOutlinedIcon
                color="primary"
                sx={{ width: "2.4rem", height: "2.4rem" }}
              />
            }
            loading={examsLoading}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        my="2.4rem"
        gap="0.5rem"
      >
        <Button
          variant="outlined"
          startIcon={<DownloadIcon sx={{ width: "2rem", height: "2rem" }} />}
          disabled={isExporting}
          loading={isExporting}
          onClick={() => startExamExportStream()}
        >
          {isExporting ? "Exportando..." : "Exportar lista"}
        </Button>
      </Box>
      <Box>
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
          {/*<Box flex={1}>
            <InputDate
              value={
                filter.collectionYear
                  ? dayjs().year(filter.collectionYear)
                  : null
              }
              label="Ano de coleta"
              views={["year"]}
              size="small"
              maxDate={dayjs()}
              onChange={(date) => {
                setFilter({
                  ...filter,
                  collectionYear: date ? date.year() : undefined,
                });
              }}
            />
          </Box>*/}
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
              value={filter.examStatus}
              label="Status do exame"
              options={EarlyDetectionExamStatusList}
              multiple
              size="small"
              onChange={(item) =>
                setFilter({
                  ...filter,
                  examStatus: item.target.value as ExamStatusEnum[],
                })
              }
            />
          </Box>
          <Box flex={1}>
            <Select
              value={filter.examAppointmentStatus}
              label="Status do Agendamento"
              options={EarlyDetectionExamAppointmentStatusList}
              multiple
              size="small"
              onChange={(item) =>
                setFilter({
                  ...filter,
                  examAppointmentStatus: item.target
                    .value as ExamAppointmentStatusEnum[],
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
        <Box display="flex" gap="1.2rem" mb="1.2rem">
          <Text {...typography.paragraph.l3} color="#646464">
            Status do Exame:
          </Text>
          <Box display="flex" gap="0.8rem" alignItems="center">
            <CircleIcon
              sx={{ width: "1.4rem", height: "1.4rem", color: "#2E7D32" }}
            />
            <Text {...typography.paragraph.l3} color="#646464">
              Em dia
            </Text>
          </Box>
          <Box display="flex" gap="0.8rem" alignItems="center">
            <CircleIcon
              sx={{ width: "1.4rem", height: "1.4rem", color: "#D3A900" }}
            />
            <Text {...typography.paragraph.l3} color="#646464">
              Atenção: entre 1 e 3 anos
            </Text>
          </Box>
          <Box display="flex" gap="0.8rem" alignItems="center">
            <CircleIcon
              sx={{ width: "1.4rem", height: "1.4rem", color: "#D32F2F" }}
            />
            <Text {...typography.paragraph.l3} color="#646464">
              Vencido: mais de 3 anos
            </Text>
          </Box>
          <Box display="flex" gap="0.8rem" alignItems="center">
            <CircleIcon
              sx={{ width: "1.4rem", height: "1.4rem", color: "#7C7C7C" }}
            />
            <Text {...typography.paragraph.l3} color="#646464">
              Indefinido: sem data do exame definida
            </Text>
          </Box>
        </Box>
        <Box>
          <TableEarlyDetection
            data={exams}
            loading={examsLoading}
            pagination={{
              count: examsMeta?.totalItems ?? 0,
              rowsPerPageOptions: [10, 25, 50],
              rowsPerPage: 10,
              page: pagination.page,
              onPageChange: (value) =>
                setPagination((v) => ({ ...v, page: value })),
              onRowsPerPageChange: (value) =>
                setPagination((v) => ({
                  ...v,
                  pageSize: value,
                })),
            }}
            onClick={setSelectedAppointmentForDetails}
          />
        </Box>
      </Box>

      <Dialog
        open={Boolean(selectedAppointmentForDetails)}
        title="Paciente"
        doneText="Salvar"
        isDoneDisabled={updatePatientLoading}
        isDoneLoading={updatePatientLoading}
        formId={FORM_ID}
        actions
        onClose={() => setSelectedAppointmentForDetails(undefined)}
      >
        <Box width="96rem" maxWidth="100%">
          {selectedAppointmentForDetails && (
            <ExamDetails
              exam={selectedAppointmentForDetails}
              formId={FORM_ID}
              segment={SegmentEnum.CYTOPATHOLOGY}
              onSubmit={handleUpdatePatient}
            />
          )}
        </Box>
      </Dialog>
    </Container>
  );
};

export default PatientManagementEarlyDetection;
