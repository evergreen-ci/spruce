import { GET_OTHER_USER } from "gql/queries";
import {
  GetOtherUserQuery,
  GetOtherUserQueryVariables,
} from "gql/generated/types";
import { useQuery } from "@apollo/react-hooks";
import { getUserPatchesRoute } from "constants/routes";

export const useGetUserPatchesPageTitleAndLink = (userId: string) => {
  const { data, loading, error } = useQuery<
    GetOtherUserQuery,
    GetOtherUserQueryVariables
  >(GET_OTHER_USER, { variables: { userId } });
  const link = getUserPatchesRoute(userId);

  if (loading || error) {
    return { error, link, loading, title: "Patches" };
  }

  if (userId === data?.currentUser.userId) {
    return { error, link, loading, title: "My Patches" };
  }

  const otherUserDisplayName = data?.otherUser.displayName ?? "";
  const possessiveModifier =
    otherUserDisplayName.slice(-1) === "s" ? "'" : "'s";

  return {
    error,
    link,
    loading,
    title: `${otherUserDisplayName}${possessiveModifier} Patches`,
  };
};
