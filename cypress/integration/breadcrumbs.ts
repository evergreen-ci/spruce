// / <reference types="Cypress" />

describe("TaskBreadcrumb", () => {
  const taskRoute =
    "/task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.listenGQL();
  });

  it("Shows tasks display name", () => {
    cy.visit(taskRoute);
    cy.get("#bc-task").should("include.text", "test-model");
  });

  it("Shows the patches name", () => {
    cy.get("#bc-patch").should("include.text", "Patch 2567");
  });

  it("Clicking on the patch breadcrumb goes to patch for task", () => {
    cy.visit(taskRoute);
    cy.get("#bc-patch").click();
    cy.url().should("include", "/version/5e4ff3abe3c3317e352062e4");
  });

  it("Clicking 'My Patches' breadcrumb goes to the user's patches route", () => {
    cy.visit(taskRoute);
    cy.get("#bc-my-patches").click();
    cy.url().should("include", "/user/admin/patches");
  });
});

describe("PatchBreadcrumb", () => {
  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Shows the patches name", () => {
    cy.visit("/version/5e4ff3abe3c3317e352062e4");
    cy.get("#bc-patch").should("include.text", "Patch 2567");
  });

  it("Clicking 'My Patches' goes to user's patches route", () => {
    cy.get("#bc-my-patches").click();
    cy.url().should("include", "/user/admin/patches");
  });
});
