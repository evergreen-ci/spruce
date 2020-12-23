import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { Banners } from "components/Banners";
import { StyledLink } from "components/styles";
import { getJiraSearchUrl } from "constants/externalResources";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import {
  GetSpruceConfigQuery,
  BuildBaron,
  Annotation,
} from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";
import { withBannersContext } from "hoc/withBannersContext";
import { AnnotationTickets } from "./AnnotationTickets";
import { TicketsTitle, TitleAndButtons } from "./BBComponents";
import { CreatedTickets } from "./BBCreatedTickets";
import { BBFileTicket } from "./BBFIleTicket";
import { BuildBaronTable } from "./BuildBaronTable";

interface BuildBaronCoreProps {
  bbData: BuildBaron;
  taskId: string;
  execution: number;
  loading: boolean;
  annotation: Annotation;
  userModifyPermission: boolean;
}

const BuildBaronCore: React.FC<BuildBaronCoreProps> = ({
  bbData,
  taskId,
  execution,
  loading,
  annotation,
  userModifyPermission,
}) => {
  const annotationsReady = true;
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

  const jiraSearchString = bbData?.searchReturnInfo?.search;
  const jqlEscaped = encodeURIComponent(jiraSearchString);
  const jiraSearchLink = getJiraSearchUrl(jiraHost, jqlEscaped);

  return (
    <span data-cy="bb-content">
      {loading && <Skeleton active title={false} paragraph={{ rows: 4 }} />}
      {bbData && (
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
          </TitleAndButtons>
          {annotationsReady && (
            <>
              <AnnotationTickets
                tickets={annotation?.issues}
                isIssue
                taskId={taskId}
                execution={execution}
                userModifyPermission={userModifyPermission}
              />
              <AnnotationTickets
                tickets={annotation?.suspectedIssues}
                isIssue={false}
                taskId={taskId}
                execution={execution}
                userModifyPermission={userModifyPermission}
              />
            </>
          )}

          <TitleAndButtons>
            <TicketsTitle>
              Related tickets from Jira
              <StyledLink data-cy="jira-search-link" href={jiraSearchLink}>
                {"  "}(Jira Search)
              </StyledLink>
            </TicketsTitle>
          </TitleAndButtons>
          {/* build baron related jira tickets */}
          <BuildBaronTable jiraIssues={bbData?.searchReturnInfo?.issues} />
        </>
      )}
    </span>
  );
};

export const BuildBaronContent = withBannersContext(BuildBaronCore);
