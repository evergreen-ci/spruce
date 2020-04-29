import { waitForGQL } from "./networking";
import get from "lodash/get";

// used to test status and base status dropdown filters
export const clickingCheckboxUpdatesUrlAndRendersFetchedResults = ({
  selector = ".cy-checkbox",
  checkboxDisplayName,
  pathname,
  paramName,
  search,
  tableRow,
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
    tableRow,
  }).then(() => urlSearchParamsAreUpdated({ pathname, paramName, search }));
  cy.get("@target").click({ force: true });
  resultsAreFetchedAndRendered({
    queryName: name,
    responseName,
    requestVariables: [],
    tableRow,
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

  return waitForGQL("@gqlQuery", queryName, options);
};

export const resultsAreFetchedAndRendered = ({
  queryName,
  responseName,
  requestVariables,
  tableRow = ".ant-table-row",
} = {}) => {
  return assertQueryVariables(queryName, requestVariables).then(
    ({ response }) => {
      const numberOfResults = get(response, `body.data.${responseName}`, [])
        .length;
      if (numberOfResults === 0) {
        cy.get(tableRow).should("not.exist");
      } else {
        cy.get(tableRow)
          .invoke("toArray")
          .then((filteredResults) => {
            expect(filteredResults.length >= numberOfResults).eq(true);
          });
      }
    }
  );
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

/**
 * Asserts element existence based on value in xhr object
 * @param xhr request that determines element existence
 * @param resBodyPath path in xhr object containing information to base element existence
 * @param dataCyStr data-cy attribute for element
 * @param doesExist assert string for when element should exist
 * @param doesNotExist assert string for when element does not exist
 * @returns true if element exists and false otherwise
 *
 */
export const elementExistenceCheck = (
  xhr,
  resBodyPath,
  dataCyStr,
  doesExist = "not.be.empty",
  doesNotExist = "be.empty"
) => {
  const el = cy.dataCy(dataCyStr);
  if (get(xhr, resBodyPath)) {
    el.should(doesExist);
    return true;
  }
  el.should(doesNotExist);
  return false;
};
