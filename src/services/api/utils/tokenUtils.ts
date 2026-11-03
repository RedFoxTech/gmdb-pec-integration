import { CookieKeys } from "@/domain/consts";
import { getCookieValue } from "@/shared/cookieUtils";

export const getAuthToken = () => {
  const authToken = getCookieValue(CookieKeys.AUTH_TOKEN);
  if (authToken) {
    return `Bearer ${authToken}`;
  }

  return null;
};
