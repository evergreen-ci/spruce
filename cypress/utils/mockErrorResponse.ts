import { hasOperationName } from "./graphql-test-utils";
import { GQL_URL } from "../constants";

interface Args {
  errorMessage: string;
  path?: string;
  operationName?: string;
  errorCode?:
    | "INTERNAL_SERVER_ERROR"
    | "RESOURCE_NOT_FOUND"
    | "FORBIDDEN"
    | "INPUT_VALIDATION_ERROR";
}

// mockErrorResponse returns a graphql query with an error message.
// Call mockErrorResponse before performing action that dispatches XHR request.
// @param operationName mock the error response when the request contains the supplied value
// @param errorMessage message on error response
// @param errorCode error code on error response
// @param path path value on error response
export const mockErrorResponse = ({
  errorCode = "INTERNAL_SERVER_ERROR",
  errorMessage,
  operationName = "",
  path = "i am a path", // the name of the query
}: Args) => {
  cy.intercept("POST", GQL_URL, (req) => {
    if (!operationName || hasOperationName(req, operationName)) {
      req.reply((res) => {
        res.body = {
          errors: [
            {
              message: errorMessage,
              path: [path],
              extensions: { code: errorCode },
            },
          ],
          data: null,
        };
      });
    }
  });
};
