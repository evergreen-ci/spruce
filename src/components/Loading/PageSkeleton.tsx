import React from "react";
import { BigTitle } from "components/styles/Typography";
import { PageWrapper } from "components/styles/PageWrapper";
import { SiderCard } from "components/styles/SiderCard";
import { PageHeader } from "components/styles/PageHeader";
import { PageContent, PageLayout, PageSider } from "components/styles/Layout";
import { Skeleton } from "antd";

export const PageSkeleton: React.FC = () => {
  return (
    <PageWrapper>
      <PageHeader>
        <BigTitle>
          <Skeleton title={{ width: 300 }} paragraph={false} active={true} />
        </BigTitle>
      </PageHeader>
      <PageLayout>
        <PageSider>
          <SiderCard>
            <Skeleton active={true} />
          </SiderCard>
          <SiderCard>
            <Skeleton active={true} />
          </SiderCard>
        </PageSider>
        <PageLayout>
          <PageContent>
            <Skeleton active={true} paragraph={{ rows: 10 }} />
          </PageContent>
        </PageLayout>
      </PageLayout>
    </PageWrapper>
  );
};
