import { Operation } from "@apollo/client";
import * as ErrorReporting from "utils/errorReporting";
import { leaveBreadcrumbMapFn } from "./logGQLToSentryLink";

describe("leaveBreadcrumbLinkMapFn", () => {
  beforeEach(() => {
    jest.spyOn(ErrorReporting, "leaveBreadcrumb");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("leaveBreadcrumb function uses a list of secret fields to filter GQL req variables", () => {
    const assertLeaveBreadcrumbParams = (
      secretFields: string[],
      unfilteredVariables: Operation["variables"],
      filteredVariables: Operation["variables"],
    ) => {
      const operation = {
        operationName: "TestOperation",
        extensions: {},
        query: null,
        setContext: jest.fn(),
        getContext: jest.fn(),
      };
      const response = { data: { result: "Success" }, errors: null };

      const mappedFn = leaveBreadcrumbMapFn(
        { variables: unfilteredVariables, ...operation },
        secretFields,
      )(response);

      expect(mappedFn).toStrictEqual(response);

      expect(ErrorReporting.leaveBreadcrumb).toHaveBeenLastCalledWith(
        "Graphql Request",
        {
          operationName: operation.operationName,
          variables: filteredVariables,
          status: "OK",
          errors: null,
        },
        ErrorReporting.SentryBreadcrumb.HTTP,
      );
    };

    const variables = { id: 1, name: "test" };
    assertLeaveBreadcrumbParams(["id"], variables, {
      id: "REDACTED",
      name: "test",
    });
    assertLeaveBreadcrumbParams([], variables, variables);
    assertLeaveBreadcrumbParams(["na"], variables, variables);
    assertLeaveBreadcrumbParams(Object.keys(variables), variables, {
      id: "REDACTED",
      name: "REDACTED",
    });
  });
});
