"use client";
import { Suspense } from "react";

type HpvVaccinationLayoutProps = {
  children: React.ReactNode;
};

const HpvVaccinationLayout: React.FC<HpvVaccinationLayoutProps> = ({
  children,
}) => {
  return <Suspense fallback={<></>}>{children}</Suspense>;
};

export default HpvVaccinationLayout;
