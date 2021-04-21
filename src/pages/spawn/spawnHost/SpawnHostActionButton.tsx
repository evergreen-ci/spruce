import React, { useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { Size } from "@leafygreen-ui/button";
import { useSpawnAnalytics } from "analytics";
import Icon from "components/Icons";
import { PopconfirmWithCheckbox } from "components/Popconfirm";
import { PaddedButton } from "components/Spawn";
import { useToastContext } from "context/toast";
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
  const dispatchToast = useToastContext();

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
    pollInterval: 3000,
    onError: (e) => {
      dispatchToast.error(
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

  const spawnAnalytics = useSpawnAnalytics();

  const [updateSpawnHostStatus, { loading }] = useMutation<
    UpdateSpawnHostStatusMutation,
    UpdateSpawnHostStatusMutationVariables
  >(UPDATE_SPAWN_HOST_STATUS, {
    onCompleted() {
      dispatchToast.success(`Successfully triggered host status update!`);
      getMyHosts();
    },
    onError(err) {
      dispatchToast.error(
        `There was an error while updating your host: ${err.message}`
      );
    },
    refetchQueries: ["MyVolumes"],
  });

  const onClick = (a) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    spawnAnalytics.sendEvent({ name: "Change Host Status", status: a });
    updateSpawnHostStatus({
      variables: {
        hostId: host.id,
        action: a,
      },
    });
  };

  let checkboxLabel = "";
  if (host.noExpiration && host.distro?.isVirtualWorkStation) {
    checkboxLabel = `${copyPrefix} a workstation and unexpirable.`;
  } else if (host.noExpiration) {
    checkboxLabel = `${copyPrefix} is unexpirable.`;
  } else if (host.distro?.isVirtualWorkStation) {
    checkboxLabel = `${copyPrefix} a virtual workstation.`;
  }

  return (
    <>
      {action ? (
        <PaddedButton
          disabled={loading}
          glyph={<Icon glyph={glyph} />}
          size={Size.XSmall} // @ts-expect-error
          onClick={onClick(action)}
        />
      ) : null}
      <PopconfirmWithCheckbox
        onConfirm={onClick(SpawnHostStatusActions.Terminate)}
        title={`Delete host ${host.displayName || host.id}?`}
        checkboxLabel={checkboxLabel}
      >
        {/* @ts-expect-error */}
        <PaddedButton glyph={<Icon glyph="Trash" />} size={Size.XSmall} />
      </PopconfirmWithCheckbox>
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

const copyPrefix = "I understand that this host is";
