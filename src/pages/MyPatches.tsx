import { useQuery } from "@apollo/client";
import { getUserPatchesRoute } from "constants/routes";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { Redirect } from "react-router-dom";

export const MyPatches: React.VFC = () => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  if (data) {
    return <Redirect to={getUserPatchesRoute(data.user.userId)} />;
  }
  return null;
};
