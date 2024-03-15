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
    cy.dataCy("tasks-table").find("th").contains("Name").click();
    cy.location("search").should("contain", "sortBy=NAME");
    cy.location("search").should("contain", "sortDir=ASC");

    cy.dataCy("tasks-table").find("th").contains("Name").click();
    cy.location("search").should("contain", "sortBy=NAME");
    cy.location("search").should("contain", "sortDir=DESC");
  });
});
