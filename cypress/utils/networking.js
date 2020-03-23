import get from "lodash/get";
// this fn will wait until a gql query with queryName is executed
// with the specified options on the aliased route
// alias: is a cypress route alias created from cy.route(...).as(...)
// queryName: is the query being waited on
// options: is a dictionary where the key is a string path in the cy
// xhr object and value is a string being matched on
export const waitForGQL = (alias, queryName, options = {}) => {
  const waitOnce = () => {
    cy.wait(alias).then(xhr => {
      const optionsMatch = Object.entries(options).reduce(
        (accum, [key, val]) => accum && get(xhr, key) === val,
        true
      );
      if (
        get(xhr, "requestBody.operationName") !== queryName ||
        !optionsMatch
      ) {
        waitOnce();
      }
    });
  };

  waitOnce();
};
