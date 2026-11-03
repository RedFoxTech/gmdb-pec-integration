import {
  AuthUserContext,
  AuthUserContextType,
} from "@/contexts/AuthUserContext";
import { useContext } from "react";

const useAuthUser = (): AuthUserContextType => {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error("useAuthUser must be used within a AuthUserProvider");
  }
  return context;
};

export default useAuthUser;
