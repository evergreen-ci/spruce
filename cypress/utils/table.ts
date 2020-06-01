import get from "lodash/get";

export const assertScrollFetchAppend = (assertFetch) => {
  cy.get(".ant-table-row")
    .invoke("toArray")
    .then(($initialTasks) => {
      // need to overscroll to trigger fetch
      cy.get(".ant-table-body").scrollTo(0, "101%", { duration: 500 });
      assertFetch();
      cy.get(".ant-table-row").should(
        "have.length.greaterThan",
        $initialTasks.length
      );
    });
};

export const assertCountLabels = (
  filteredCountPath: string,
  totalCountPath: string,
  dataCyFilteredCount: string,
  dataCyTotalCount: string
) => {
  cy.get("@gqlQuery").then((xhr) => {
    const filteredCount = get(xhr, filteredCountPath);
    const totalCount = get(xhr, totalCountPath);
    cy.dataCy(dataCyFilteredCount).contains(`${filteredCount}`);
    cy.dataCy(dataCyTotalCount).contains(`${totalCount}`);
  });
};
