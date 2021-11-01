import get from "lodash/get";
import { waitForGQL } from "./networking";

// used to test status and base status dropdown filters
export const clickingCheckboxUpdatesUrlAndRendersFetchedResults = ({
  checkboxDisplayName,
  pathname,
  paramName,
  search,
  openFilter,
}) => {
  if (openFilter) {
    openFilter();
  }
  cy.getInputByLabel(checkboxDisplayName).check({ force: true });
  cy.dataCy("filter-button").click();
  urlSearchParamsAreUpdated({ pathname, paramName, search });
  if (openFilter) {
    openFilter();
  }
  cy.getInputByLabel(checkboxDisplayName).uncheck({ force: true });
  cy.dataCy("filter-button").click({ force: true });
  urlSearchParamsAreUpdated({ pathname, paramName, search: null });
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
} = {}) => {
  assertQueryVariables(queryName, requestVariables);
  return cy.get("@gqlQuery").then(({ response }) => {
    const numberOfResults = get(response, `body.data.${responseName}`, [])
      .length;
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

/**
 * Asserts Page url query param and table row names after clicking on a pagination button
 * @param dataCyPageBtn data-cy for next/prev page button from the pagination component
 * @param tableDisplayNames ordered list of names that should occur in table rows
 * @param pageQueryParamValue page query param value that is present after clicking the next/prev page button
 */
export const clickOnPageBtnAndAssertURLandTableResults = (
  dataCyPageBtn,
  tableDisplayNames,
  pageQueryParamValue
) => {
  cy.get(dataCyPageBtn).should("be.visible");
  cy.get(dataCyPageBtn).should("not.be.disabled");
  cy.get(dataCyPageBtn).click();
  tableDisplayNames.forEach((displayName) => {
    cy.contains(displayName);
  });
  cy.location("search").should("include", `page=${pageQueryParamValue}`);
};

/**
 * Assert limit query param and table length after clicking on a page size button
 * @param pageSize new page size
 * @param dataCyPageSizeSelectorToggle data-cy for page size dropdown toggle
 * @param dataCyPageSizeBtn data-cy for page size button to select page size
 * @param dataCyTableRows dat-cy for table rows
 */
export const clickOnPageSizeBtnAndAssertURLandTableSize = (
  pageSize,
  dataCyPageSizeSelectorToggle,
  dataCyPageSizeBtn,
  dataCyTableRows
) => {
  cy.dataCy(dataCyPageSizeSelectorToggle).click();
  cy.dataCy(dataCyPageSizeBtn).click();
  cy.get(dataCyTableRows).should("have.length.of.at.most", pageSize);
  cy.location("search").should("include", `limit=${pageSize}`);
};
