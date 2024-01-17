// used to test status and base status dropdown filters
export const clickingCheckboxUpdatesUrlAndRendersFetchedResults = ({
  checkboxDisplayName,
  openFilter,
  paramName,
  pathname,
  search,
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

export const urlSearchParamsAreUpdated = ({ paramName, pathname, search }) => {
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
  pageQueryParamValue: number,
) => {
  cy.dataCy(dataCyPageBtn).first().should("be.visible");
  cy.dataCy(dataCyPageBtn).first().should("not.be.disabled");
  cy.dataCy(dataCyPageBtn).first().click({ force: true });
  tableDisplayNames.forEach((displayName) => {
    cy.contains(displayName);
  });
  cy.location("search").should("include", `page=${pageQueryParamValue}`);
};

/**
 * Assert limit query param and table length after clicking on a page size button
 * @param pageSize new page size
 * @param dataCyTableRows data-cy for table rows
 */
export const clickOnPageSizeBtnAndAssertURLandTableSize = (
  pageSize: number,
  dataCyTableRows: string,
) => {
  cy.get("button[aria-labelledby='page-size-select']").click();
  cy.contains(`${pageSize} / page`).click();
  cy.get(dataCyTableRows).should("have.length.of.at.most", pageSize);
  cy.location("search").should("include", `limit=${pageSize}`);
};

/**
 * Save a settings page that has a button with the 'save-settings-button' data-cy attribute.
 */
export const clickSave = () => {
  cy.dataCy("save-settings-button")
    .should("not.have.attr", "aria-disabled", "true")
    .click();
};

/**
 * Wait for the AntD task table to fully render and not be in a loading state
 * This function helps ensure table column header button clicks register
 */
export const waitForTaskTable = () => {
  cy.dataCy("tasks-table")
    .should("be.visible")
    .should("not.have.attr", "data-loading", "true");
};
