import React from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import Icon from "components/icons/Icon";
import { useBannerDispatchContext } from "context/banners";
import {
  UpdateSpawnHostStatusMutation,
  UpdateSpawnHostStatusMutationVariables,
  SpawnHostStatusActions,
} from "gql/generated/types";
import { UPDATE_SPAWN_HOST_STATUS } from "gql/mutations";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";

export const SpawnHostActionButton: React.FC<{ host: MyHost }> = ({ host }) => {
  const dispatchBanner = useBannerDispatchContext();

  const glyph = mapStatusToGlyph[host.status];
  const action = mapStatusToAction[host.status];

  const [updateSpawnHostStatus, { loading }] = useMutation<
    UpdateSpawnHostStatusMutation,
    UpdateSpawnHostStatusMutationVariables
  >(UPDATE_SPAWN_HOST_STATUS, {
    onCompleted() {
      dispatchBanner.successBanner(`Successfully updated host status!`);
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
