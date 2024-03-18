import { OperationDefinitionNode } from "graphql";
import { SECRET_FIELDS } from "gql/queries";

export const secretFieldsReq = {
  credentials: "include" as RequestCredentials,
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({
    operationName: (SECRET_FIELDS.definitions[0] as OperationDefinitionNode)
      .name.value,
    query: SECRET_FIELDS.loc?.source.body,
    variables: {},
  }),
  method: "POST",
  mode: "cors" as RequestMode,
};
