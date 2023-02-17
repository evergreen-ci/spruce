import { GraphQLError } from "graphql";

export type ApolloMock<Data, Variables> = {
  request: {
    query: any;
    variables?: Variables;
  };
  result?: {
    data?: Data;
    errors?: GraphQLError[];
  };
  error?: Error;
};
