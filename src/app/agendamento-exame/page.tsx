"use client";

import { Card, Text, Steps, Chip } from "@/components/common";
import { StepsItemProps } from "@/components/common/Steps";
import { useAgenda, usePatientScheduling, useSnackbar } from "@/hooks";
import theme from "@/shared/theme/material-theme";
import typography from "@/shared/theme/typography-theme";
import { Box } from "@mui/material";
import {
  AgendaList,
  PatientData,
  Summary,
} from "@/components/pages/ExamScheduling/sections";
import { useMemo, useState } from "react";
import { AgendaEntity } from "@/domain/entities/agenda";
import { PatientExamSchedulingDto } from "@/domain/entities/patient-scheduling";
import { SnackbarType } from "@/contexts/SnackbarContext";
import dateUtils from "@/shared/date";
import useCityHall from "@/hooks/useCityHall";

const ExamScheduling = () => {
  const stepsProps: StepsItemProps[] = [
    {
      label: "Selecione a Data",
    },
    {
      label: "Dados",
    },
    {
      label: "Confirmação",
    },
  ];

  const { registerPatientScheduling } = usePatientScheduling();
  const { cityHallOptions } = useCityHall({
    getCityHallOptions: {
      enabled: true,
    },
  });

  const { showSnackBar } = useSnackbar();

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAgenda, setSelectedAgenda] = useState<AgendaEntity>();
  const [selectedCityHall, setSelectedCityHall] = useState<string>();

  const { agendas } = useAgenda({
    getAgendaOptions: {
      enabled: !!selectedCityHall,
      params: {
        cityHallIbge: selectedCityHall ?? "",
        beginDate: dateUtils().format("YYYY-MM-DD"),
      },
    },
  });

  const handleSelectAgenda = (data: AgendaEntity) => {
    setSelectedAgenda(data);
    setStepIndex(1);
  };

  const handlePatientDataSubmit = async (
    data: Omit<PatientExamSchedulingDto, "agendaId" | "cityHallIbge">,
  ) => {
    if (selectedAgenda) {
      const result = await registerPatientScheduling({
        agendaId: selectedAgenda.id,
        cityHallIbge: selectedCityHall ?? "",
        ...data,
      });

      if (result?.error) {
        showSnackBar?.({
          message:
            result.error.response?.data.message ?? "Um erro inesperado ocorreu",
          type: SnackbarType.ERROR,
        });
      } else if (result.data) {
        setStepIndex(2);
      }
    }
  };

  const handleChangeCityHall = (cityHallIbge: string) => {
    setSelectedCityHall(cityHallIbge);
    setStepIndex(0);
    setSelectedAgenda(undefined);
  };

  const cityHallOptionsData = useMemo(
    () =>
      cityHallOptions.map((item) => ({
        label: item.label,
        value: item.ibge,
      })),
    [cityHallOptions],
  );

  return (
    <Box
      bgcolor="#F7F7F8"
      minHeight="100%"
      width="100%"
      sx={{ p: { xs: "1rem", sm: "4.8rem" } }}
    >
      <Box width="100%" maxWidth="48rem" margin="auto">
        <Card
          noBoder
          bgcolor={theme.palette.white.main}
          py="3.2rem"
          mb="1.2rem"
        >
          <Text component="h1" {...typography.title.h3l} mb="0.5rem">
            Agendamento de Exames HPV
          </Text>
        </Card>
        <Card
          noBoder
          bgcolor={theme.palette.white.main}
          py="3.2rem"
          mb="1.2rem"
        >
          <Text color="#878E9A" {...typography.title.h4l}>
            Selecione o município
          </Text>
          <Box display="flex" gap="1rem" mt="1.6rem" flexWrap={"wrap"}>
            {cityHallOptionsData.map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                color={selectedCityHall === item.value ? "primary" : "default"}
                textColor={
                  selectedCityHall === item.value
                    ? theme.palette.white.main
                    : theme.palette.primary.main
                }
                onClick={() => handleChangeCityHall(item.value as string)}
              />
            ))}
          </Box>
        </Card>
        {selectedCityHall && (
          <>
            <Card
              noBoder
              bgcolor={theme.palette.white.main}
              py="3.2rem"
              mb="1.2rem"
            >
              <Steps items={stepsProps} activeIndex={stepIndex} />
            </Card>
            {stepIndex === 0 && (
              <AgendaList data={agendas} onSelect={handleSelectAgenda} />
            )}
            {stepIndex === 1 && (
              <PatientData
                cityHallIbge={selectedCityHall}
                onSubmit={handlePatientDataSubmit}
              />
            )}
            {stepIndex === 2 && selectedAgenda && (
              <Summary agenda={selectedAgenda} />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ExamScheduling;
