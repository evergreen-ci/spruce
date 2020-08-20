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

  it("should display the status badge for a task (1)", () => {
    cy.visit(
      "/task/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48"
    );
    cy.dataCy("task-status-badge").contains("dispatched");
  });

  it("should display the status badge for a task (2)", () => {
    cy.visit("/task/evergreen_ubuntu1604_89/logs");
    cy.dataCy("task-status-badge").contains("Running");
  });

  it("should display the status badge for a task (3)", () => {
    cy.visit(
      "/task/patch-2-evergreen_ubuntu1604_dist_patch_33016573166a36bd5f46b4111151899d5c4e95b1_6ecedafb562343215a7ff297_20_05_27_21_39_46/logs?execution=1"
    );
    cy.dataCy("task-status-badge").contains("Blocked");
  });

  it("should display different executions", () => {
    cy.visit(
      "/task/logkeeper_ubuntu_test_edd78c1d581bf757a880777b00685321685a8e67_16_10_20_21_58_58/logs"
    );
    cy.dataCy("task-status-badge").contains("undispatched");
    cy.dataTestId("execution-select").click();
    cy.dataTestId("execution-0").click();
    cy.dataCy("task-status-badge").contains("success");
    cy.location("search").should("include", "execution=1");
  });
});
