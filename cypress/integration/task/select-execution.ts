// / <reference types="Cypress" />

describe("Selecting Task Execution", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.visit(
      "/task/logkeeper_ubuntu_test_edd78c1d581bf757a880777b00685321685a8e67_16_10_20_21_58_58/logs"
    );
  });

  it("Should be able to switch to the new execution", () => {
    cy.dataCy("execution-select").click();
    cy.dataCy("execution-1").click();
    cy.dataCy("task-status-badge").contains("undispatched");
  });

  it("should display different executions", () => {
    cy.dataCy("task-status-badge").contains("undispatched");
    cy.dataCy("execution-select").click();
    cy.dataCy("execution-1").click();
    cy.dataCy("task-status-badge").contains("undispatched");
    cy.location("search").should("include", "execution=2");
  });
});
