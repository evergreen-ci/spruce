import { waitForGQL } from "./networking";

// used to test status and base status dropdown filters
export const clickingCheckboxFetchesFilteredTasksAndUpdatesUrl = ({
  selector = ".cy-checkbox",
  checkboxDisplayName,
  pathname,
  paramName,
  search,
  query: { name, reqBodyVariable, value, responseName },
}) => {
  cy.get(selector)
    .contains(checkboxDisplayName)
    .as("target")
    .click();
  filteredTasksAreFetchedAndRendered({
    queryName: name,
    reqBodyVariable,
    value,
    responseName,
  }).then(() => urlSearchParamsAreUpdated({ pathname, paramName, search }));
  cy.get("@target").click({ force: true });
  filteredTasksAreFetchedAndRendered({
    queryName: name,
    reqBodyVariable,
    value,
    responseName,
  }).then(() =>
    urlSearchParamsAreUpdated({ pathname, paramName, search: null })
  );
};

export const filteredTasksAreFetchedAndRendered = ({
  reqBodyVariable,
  value,
  queryName,
  responseName,
} = {}) => {
  const options = {};
  if (reqBodyVariable && value) {
    options[`request.body.variables[${reqBodyVariable}]`] = value;
  }
  waitForGQL("@gqlQuery", queryName, options);
  return cy.get("@gqlQuery").then(({ response }) => {
    const numberOfResults = response.body.data[responseName].length;
    if (numberOfResults === 0) {
      cy.get(".ant-table-row").should("not.exist");
    } else {
      cy.get(".ant-table-row")
        .invoke("toArray")
        .then((filteredResults) => {
          expect(numberOfResults).eq(filteredResults.length);
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
