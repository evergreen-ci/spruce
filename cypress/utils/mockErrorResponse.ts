interface Args {
  errorMessage: string;
  path?: string;
  errorCode?:
    | "INTERNAL_SERVER_ERROR"
    | "RESOURCE_NOT_FOUND"
    | "FORBIDDEN"
    | "INPUT_VALIDATION_ERROR";
}

// mockErrorResponse returns a graphql query with an error message.
// Use this to test error responses from queries and mutations.
// Call mockErrorResponse before performing action that dispatches XHR request.
export const mockErrorResponse = ({
  errorMessage,
  errorCode = "INTERNAL_SERVER_ERROR",
  path = "i am a path", // the name of the query
}: Args) => {
  cy.server();
  cy.route({
    method: "POST",
    url: "/graphql/query",
    response: {
      errors: [
        {
          message: errorMessage,
          path: [path],
          extensions: { code: errorCode },
        },
      ],
      data: null,
    },
  });
};
