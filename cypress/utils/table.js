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
