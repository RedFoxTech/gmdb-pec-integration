"use client";

import typography from "@/shared/theme/typography-theme";
import { Box, Container } from "@mui/material";
import { Button, Text } from "@/components/common";
import { TableUsers } from "@/components/Tables";
import { useAuthUser, useSnackbar, useUser } from "@/hooks";
import { Dialog } from "@/components/dialogs";
import { useState } from "react";
import { UserForm } from "@/components/Forms";
import { RegisterUserDto, UserAdminEntity } from "@/domain/entities/user";
import { SnackbarType } from "@/contexts/SnackbarContext";
import { UserProfiles, UserTypes } from "@/domain/consts";

const FORM_ID = "form-user";

const Users = () => {
  const {
    allAppUsers,
    allAppUsersRefetch,
    registerUser,
    registerUserLoading,
    updateUser,
    updateUserLoading,
  } = useUser({
    getAllAppUsersOptions: {
      enabled: true,
    },
  });

  const { authUser } = useAuthUser();

  const { showSnackBar } = useSnackbar();

  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAdminEntity>();

  const handleRegister = async (
    data: Omit<RegisterUserDto, "profileId" | "userTypeId" | "cityHallId">
  ) => {
    const result = await registerUser({
      profileId: UserProfiles.ADMIN,
      userTypeId: UserTypes.ADMIN,
      cityHallId: authUser?.cityHall.id ?? "",
      ...data,
    });

    if (result?.error) {
      showSnackBar?.({
        message:
          result.error.response?.data.message ?? "Um erro inesperado ocorreu",
        type: SnackbarType.ERROR,
      });
    } else if (result.data) {
      allAppUsersRefetch();
      setShowForm(false);
      showSnackBar?.({
        message: "Usuário cadastrado com sucesso",
        type: SnackbarType.SUCCESS,
      });
    }
  };

  const handleUpdate = async (
    data: Omit<RegisterUserDto, "profileId" | "userTypeId" | "cityHallId">
  ) => {
    if (selectedUser) {
      const result = await updateUser({
        id: selectedUser.id,
        data: {
          userTypeId: selectedUser.userTypeId,
          profileId: selectedUser.profile.id,
          cityHallId: authUser?.cityHall.id ?? "",
          ...data,
        },
      });

      if (result?.error) {
        showSnackBar?.({
          message:
            result.error.response?.data.message ?? "Um erro inesperado ocorreu",
          type: SnackbarType.ERROR,
        });
      } else if (result.data) {
        allAppUsersRefetch();
        setShowForm(false);
        showSnackBar?.({
          message: "Usuário atualizado com sucesso",
          type: SnackbarType.SUCCESS,
        });
      }
    }
  };

  const handleSubmit = (
    data: Omit<RegisterUserDto, "profileId" | "userTypeId" | "cityHallId">
  ) => {
    if (selectedUser) {
      handleUpdate(data);
    } else {
      handleRegister(data);
    }
  };

  const handleSelectUser = (data: UserAdminEntity) => {
    setSelectedUser(data);
    setShowForm(true);
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text {...typography.title.h1l}>Usuários</Text>
        <div>
          <Button onClick={() => setShowForm(true)}>
            Adicionar novo usuário
          </Button>
        </div>
      </Box>
      <Box mt="3.2rem">
        <TableUsers data={allAppUsers} onEdit={handleSelectUser} />
      </Box>
      <Dialog
        open={showForm}
        title={selectedUser ? "Editar usuário" : "Adicionar usuário"}
        doneText={selectedUser ? "Salvar" : "Criar usuário"}
        isDoneDisabled={registerUserLoading || updateUserLoading}
        isDoneLoading={registerUserLoading || updateUserLoading}
        isCancelDisabled={registerUserLoading || updateUserLoading}
        persist
        formId={FORM_ID}
        actions
        onClose={() => setShowForm(false)}
        onCancel={() => setShowForm(false)}
      >
        <Box minWidth="65.4rem" maxWidth="100%">
          <UserForm
            formId={FORM_ID}
            data={selectedUser}
            onSubmit={handleSubmit}
          />
        </Box>
      </Dialog>
    </Container>
  );
};

export default Users;
