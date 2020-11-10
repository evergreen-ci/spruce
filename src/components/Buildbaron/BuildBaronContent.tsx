import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { Banners } from "components/Banners";
import { StyledLink } from "components/styles";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { GetSpruceConfigQuery, BuildBaron } from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";
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

  const { data } = useQuery<GetSpruceConfigQuery>(GET_SPRUCE_CONFIG);
  const spruceConfig = data?.spruceConfig;
  const jiraHost = spruceConfig?.jira?.host;

  const jiraSearchString = eventData?.searchReturnInfo?.search;
  const jqlEscaped = encodeURIComponent(jiraSearchString);
  const jiraSearchLink = `https://${jiraHost}/secure/IssueNavigator.jspa?jql=${jqlEscaped}`;

  return (
    <span data-cy="bb-content">
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
            <BBTitle>
              Related tickets from Jira
              <StyledLink data-cy="jira-search-link" href={jiraSearchLink}>
                {"  "}(Jira Search)
              </StyledLink>
            </BBTitle>
          </TitleAndButtons>
          <BuildBaronTable jiraIssues={eventData?.searchReturnInfo?.issues} />
        </>
      )}
    </span>
  );
};

export const BuildBaronContent = withBannersContext(BuildBaronCore);
