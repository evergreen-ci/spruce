import { waitForGQL } from "./networking";

// used to test status and base status dropdown filters
export const clickingCheckboxUpdatesUrlAndRendersFetchedResults = ({
  selector = ".cy-checkbox",
  checkboxDisplayName,
  pathname,
  paramName,
  search,
  query: { name, responseName, requestVariables },
}) => {
  cy.get(selector)
    .contains(checkboxDisplayName)
    .as("target")
    .click({ force: true });
  resultsAreFetchedAndRendered({
    queryName: name,
    responseName,
    requestVariables,
  }).then(() => urlSearchParamsAreUpdated({ pathname, paramName, search }));
  cy.get("@target").click({ force: true });
  resultsAreFetchedAndRendered({
    queryName: name,
    responseName,
    requestVariables: [],
  }).then(() =>
    urlSearchParamsAreUpdated({ pathname, paramName, search: null })
  );
};

export const assertQueryVariables = (queryName, variables = {}) => {
  const options = {};
  Object.entries(variables).forEach(([variable, value]) => {
    if (Array.isArray(value)) {
      options[`requestBody.variables[${variable}]`] = (statusQueryVar) => {
        const statusesSet = new Set(value);
        return (
          Array.isArray(statusQueryVar) &&
          statusQueryVar.length === statusesSet.size &&
          statusQueryVar.reduce((accum, s) => accum && statusesSet.has(s), true)
        );
      };
    } else {
      options[`requestBody.variables[${variable}]`] = value;
    }
  });
  waitForGQL("@gqlQuery", queryName, options);
};

export const resultsAreFetchedAndRendered = ({
  queryName,
  responseName,
  requestVariables,
} = {}) => {
  assertQueryVariables(queryName, requestVariables);
  return cy.get("@gqlQuery").then(({ response }) => {
    const numberOfResults = response.body.data[responseName].length;
    if (numberOfResults === 0) {
      cy.get(".ant-table-row").should("not.exist");
    } else {
      cy.get(".ant-table-row")
        .invoke("toArray")
        .then((filteredResults) => {
          expect(filteredResults.length >= numberOfResults).eq(true);
        });
    }
  });
};

export const urlSearchParamsAreUpdated = ({ pathname, paramName, search }) => {
  cy.location().should((loc) => {
    expect(loc.pathname).to.equal(pathname);
    if (search === null) {
      expect(loc.search).to.not.include(paramName);
    } else {
      expect(loc.search).to.include(search);
    }
  });
};
