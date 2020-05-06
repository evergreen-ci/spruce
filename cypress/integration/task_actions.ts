/// <reference types="Cypress" />

describe("Task Action Buttons", function() {
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Some buttons should be disabled and others should be clickable. Clicking on buttons produces banners.", () => {
    cy.visit(
      "/task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/logs"
    );
    cy.dataCy("schedule-task").should("have.css", "pointer-events", "none");
    cy.dataCy("restart-task").click();
    cy.dataCy("banner").contains("Task scheduled to restart");
    cy.dataCy("ellipsis-btn").click();
    cy.dataCy("unschedule-task").click();
    cy.dataCy("banner").contains("Task marked as unscheduled");
    cy.dataCy("ellipsis-btn").click();
    cy.dataCy("abort-task").should("have.css", "pointer-events", "none");
    cy.dataCy("prioritize-task").click();
    cy.get(".ant-input-number-input")
      .clear()
      .type("99");
    cy.get(".ant-btn.ant-btn-primary.ant-btn-sm")
      .contains("Set")
      .click({ force: true });
    cy.dataCy("banner").contains("Priority for task updated to 99");
    cy.dataCy("schedule-task").click();
    cy.dataCy("banner").contains(
      "Error scheduling task: GraphQL error: error activating dependency for evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48 with id evergreen_ubuntu1604_test_graphql_5e823e1f28baeaa22ae00823d83e03082cd148ab_20_02_20_20_37_06: document not found"
    );
    cy.dataCy("banner").should("have.length", 4);
    cy.dataCy("ellipsis-btn").click();
    cy.visit(
      "task/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48"
    );
    cy.dataCy("ellipsis-btn").click();
    cy.dataCy("abort-task").click();
    cy.dataCy("banner").contains("Task aborted");
    cy.dataCy("banner").should("have.length", 1);
  });
});
