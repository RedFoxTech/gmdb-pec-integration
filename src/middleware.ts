import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserProfiles, PageEnum, CookieKeys } from "./domain/consts";
import { cookies } from "next/headers";

const PATHS_BY_USER = {
  [UserProfiles.MASTER_ADMIN]: {
    pages: [
      PageEnum.PATIENT_MANAGEMENT_VACCINATION_HPV,
      PageEnum.PATIENT_MANAGEMENT_EARLY_DETECTION,
      PageEnum.NOT_CONSENT_TERMS,
      PageEnum.USERS,
      PageEnum.AGENDA,
      PageEnum.SCHEDULINGS,
      PageEnum.EXAM_SCHEDULING,
      PageEnum.CAMPAIGNS,
      PageEnum.NEW_CAMPAIGNS,
      PageEnum.PANEL,
      PageEnum.PANEL_VACINNATION_COVERAGE,
      PageEnum.PANEL_EARLY_DETECTION,
      PageEnum.PANEL_MORTALITY_RATE,
    ],
    fallback: PageEnum.PATIENT_MANAGEMENT_VACCINATION_HPV,
  },
  [UserProfiles.ADMIN]: {
    pages: [
      PageEnum.PATIENT_MANAGEMENT_VACCINATION_HPV,
      PageEnum.PATIENT_MANAGEMENT_EARLY_DETECTION,
      PageEnum.NOT_CONSENT_TERMS,
      PageEnum.USERS,
      PageEnum.AGENDA,
      PageEnum.SCHEDULINGS,
      PageEnum.EXAM_SCHEDULING,
      PageEnum.CAMPAIGNS,
      PageEnum.NEW_CAMPAIGNS,
      PageEnum.PANEL,
      PageEnum.PANEL_VACINNATION_COVERAGE,
      PageEnum.PANEL_EARLY_DETECTION,
      PageEnum.PANEL_MORTALITY_RATE,
    ],
    fallback: PageEnum.PATIENT_MANAGEMENT_VACCINATION_HPV,
  },
  [UserProfiles.AUTHORIZED]: {
    pages: [
      PageEnum.PATIENT_MANAGEMENT_VACCINATION_HPV,
      PageEnum.PATIENT_MANAGEMENT_EARLY_DETECTION,
      PageEnum.NOT_CONSENT_TERMS,
      PageEnum.USERS,
      PageEnum.AGENDA,
      PageEnum.SCHEDULINGS,
      PageEnum.EXAM_SCHEDULING,
      PageEnum.CAMPAIGNS,
      PageEnum.NEW_CAMPAIGNS,
      PageEnum.PANEL,
      PageEnum.PANEL_VACINNATION_COVERAGE,
      PageEnum.PANEL_EARLY_DETECTION,
      PageEnum.PANEL_MORTALITY_RATE,
    ],
    fallback: PageEnum.PATIENT_MANAGEMENT_VACCINATION_HPV,
  },
  [UserProfiles.PATIENT]: {
    pages: [
      PageEnum.PATIENT_MANAGEMENT_VACCINATION_HPV,
      PageEnum.NOT_CONSENT_TERMS,
      PageEnum.EXAM_SCHEDULING,
    ],
    fallback: PageEnum.PATIENT_MANAGEMENT_VACCINATION_HPV,
  },
  [UserProfiles.UNAUTHORIZED]: {
    pages: [
      PageEnum.LOGIN,
      PageEnum.NOT_CONSENT_TERMS,
      PageEnum.EXAM_SCHEDULING,
    ],
    fallback: PageEnum.LOGIN,
  },
};

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|.*.png|.*.json|.*.jpg|.*.jpeg|.*.svg|.*.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

const getUserRole = (isAuth: boolean, role?: string) => {
  if (isAuth && PATHS_BY_USER[role as UserProfiles]) {
    return role as UserProfiles;
  }

  return UserProfiles.UNAUTHORIZED;
};

export const middleware = async (request: NextRequest) => {
  const cookieStore = await cookies();
  const isAuth = !!cookieStore.get(CookieKeys.AUTH_TOKEN);
  const userRole = getUserRole(
    isAuth,
    cookieStore.get(CookieKeys.USER_ROLE)?.value
  );

  const absoluteURL = new URL(
    PATHS_BY_USER[userRole].fallback,
    request.nextUrl.origin
  );
  if (
    !PATHS_BY_USER[userRole].pages.some((page) =>
      request.nextUrl.pathname.includes(page)
    )
  ) {
    return NextResponse.redirect(absoluteURL.toString());
  }
};
