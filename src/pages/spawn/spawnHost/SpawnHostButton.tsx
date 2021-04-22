import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Tooltip } from "antd";
import { useLocation } from "react-router";
import { useSpawnAnalytics } from "analytics";
import { PlusButton } from "components/Spawn";
import {
  MyHostsQuery,
  MyHostsQueryVariables,
  GetSpruceConfigQuery,
  GetSpruceConfigQueryVariables,
} from "gql/generated/types";
import { GET_MY_HOSTS, GET_SPRUCE_CONFIG } from "gql/queries";
import { SpawnHostModal } from "pages/spawn/spawnHost/index";
import { queryString } from "utils";

const { parseQueryString } = queryString;
export const SpawnHostButton = () => {
  const { data: myHostsData } = useQuery<MyHostsQuery, MyHostsQueryVariables>(
    GET_MY_HOSTS
  );
  const { data: spruceConfigData } = useQuery<
    GetSpruceConfigQuery,
    GetSpruceConfigQueryVariables
  >(GET_SPRUCE_CONFIG);
  const { search } = useLocation<{ search: string }>();
  const queryParams = parseQueryString(search);
  const shouldSpawnHost = queryParams.spawnHost === "True";
  const [openModal, setOpenModal] = useState(shouldSpawnHost);
  const spawnAnalytics = useSpawnAnalytics();

  const maxHosts =
    spruceConfigData?.spruceConfig.spawnHost.spawnHostsPerUser || 0;
  const currentHostCount = myHostsData?.myHosts.length || 0;
  const reachedMaxNumHosts = currentHostCount >= maxHosts;

  return (
    <PaddedContainer>
      <Tooltip
        title={
          reachedMaxNumHosts
            ? `You have reached the maximum number of hosts (${maxHosts}). Delete some hosts to spawn more.`
            : undefined
        }
      >
        <PlusButton
          disabled={reachedMaxNumHosts}
          onClick={() => {
            setOpenModal(true);
            spawnAnalytics.sendEvent({ name: "Opened the Spawn Host Modal" });
          }}
          data-cy="spawn-host-button"
        >
          Spawn a host
        </PlusButton>
      </Tooltip>
      <SpawnHostModal
        visible={openModal}
        onCancel={() => setOpenModal(false)}
      />
    </PaddedContainer>
  );
};

const PaddedContainer = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;
`;
