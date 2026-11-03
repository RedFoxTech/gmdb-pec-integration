"use client";

import {
  Autocomplete,
  Button,
  InputDate,
  Select,
  Text,
} from "@/components/common";
import { Dialog } from "@/components/dialogs";
import { AgendaForm } from "@/components/Forms";
import { TableAgenda } from "@/components/Tables";
import { SnackbarType } from "@/contexts/SnackbarContext";
import {
  AgendaEntity,
  GetAgendasDto,
  RegisterAgendaDto,
} from "@/domain/entities/agenda";
import { SelectOption } from "@/domain/entities/common";
import { useAgenda, useAuthUser, useSnackbar, useUnit } from "@/hooks";
import typography from "@/shared/theme/typography-theme";
import { Box, Container } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import dateUtils from "@/shared/date";
import { agendaTypeList } from "@/shared/lists";
import { AgendaType } from "@/domain/consts";

const FORM_ID = "form-schedule";

const Schedules = () => {
  const { authUser } = useAuthUser();

  const [filter, setFilter] = useState<{
    units: string[];
    types: string[];
    date: string;
  }>({
    units: [],
    types: [],
    date: "",
  });
  const [selectedFilters, setSelectedFilters] = useState<GetAgendasDto>({
    cityHallIbge: authUser?.cityHall.coIbge ?? "",
  });
  const [selectedAgenda, setSelectedAgenda] = useState<AgendaEntity>();

  const { units } = useUnit("agenda", {
    getUnitsOptions: {
      enabled: true,
    },
  });

  const {
    registerAgenda,
    registerAgendaLoading,
    agendas,
    agendasDataRefetch,
    updateAgenda,
    updateAgendaLoading,
    deleteAgenda,
  } = useAgenda({
    getAgendaOptions: {
      enabled: true,
      params: selectedFilters,
    },
  });

  const { showSnackBar } = useSnackbar();

  const [showForm, setShowForm] = useState(false);

  const unitOptios: SelectOption[] = useMemo(
    () =>
      units.map((item) => ({
        value: item.id,
        label: `${item.name} - ${item.address}, ${item.addressNumber}`,
      })),
    [units]
  );

  const handleRegister = async (data: RegisterAgendaDto) => {
    const result = await registerAgenda(data);

    if (result?.error) {
      showSnackBar?.({
        message:
          result.error.response?.data.message ?? "Um erro inesperado ocorreu",
        type: SnackbarType.ERROR,
      });
    } else if (result.data) {
      handleCloseForm();
      agendasDataRefetch();
      showSnackBar?.({
        message: "Agenda cadastrado com sucesso",
        type: SnackbarType.SUCCESS,
      });
    }
  };

  const handleUpdate = async (data: RegisterAgendaDto) => {
    if (selectedAgenda) {
      const result = await updateAgenda({
        id: selectedAgenda.id,
        data,
      });

      if (result?.error) {
        showSnackBar?.({
          message:
            result.error.response?.data.message ?? "Um erro inesperado ocorreu",
          type: SnackbarType.ERROR,
        });
      } else if (result.data) {
        agendasDataRefetch();
        handleCloseForm();
        showSnackBar?.({
          message: "Agenda atualizado com sucesso",
          type: SnackbarType.SUCCESS,
        });
      }
    }
  };

  const handleFormSubmit = (data: RegisterAgendaDto) => {
    if (selectedAgenda) {
      handleUpdate(data);
    } else {
      handleRegister(data);
    }
  };

  const handleDelete = async (data: AgendaEntity) => {
    const result = await deleteAgenda(data.id);

    if (result?.error) {
      showSnackBar?.({
        message:
          result.error.response?.data.message ?? "Um erro inesperado ocorreu",
        type: SnackbarType.ERROR,
      });
    } else if (result.data) {
      agendasDataRefetch();
      showSnackBar?.({
        message: "Agenda deletada com sucesso",
        type: SnackbarType.SUCCESS,
      });
    }
  };

  const handleSubmitFilter = () => {
    setSelectedFilters({
      cityHallIbge: authUser?.cityHall.coIbge ?? "",
      unitId: filter.units.join("|"),
      type: filter.types.join("|"),
      date: filter.date,
    });
  };

  const handleEdit = (data: AgendaEntity) => {
    setSelectedAgenda(data);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setSelectedAgenda(undefined);
    setShowForm(false);
  };

  useEffect(() => {
    setSelectedFilters({
      cityHallIbge: authUser?.cityHall.coIbge ?? "",
    });
  }, [authUser]);

  return (
    <Container>
      <Text {...typography.title.h1l}>Criar agenda</Text>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt="3.2rem"
      >
        <Text {...typography.title.h3l}>Agendas disponíveis</Text>
        <div>
          <Button onClick={() => setShowForm(true)}>Adicionar agenda</Button>
        </div>
      </Box>
      <Box
        display="flex"
        gap="1.3rem"
        mt="6rem"
        mb="3rem"
        maxWidth="88.1rem"
        width="100%"
      >
        <Box flex={1}>
          <Autocomplete
            value={unitOptios.filter((item) =>
              filter.units.includes(item.value as string)
            )}
            label="UBS"
            size="small"
            options={unitOptios}
            multiple
            onChange={(_, value) =>
              setFilter({
                ...filter,
                units: value.map((item) => item.value as string),
              })
            }
          />
        </Box>
        <Box flex={1}>
          <Select
            value={filter.types}
            label="Exames/procedimentos"
            options={agendaTypeList}
            multiple
            size="small"
            onChange={(e) =>
              setFilter({
                ...filter,
                types: e.target.value as AgendaType[],
              })
            }
          />
        </Box>
        <Box flex={1}>
          <InputDate
            value={filter.date ? dateUtils(filter.date) : null}
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
        <TableAgenda
          data={agendas}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Box>
      <Dialog
        open={showForm}
        title={selectedAgenda ? "Editar agenda" : "Adicionar agenda"}
        doneText={selectedAgenda ? "salvar" : "Criar agenda"}
        persist
        formId={FORM_ID}
        actions
        isCancelDisabled={registerAgendaLoading || updateAgendaLoading}
        isDoneDisabled={registerAgendaLoading || updateAgendaLoading}
        isDoneLoading={registerAgendaLoading || updateAgendaLoading}
        onClose={handleCloseForm}
        onCancel={handleCloseForm}
      >
        <Box minWidth="96rem" maxWidth="100%">
          <AgendaForm
            formId={FORM_ID}
            units={units}
            data={selectedAgenda}
            onSubmit={handleFormSubmit}
          />
        </Box>
      </Dialog>
    </Container>
  );
};

export default Schedules;
