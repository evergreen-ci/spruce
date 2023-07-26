import { useQuery } from "@apollo/client";
import { getUserPatchesRoute } from "constants/routes";
import { OtherUserQuery, OtherUserQueryVariables } from "gql/generated/types";
import { GET_OTHER_USER } from "gql/queries";

export const useGetUserPatchesPageTitleAndLink = (
  userId: string,
  skip: boolean = false
) => {
  const { data } = useQuery<OtherUserQuery, OtherUserQueryVariables>(
    GET_OTHER_USER,
    { skip, variables: { userId } }
  );

  if (!data) {
    return null;
  }

  const { currentUser, otherUser } = data || {};
  const link = getUserPatchesRoute(userId);

  if (userId === currentUser.userId) {
    return { link, title: "My Patches" };
  }

  const otherUserDisplayName = otherUser.displayName ?? "";
  const possessiveModifier =
    otherUserDisplayName.slice(-1) === "s" ? "'" : "'s";

  return {
    link,
    title: `${otherUserDisplayName}${possessiveModifier} Patches`,
  };
};
