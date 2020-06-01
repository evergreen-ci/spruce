import { useQuery } from "@apollo/react-hooks";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { useHistory } from "react-router-dom";
import { getUserPatchesRoute } from "constants/routes";

export const MyPatches = () => {
  const router = useHistory();
  const { data } = useQuery<GetUserQuery>(GET_USER);
  if (data) {
    router.push(getUserPatchesRoute(data.user.userId));
  }
  return null;
};
