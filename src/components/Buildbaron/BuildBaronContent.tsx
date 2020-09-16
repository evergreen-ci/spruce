import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Subtitle } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { Banners } from "components/Banners";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { BuildBaron } from "gql/generated/types";
import { withBannersContext } from "hoc/withBannersContext";
import { BBTitle, TitleAndButtons } from "./BBComponents";
import { BBFileTicket, CreatedTickets } from "./BBFIleTicket";
import { BuildBaronTable } from "./BuildBaronTable";

interface Props {
  eventData: BuildBaron;
  taskId: string;
}

const BuildBaronCore: React.FC<Props> = ({ eventData, taskId }) => {
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();
  const { tab } = useParams<{ tab: string }>();
  useEffect(() => {
    dispatchBanner.clearAllBanners();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps
  const [createdTicketsCount, setCreatedTicketsCount] = useState<number>(0);
  console.log(`BuildBaronContent 29: ${createdTicketsCount}`);
  return (
    <>
      {eventData && (
        <>
          <Banners
            banners={bannersState}
            removeBanner={dispatchBanner.removeBanner}
          />

          <CreatedTickets
            taskId={taskId}
            dispatchBanner={dispatchBanner}
            setCreatedTicketsCount={setCreatedTicketsCount}
            createdTicketsCount={createdTicketsCount}
          />

          <TitleAndButtons>
            <BBFileTicket
              taskId={taskId}
              dispatchBanner={dispatchBanner}
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
export const StyledSubtitle = styled(Subtitle)<titleProps>`
  margin-bottom: ${(props) => (props.margin ? "15px" : "5px")};
  margin-top: ${(props) => (props.margin ? "25px" : "20px")};
  font-size: 16px;
  line-height: 24px;
  font-weight: bold;
`;

interface titleProps {
  margin?: boolean;
}

export const BuildBaronContent = withBannersContext(BuildBaronCore);
