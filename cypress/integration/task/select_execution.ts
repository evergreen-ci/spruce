describe("Selecting Task Execution", () => {
  it("Should take user to the latest execution if no execution is specified", () => {
    cy.visit(
      "/task/logkeeper_ubuntu_test_edd78c1d581bf757a880777b00685321685a8e67_16_10_20_21_58_58/logs"
    );
    cy.dataCy("execution-select").contains("(latest)");
    cy.dataCy("task-status-badge").contains("Will Run");
    cy.location("search").should("include", "execution=1");
  });

  it("Toggling a different execution should change the displayed execution", () => {
    cy.dataCy("execution-select").click();
    cy.dataCy("execution-0").click();
    cy.dataCy("task-status-badge").contains("Succeeded");
    cy.location("search").should("include", "execution=0");
  });
});
