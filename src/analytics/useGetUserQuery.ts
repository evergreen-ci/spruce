import { useQuery } from "@apollo/client";
import get from "lodash/get";
import { UserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";

export const useGetUserQuery = () => {
  const { data } = useQuery<UserQuery>(GET_USER);
  return get(data, "user.userId", null);
};
