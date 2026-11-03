"use client";
import { Suspense } from "react";

type ExamSchedulingLayoutProps = {
  children: React.ReactNode;
};

const ExamSchedulingLayout: React.FC<ExamSchedulingLayoutProps> = ({
  children,
}) => {
  return <Suspense fallback={<></>}>{children}</Suspense>;
};

export default ExamSchedulingLayout;
