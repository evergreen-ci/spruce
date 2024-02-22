describe("Selecting Task Execution", () => {
  beforeEach(() => {
    cy.visit(
      "/task/logkeeper_ubuntu_test_edd78c1d581bf757a880777b00685321685a8e67_16_10_20_21_58_58/logs",
    );
    // Wait for page to finish loading.
    cy.contains("No logs found").should("exist");
  });

  it("Should take user to the latest execution if no execution is specified", () => {
    cy.location("search").should("include", "execution=1");
    cy.dataCy("execution-select").contains("Execution 2 (latest)");
    cy.dataCy("task-status-badge").contains("Will Run");
  });

  it("Toggling a different execution should change the displayed execution", () => {
    cy.location("search").should("include", "execution=1");
    cy.dataCy("execution-select").contains("Execution 2 (latest)");
    cy.dataCy("execution-select").should("have.attr", "aria-disabled", "false");
    cy.dataCy("execution-select").click();
    cy.dataCy("execution-0").click();
    cy.dataCy("task-status-badge").contains("Succeeded");
    cy.location("search").should("include", "execution=0");
  });
});
