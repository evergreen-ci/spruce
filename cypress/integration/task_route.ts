// / <reference types="Cypress" />

describe("Task Page Route", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("shouldn't get stuck in a redirect loop when visiting the task page and trying to navigate to a previous page", () => {
    cy.visit("/random");
    cy.visit("/task/taskID");
    cy.go("back");
    cy.location("pathname").should("eq", "/random");
  });

  it("shoul not be redirected if they land on a task page with a tab supplied", () => {
    cy.visit("/task/taskID/files");
    cy.location("pathname").should("eq", "/task/taskID/files");
  });

  it("should display an appropriate status badge when visiting task pages", () => {
    cy.visit(
      "/task/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48"
    );
    cy.dataCy("task-status-badge").contains("Dispatched");
    cy.visit("/task/evergreen_ubuntu1604_89/logs");
    cy.dataCy("task-status-badge").contains("Running");
  });

  it("should display a blocked status badge when visiting task pages that have unmet dependencies", () => {
    cy.visit(
      "/task/patch-2-evergreen_ubuntu1604_dist_patch_33016573166a36bd5f46b4111151899d5c4e95b1_6ecedafb562343215a7ff297_20_05_27_21_39_46"
    );
    cy.dataCy("task-status-badge").contains("Blocked");
  });
});
