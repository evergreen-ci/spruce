import React from "react";
import { Skeleton } from "antd";
import {
  PageContent,
  PageLayout,
  PageSider,
  PageWrapper,
  SiderCard,
} from "components/styles";
import { H2 } from "components/Typography";

export const PatchAndTaskFullPageLoad: React.VFC = () => (
  <PageWrapper>
    <H2>
      <Skeleton active paragraph={{ rows: 0 }} />
    </H2>
    <PageLayout>
      <PageSider>
        {/* @ts-expect-error */}
        <SiderCard>
          <Skeleton active title={false} paragraph={{ rows: 4 }} />
        </SiderCard>
        {/* @ts-expect-error */}
        <SiderCard>
          <Skeleton active title={false} paragraph={{ rows: 4 }} />
        </SiderCard>
      </PageSider>
      <PageLayout>
        <PageContent>
          <Skeleton active title paragraph={{ rows: 8 }} />
        </PageContent>
      </PageLayout>
    </PageLayout>
  </PageWrapper>
);
