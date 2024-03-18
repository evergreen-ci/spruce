describe("Execution task table", () => {
  const pathExecutionTasks =
    "/task/mci_ubuntu1604_display_asdf_patch_a1d2c8f70bf5c543de8b9641ac1ec08def1ddb26_5f74d99ab2373627c047c5e5_20_09_30_19_16_47/execution-tasks";

  beforeEach(() => {
    cy.visit(pathExecutionTasks);
  });

  it("Should have a default sort order applied", () => {
    cy.location("search").should("contain", "sortBy=STATUS");
    cy.location("search").should("contain", "sortDir=ASC");
  });

  it("Updates the url when column headers are clicked", () => {
    const nameSortControl = "button[aria-label='Sort by Name']";
    cy.get(nameSortControl).click();
    cy.location("search").should("contain", "STATUS%3AASC%3BNAME%3AASC");

    cy.get(nameSortControl).click();
    cy.location("search").should("contain", "STATUS%3AASC%3BNAME%3ADESC");
  });
});
