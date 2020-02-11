import React from "react";
import { BreadCrumb } from "components/Breadcrumb";
import { BigTitle } from "components/styles/Typography";
import { PageWrapper } from "components/styles/PageWrapper";
import { SiderCard } from "components/styles/SiderCard";
import { PageHeader } from "components/styles/PageHeader";
import { PageContent, PageLayout, PageSider } from "components/styles/Layout";

export const Patch = () => {
  return (
    <PageWrapper>
      <BreadCrumb displayName="Specific Patch" />
      <PageHeader>
        <BigTitle>Current Patch Name</BigTitle>
      </PageHeader>
      <PageLayout>
        <PageSider>
          <SiderCard>Patch Metadata</SiderCard>
          <SiderCard>Build Variants</SiderCard>
        </PageSider>
        <PageLayout>
          <PageContent>I'm where the table will go</PageContent>
        </PageLayout>
      </PageLayout>
    </PageWrapper>
  );
};
