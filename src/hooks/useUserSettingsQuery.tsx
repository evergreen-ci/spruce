import React from "react";
import { useBannerDispatchContext } from "context/banners";
import { useQuery } from "@apollo/react-hooks";
import {
  GetUserSettingsQuery,
  GetUserSettingsQueryVariables,
} from "gql/generated/types";
import { GET_USER_SETTINGS } from "gql/queries";
import { Skeleton } from "antd";

interface HookResult {
  data: GetUserSettingsQuery;
  loadingComp: JSX.Element;
}
export const useUserSettingsQuery = (): HookResult => {
  const dispatchBanner = useBannerDispatchContext();
  const { data, loading } = useQuery<
    GetUserSettingsQuery,
    GetUserSettingsQueryVariables
  >(GET_USER_SETTINGS, {
    onError(err) {
      dispatchBanner.errorBanner(
        `There was an error fetching your user settings: ${err.message}`
      );
    },
  });

  return { data, loadingComp: loading ? <Skeleton active /> : null };
};
