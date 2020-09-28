import React, { useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import Icon from "components/icons/Icon";
import { useBannerDispatchContext } from "context/banners";
import {
  UpdateSpawnHostStatusMutation,
  UpdateSpawnHostStatusMutationVariables,
  SpawnHostStatusActions,
  MyHostsQuery,
  MyHostsQueryVariables,
} from "gql/generated/types";
import { UPDATE_SPAWN_HOST_STATUS } from "gql/mutations";
import { GET_MY_HOSTS } from "gql/queries";
import { useNetworkStatus } from "hooks";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";

export const SpawnHostActionButton: React.FC<{ host: MyHost }> = ({ host }) => {
  const dispatchBanner = useBannerDispatchContext();

  const glyph = mapStatusToGlyph[host.status];
  const action = mapStatusToAction[host.status];

  // When the UPDATE_SPAWN_HOST_STATUS mutation occurs the host state is not immediately updated, It gets updated a few seconds later.
  // Since the GET_MY_HOSTS query on this components parent polls at a slower rate, this component triggers a poll at a faster interval for that
  // query when it returns an updated host status the polling is halted. This allows the query to poll slowly and not utilize unnecessary bandwith
  // except when an action is performed and we need to fetch updated data.
  const [getMyHosts, { startPolling, stopPolling }] = useLazyQuery<
    MyHostsQuery,
    MyHostsQueryVariables
  >(GET_MY_HOSTS, {
    pollInterval: 1000,
    onError: (e) => {
      dispatchBanner.errorBanner(
        `There was an error loading your spawn hosts: ${e.message}`
      );
    },
  });
  useNetworkStatus(startPolling, stopPolling);

  // Stop polling when we get updated host data
  useEffect(() => {
    if (stopPolling) {
      stopPolling();
    }
  }, [host]); // eslint-disable-line react-hooks/exhaustive-deps

  const [updateSpawnHostStatus, { loading }] = useMutation<
    UpdateSpawnHostStatusMutation,
    UpdateSpawnHostStatusMutationVariables
  >(UPDATE_SPAWN_HOST_STATUS, {
    onCompleted() {
      dispatchBanner.successBanner(
        `Successfully triggered host status update!`
      );
      getMyHosts();
    },
    onError(err) {
      dispatchBanner.errorBanner(
        `There was an error while updating your host: ${err.message}`
      );
    },
  });

  const onClick = (a) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatchBanner.clearAllBanners();
    updateSpawnHostStatus({
      variables: {
        hostId: host.id,
        action: a,
      },
    });
  };
  return (
    <>
      {action ? (
        <PaddedButton
          disabled={loading}
          glyph={<Icon glyph={glyph} />}
          size={Size.XSmall}
          onClick={onClick(action)}
        />
      ) : null}
      <PaddedButton
        onClick={onClick(SpawnHostStatusActions.Terminate)}
        glyph={<Icon glyph="Trash" />}
        size={Size.XSmall}
      />
    </>
  );
};
const mapStatusToAction = {
  [HostStatus.Running]: SpawnHostStatusActions.Stop,
  [HostStatus.Stopped]: SpawnHostStatusActions.Start,
};

const mapStatusToGlyph = {
  [HostStatus.Running]: "Pause",
  [HostStatus.Stopped]: "Play",
};

const PaddedButton = styled(Button)`
  margin-left: 5px;
  margin-right: 5px;
  flex-grow: 0;
`;
