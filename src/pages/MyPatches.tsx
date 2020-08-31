import { useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { getUserPatchesRoute } from "constants/routes";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";

export const MyPatches: React.FC = () => {
  const router = useHistory();
  const { data } = useQuery<GetUserQuery>(GET_USER);
  if (data) {
    router.replace(getUserPatchesRoute(data.user.userId));
  }
  return null;
};
