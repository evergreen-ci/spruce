import { CyHttpMessages } from "cypress/types/net-stubbing";

// Utility to match GraphQL  based on the operation name
export const hasOperationName = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string
): boolean => {
  const { body } = req;
  return (
    Object.prototype.hasOwnProperty.call(body, "operationName") &&
    body.operationName === operationName
  );
};
export const isMutation = (req: CyHttpMessages.IncomingHttpRequest) =>
  req.body.query?.startsWith("mutation");

export const GQL_URL = "http://localhost:9090/graphql/query";
