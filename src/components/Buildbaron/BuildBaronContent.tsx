import React, { useEffect, useState } from "react";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { Banners } from "components/Banners";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { BuildBaron } from "gql/generated/types";
import { withBannersContext } from "hoc/withBannersContext";
import { BBTitle, TitleAndButtons } from "./BBComponents";
import { CreatedTickets } from "./BBCreatedTickets";
import { BBFileTicket } from "./BBFIleTicket";
import { BuildBaronTable } from "./BuildBaronTable";

interface BuildBaronCoreProps {
  eventData: BuildBaron;
  taskId: string;
  loading: boolean;
}

const BuildBaronCore: React.FC<BuildBaronCoreProps> = ({
  eventData,
  taskId,
  loading,
}) => {
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();
  const { tab } = useParams<{ tab: string }>();
  useEffect(() => {
    dispatchBanner.clearAllBanners();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps
  const [createdTicketsCount, setCreatedTicketsCount] = useState<number>(0);
  return (
    <>
      {loading && <Skeleton active title={false} paragraph={{ rows: 4 }} />}
      {eventData && (
        <>
          <Banners
            banners={bannersState}
            removeBanner={dispatchBanner.removeBanner}
          />

          <CreatedTickets
            taskId={taskId}
            setCreatedTicketsCount={setCreatedTicketsCount}
            createdTicketsCount={createdTicketsCount}
          />

          <TitleAndButtons>
            <BBFileTicket
              taskId={taskId}
              setCreatedTicketsCount={setCreatedTicketsCount}
              createdTicketsCount={createdTicketsCount}
            />
            <BBTitle>Related tickets from Jira </BBTitle>
          </TitleAndButtons>
          <BuildBaronTable jiraIssues={eventData?.searchReturnInfo?.issues} />
        </>
      )}
    </>
  );
};

interface titleProps {
  margin?: boolean;
}

export const BuildBaronContent = withBannersContext(BuildBaronCore);
