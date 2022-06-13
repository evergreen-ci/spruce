import { useQuery } from "@apollo/client";
import { Navigate } from "react-router-dom";
import { getUserPatchesRoute } from "constants/routes";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";

export const MyPatches: React.VFC = () => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  if (data) {
    return <Navigate to={getUserPatchesRoute(data.user.userId)} />;
  }
  return null;
};
