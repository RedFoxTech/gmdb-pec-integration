"use client";

import { createContext } from "react";
import { PromiseResponseError } from "@/services/api/api";
import { UserAuthEntity } from "@/domain/entities/user";

export interface AuthUserContextType {
  authUser?: UserAuthEntity;
  authUserLoading?: boolean;
  authUserError?: PromiseResponseError | null;
  authUserRefetch?: () => void;
}

export const AuthUserContext = createContext<AuthUserContextType>({});
