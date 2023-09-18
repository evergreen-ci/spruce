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

// Alias query if operationName matches
export const aliasQuery = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string
): void => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Query`;
  }
};

export const aliasMutation = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string
): void => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Mutation`;
  }
};
