/// <reference types="Cypress" />

const taskRoute =
  "/task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";

describe("TaskBreadcrumb", function() {
  before(() => {
    cy.login();
  });

  it("Shows tasks display name", function() {
    cy.visit(taskRoute);
    cy.get("#bc-task").should("include.text", "test-model");
  });

  it("Shows the patches name", function() {
    cy.get("#bc-patch").should("include.text", "Patch 2567");
  });

  it("Clicking on the patch breadcrumb goes to patch for task", function() {
    cy.login();
    cy.visit(taskRoute);
    cy.get("#bc-patch").click();
    cy.url().should("include", "/patch/5e4ff3abe3c3317e352062e4");
  });

  it("Clicking 'My Patches' breadcrumb goes to /my-patches route", function() {
    cy.login();
    cy.visit(taskRoute);
    cy.get("#bc-my-patches").click();
    cy.url().should("include", "/my-patches");
  });
});

describe("PatchBreadcrumb", function() {
  beforeEach(() => {
    cy.login();
    cy.visit("/patch/5e4ff3abe3c3317e352062e4");
  });

  it("Shows the patches name", function() {
    cy.get("#bc-patch").should("include.text", "Patch 2567");
  });

  it("Clicking 'My Patches' goes to /my-patches route", function() {
    cy.get("#bc-my-patches").click();
    cy.url().should("include", "/my-patches");
  });
});
