import { GetUserQuery, GetUserQueryVariables } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { ApolloMock } from "types/gql";

export const getUserMock: ApolloMock<GetUserQuery, GetUserQueryVariables> = {
  request: {
    query: GET_USER,
    variables: {},
  },
  result: {
    data: {
      user: {
        userId: "a",
        displayName: "A",
        emailAddress: "a@a.com",
      },
    },
  },
};
