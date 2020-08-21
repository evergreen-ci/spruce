import React from "react";
import {
  RestartJasperMutation,
  RestartJasperMutationVariables,
} from "gql/generated/types";
import { Popconfirm } from "antd";
import { useMutation } from "@apollo/react-hooks";
import { RESTART_JASPER } from "gql/mutations";
import { useBannerDispatchContext } from "context/banners";
import { Button } from "components/Button";

interface Props {
  ids: string[];
  hostUrl?: string;
  isSingleHost: boolean;
}

export const RestartJasper: React.FC<Props> = ({ ids, hostUrl }) => {
  const dispatchBanner = useBannerDispatchContext();
  // RESTART JASPER MUTATION
  const [restartJasper, { loading: loadingRestartJasper }] = useMutation<
    RestartJasperMutation,
    RestartJasperMutationVariables
  >(RESTART_JASPER, {
    onCompleted() {
      dispatchBanner.successBanner(`Jasper was restarted`);
    },
    onError({ message }) {
      dispatchBanner.errorBanner(message);
    },
  });

  const onClickRestartJasperConfirm = () =>
    restartJasper({ variables: { hostIds: ids } });
  return (
    <Popconfirm
      title={`Restart Jasper for host ${hostUrl}?`}
      onConfirm={onClickRestartJasperConfirm}
      icon={null}
      placement="bottom"
      okText="Yes"
      okButtonProps={{ loading: loadingRestartJasper }}
      cancelText="No"
      cancelButtonProps={{ disabled: loadingRestartJasper }}
    >
      <Button dataCy="restart-jasper-button">Restart Jasper</Button>
    </Popconfirm>
  );
};
