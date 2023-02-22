import { DocumentNode, GraphQLError } from "graphql";

export type ApolloMock<Data, Variables> = {
  request: {
    query: DocumentNode;
    variables?: Variables;
  };
  result?: {
    data?: Data;
    errors?: GraphQLError[];
  };
  error?: Error;
};
