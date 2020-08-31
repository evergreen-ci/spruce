import { useQuery } from "@apollo/client";
import get from "lodash/get";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";

export const useGetUserQuery = () => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  return get(data, "user.userId", null);
};
