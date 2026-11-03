"use client";
import { Fragment, Suspense } from "react";

type NewCampaignLayoutProps = {
  children: React.ReactNode;
};

const NewCampaignLayout: React.FC<NewCampaignLayoutProps> = ({ children }) => {
  return (
    <Fragment>
      <Suspense>{children}</Suspense>
    </Fragment>
  );
};

export default NewCampaignLayout;
