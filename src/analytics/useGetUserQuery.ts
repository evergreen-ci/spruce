import { useQuery } from "@apollo/client";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import get from "lodash/get";

export const useGetUserQuery = () => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  return get(data, "user.userId", null);
};
