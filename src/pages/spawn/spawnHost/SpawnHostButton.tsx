import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { useLocation } from "react-router-dom";
import { useSpawnAnalytics } from "analytics";
import { PlusButton } from "components/Buttons";
import { size } from "constants/tokens";
import { MyHostsQuery, MyHostsQueryVariables } from "gql/generated/types";
import { GET_MY_HOSTS } from "gql/queries";
import { useSpruceConfig, useUpdateURLQueryParams } from "hooks";
import { HostStatus } from "types/host";
import { queryString } from "utils";
import { QueryParams } from "../types";
import { SpawnHostModal } from "./spawnHostButton/SpawnHostModal";

const { parseQueryString } = queryString;

export const SpawnHostButton: React.VFC = () => {
  const updateQueryParams = useUpdateURLQueryParams();
  const { data: myHostsData } = useQuery<MyHostsQuery, MyHostsQueryVariables>(
    GET_MY_HOSTS
  );

  const spruceConfig = useSpruceConfig();
  const { search } = useLocation();
  const initialOpen =
    parseQueryString(search)[QueryParams.SpawnHost] === "True";
  const [openModal, setOpenModal] = useState(initialOpen);
  const spawnAnalytics = useSpawnAnalytics();

  const maxHosts = spruceConfig?.spawnHost?.spawnHostsPerUser || 0;

  const nonTerminatedHosts = myHostsData?.myHosts.filter(
    (host) => host.status !== HostStatus.Terminated
  );
  const currentHostCount = nonTerminatedHosts?.length || 0;
  const reachedMaxNumHosts = currentHostCount >= maxHosts;
  useEffect(() => {
    if (!openModal) {
      updateQueryParams({ spawnHost: undefined });
    }
  }, [openModal, updateQueryParams]);

  return (
    <PaddedContainer>
      <Tooltip
        align="top"
        justify="middle"
        triggerEvent="hover"
        trigger={
          <PlusButton
            disabled={reachedMaxNumHosts}
            onClick={() => {
              setOpenModal(true);
              spawnAnalytics.sendEvent({
                name: "Opened the Spawn Host Modal",
              });
            }}
            data-cy="spawn-host-button"
          >
            Spawn a host
          </PlusButton>
        }
        enabled={reachedMaxNumHosts}
      >
        {`You have reached the maximum number of hosts (${maxHosts}). Delete some hosts to spawn more.`}
      </Tooltip>
      {openModal && <SpawnHostModal open={openModal} setOpen={setOpenModal} />}
    </PaddedContainer>
  );
};

const PaddedContainer = styled.div`
  padding: ${size.l} 0;
`;
