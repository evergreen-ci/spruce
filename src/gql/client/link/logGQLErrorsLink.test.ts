import { GraphQLError } from "graphql";
import * as ErrorReporting from "utils/errorReporting";
import { reportingFn } from "./logGQLErrorsLink";

describe("reportingFn", () => {
  beforeEach(() => {
    jest.spyOn(ErrorReporting, "reportError");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("reportError should be called with secret fields redacted", () => {
    const secretFields = ["password", "creditCard"];
    const operation = {
      operationName: "exampleOperation",
      variables: {
        input: { password: "password123", creditCard: "1234567890123456" },
      },
      query: null,
      setContext: jest.fn(),
      getContext: jest.fn(),
      extensions: {},
    };
    const gqlErr = new GraphQLError("An error occurred", {
      path: ["a", "path", "1"],
    });

    reportingFn(secretFields, operation)(gqlErr);

    expect(ErrorReporting.reportError).toHaveBeenCalledTimes(1);
    expect(ErrorReporting.reportError).toHaveBeenCalledWith(expect.any(Error), {
      fingerprint: ["exampleOperation", "a", "path", "1"],
      tags: { operationName: "exampleOperation" },
      context: {
        gqlErr,
        variables: { input: { password: "REDACTED", creditCard: "REDACTED" } },
      },
    });
  });
});
