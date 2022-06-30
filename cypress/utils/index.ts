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
 * @param dataCyTableRows dat-cy for table rows
 */
export const clickOnPageSizeBtnAndAssertURLandTableSize = (
  pageSize: number,
  dataCyTableRows: string
) => {
  cy.get("button[aria-labelledby='page-size-select']").click();
  cy.contains(`${pageSize} / page`).click();
  cy.get(dataCyTableRows).should("have.length.of.at.most", pageSize);
  cy.location("search").should("include", `limit=${pageSize}`);
};

/**
 * Given the data-cy of an antd select and the text of option, this function will open the select and click on
 * that option.
 * @param dataCy dataCy of the select to be open
 * @param option text of the desired option
 */
export const selectAntdOption = (dataCy: string, option: string) => {
  // open select
  cy.dataCy(dataCy).click();
  // click on option
  cy.get(".ant-select-dropdown :not(.ant-select-dropdown-hidden)")
    .find(".ant-select-item-option")
    .each((el) => {
      if (el.text().includes(option)) {
        cy.wrap(el).click();
      }
    });
  // make sure select is closed
  cy.get(".ant-select-dropdown :not(.ant-select-dropdown-hidden)").should(
    "not.be.visible"
  );
};
