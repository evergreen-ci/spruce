// / <reference types="Cypress" />

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
  urlSearchParamsAreUpdated({ pathname, paramName, search });
  if (openFilter) {
    openFilter();
  }
  cy.getInputByLabel(checkboxDisplayName).uncheck({ force: true });
  urlSearchParamsAreUpdated({ pathname, paramName, search: null });
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
 * Asserts Page url query param and table row names after clicking on a pagination button
 * @param dataCyPageBtn data-cy for next/prev page button from the pagination component
 * @param tableDisplayNames ordered list of names that should occur in table rows
 * @param pageQueryParamValue page query param value that is present after clicking the next/prev page button
 */
export const clickOnPageBtnAndAssertURLandTableResults = (
  dataCyPageBtn: string,
  tableDisplayNames: string[],
  pageQueryParamValue: number
) => {
  cy.get(dataCyPageBtn).should("be.visible");
  cy.get(dataCyPageBtn).should("not.be.disabled");
  cy.get(dataCyPageBtn).click({ force: true });
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
  pageSize: number,
  dataCyPageSizeSelectorToggle: string,
  dataCyPageSizeBtn: string,
  dataCyTableRows: string
) => {
  cy.dataCy(dataCyPageSizeSelectorToggle).click();
  cy.dataCy(dataCyPageSizeBtn).click();
  cy.get(dataCyTableRows).should("have.length.of.at.most", pageSize);
  cy.location("search").should("include", `limit=${pageSize}`);
};
