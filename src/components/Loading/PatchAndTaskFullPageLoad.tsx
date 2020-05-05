import React from "react";
import { H2 } from "components/Typography";
import { Skeleton } from "antd";
import {
  PageContent,
  PageLayout,
  PageSider,
  SiderCard,
} from "components/styles";

export const PatchAndTaskFullPageLoad: React.FC = () => {
  return (
    <>
      <H2>
        <Skeleton active={true} paragraph={{ rows: 0 }} />
      </H2>
      <PageLayout>
        <PageSider>
          <SiderCard>
            <Skeleton active={true} title={false} paragraph={{ rows: 4 }} />
          </SiderCard>
          <SiderCard>
            <Skeleton active={true} title={false} paragraph={{ rows: 4 }} />
          </SiderCard>
        </PageSider>
        <PageLayout>
          <PageContent>
            <Skeleton active={true} title={true} paragraph={{ rows: 8 }} />;
          </PageContent>
        </PageLayout>
      </PageLayout>
    </>
  );
};
