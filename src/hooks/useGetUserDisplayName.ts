import { useQuery } from "@apollo/client";
import { getUserPatchesRoute } from "constants/routes";
import {
  GetOtherUserQuery,
  GetOtherUserQueryVariables,
} from "gql/generated/types";
import { GET_OTHER_USER } from "gql/queries";

export const useGetUserDisplayName = (userId: string) => {
  const { data, loading, error } = useQuery<
    GetOtherUserQuery,
    GetOtherUserQueryVariables
  >(GET_OTHER_USER, { variables: { userId } });

  if (loading || error) {
    return { error, loading, displayName: "" };
  }

  const otherUserDisplayName = data?.otherUser.displayName ?? "";

  return {
    error,
    loading,
    displayName: `${otherUserDisplayName}`,
  };
};
