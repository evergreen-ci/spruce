// / <reference types="Cypress" />

describe("Task Page Route", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("User is redirected to logs if they land on /task/{taskID}", () => {
    cy.visit("/task/taskID");
    cy.location("pathname").should("include", "/task/taskID/logs");
  });

  it("Browser history is replaced when user lands on /task/{taskID}", () => {
    cy.visit("/random");
    cy.visit("/task/taskID");
    cy.go("back");
    cy.location("pathname").should("eq", "/random");
  });

  it("User is not redirected if they land on /task/{taskID}/files", () => {
    cy.visit("/task/taskID/files");
    cy.location("pathname").should("eq", "/task/taskID/files");
  });

  it("should display the status badge for a task", () => {
    cy.visit(
      "/task/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48"
    );
    cy.dataCy("page-title").contains("dispatched");
  });
});
