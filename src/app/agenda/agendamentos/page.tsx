"use client";

import { Box, Container } from "@mui/material";
import { Button, InputDate, Text } from "@/components/common";
import typography from "@/shared/theme/typography-theme";
import { usePatientScheduling, useSnackbar } from "@/hooks";
import { TablePatientScheduling } from "@/components/Tables";
import {
  GetPatientSchedulingDto,
  PatientSchedulingEntity,
} from "@/domain/entities/patient-scheduling";
import { SnackbarType } from "@/contexts/SnackbarContext";
import { useState } from "react";
import dateUtils from "@/shared/date";
import { PatientSchedulingStatus } from "@/domain/consts";

const Scheduling = () => {
  const [filter, setFilter] = useState<{
    date: string;
  }>({
    date: "",
  });
  const [selectedFilters, setSelectedFilters] =
    useState<GetPatientSchedulingDto>({});

  const {
    patientSchedulings,
    patientSchedulingsDataRefetch,
    deletePatientScheduling,
    updatePatientSchedulingStatus,
  } = usePatientScheduling({
    getPatientSchedulingsOptions: {
      enabled: true,
      params: selectedFilters,
    },
  });

  const { showSnackBar } = useSnackbar();

  const handleDelete = async (data: PatientSchedulingEntity) => {
    const result = await deletePatientScheduling(data.id);

    if (result?.error) {
      showSnackBar?.({
        message:
          result.error.response?.data.message ?? "Um erro inesperado ocorreu",
        type: SnackbarType.ERROR,
      });
    } else if (result.data) {
      patientSchedulingsDataRefetch();
      showSnackBar?.({
        message: "Agendamento deletado com sucesso",
        type: SnackbarType.SUCCESS,
      });
    }
  };

  const handleUpdateSchedulingStatus = async (
    data: PatientSchedulingEntity
  ) => {
    const result = await updatePatientSchedulingStatus({
      id: data.id,
      data: {
        schedulingStatus: PatientSchedulingStatus.APPOITNEMNT_PERFORMED,
      },
    });

    if (result?.error) {
      showSnackBar?.({
        message:
          result.error.response?.data.message ?? "Um erro inesperado ocorreu",
        type: SnackbarType.ERROR,
      });
    } else if (result.data) {
      patientSchedulingsDataRefetch();
      showSnackBar?.({
        message: "Agendamento atualizado com sucesso",
        type: SnackbarType.SUCCESS,
      });
    }
  };

  const handleSubmitFilter = () => {
    setSelectedFilters({
      date: filter.date,
    });
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text {...typography.title.h1l}>Agendamentos</Text>
        <Box>
          <Button disabled>Exportar agendamentos</Button>
        </Box>
      </Box>
      <Box display="flex" gap="1.3rem" mt="6rem" mb="3rem">
        <Box>
          <InputDate
            value={filter.date ? dateUtils(filter.date) : null}
            disablePast
            fullWidth
            label="Data"
            size="small"
            onChange={(value) =>
              setFilter({
                ...filter,
                date: value?.format("YYYY-MM-DD") ?? "",
              })
            }
          />
        </Box>
        <Button variant="contained" onClick={handleSubmitFilter}>
          Filtrar
        </Button>
      </Box>
      <Box>
        <TablePatientScheduling
          data={patientSchedulings}
          onDelete={handleDelete}
          onCompleteAppointment={handleUpdateSchedulingStatus}
        />
      </Box>
    </Container>
  );
};

export default Scheduling;
