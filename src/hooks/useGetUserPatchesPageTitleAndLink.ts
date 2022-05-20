import { useQuery } from "@apollo/client";
import { getUserPatchesRoute } from "constants/routes";
import {
  GetOtherUserQuery,
  GetOtherUserQueryVariables,
} from "gql/generated/types";
import { GET_OTHER_USER } from "gql/queries";

export const useGetUserPatchesPageTitleAndLink = (
  userId: string,
  skip: boolean = false
) => {
  const { data } = useQuery<GetOtherUserQuery, GetOtherUserQueryVariables>(
    GET_OTHER_USER,
    { variables: { userId }, skip }
  );
  const link = getUserPatchesRoute(userId);

  if (!data) {
    return null;
  }

  const { currentUser } = data || {};
  if (userId === currentUser.userId) {
    return { link, title: "My Patches" };
  }

  const otherUserDisplayName = data?.otherUser.displayName ?? "";
  const possessiveModifier =
    otherUserDisplayName.slice(-1) === "s" ? "'" : "'s";

  return {
    link,
    title: `${otherUserDisplayName}${possessiveModifier} Patches`,
  };
};
