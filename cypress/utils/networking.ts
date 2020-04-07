import get from "lodash/get";
// this fn will wait until a gql query with queryName is executed
// with the specified options on the aliased route
// Return value: Cypress chainable object
// Params:
//  alias: Cypress route alias created from cy.route(...).as(...)
//  queryName: Query being waited on
//  options: Dictionary where the key is a string path in the cy
//  xhr object and value is either type string or function.
//  If the options entry value is a string, waitForGQL evaluates if
//  the value in the xhr object at the options entry key (string path)
//  equals the options entry value. If the options entry value is a function,
//  then the value in the xhr object at the options entry key is passed to the function
//  and the comparison is resolved by the truthiness of the function's return value
// Example:
//  this function call will wait for a GetTask query where the value at "responseBody.data.task.reliesOn" exists
//      waitForGQL("@gqlQuery", "GetTask", {
//        "responseBody.data.task.reliesOn": v => v
//      })
//  this function call will wait for a GetTask query where the value at "responseBody.data.task.displayName" is task1
//      waitForGQL("@gqlQuery", "GetTask", {
//        "responseBody.data.task.displayName": "task1"
//      })
//
export const waitForGQL = (alias, queryName, options = {}) => {
  const waitOnce = () => {
    return cy.wait(alias).then(xhr => {
      const optionsMatch = Object.entries(options).reduce(
        (accum, [key, val]) => {
          const xhrValueAtPath = get(xhr, key);
          const match =
            typeof val === "function"
              ? val(xhrValueAtPath)
              : xhrValueAtPath === val;
          return accum && match;
        },
        true
      );
      if (
        get(xhr, "requestBody.operationName") !== queryName ||
        !optionsMatch
      ) {
        return waitOnce();
      }
    });
  };

  return waitOnce();
};
