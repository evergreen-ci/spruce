/// <reference types="Cypress" />

const taskRoute =
  "/task/evergreen_lint_generate_lint_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";

describe("TaskBreadcrumb", function() {
  before(() => {
    cy.login();
  });

  it("Shows tasks display name", function() {
    cy.visit(taskRoute);
    cy.get("span[id=bc-task]").should("include.text", "generate-lint");
  });

  it("Shows the patches name", function() {
    // TODO: replace "Patch" with the actual patch's name once patch displayName is added to task query
    cy.get("span[id=bc-patch]").should("include.text", "Patch");
  });

  it("Clicking on the patch breadcrumb goes to patch for task", function() {
    cy.get("span[id=bc-patch]").click();
    cy.url().should("include", "/patch/5e4ff3abe3c3317e352062e4");
  });

  it("Clicking 'My Patches' breadcrumb goes to /my-patches route", function() {
    cy.login();
    cy.visit(taskRoute);
    cy.get("span[id=bc-my-patches]").click();
    cy.url().should("include", "/my-patches");
  });
});

describe("PatchBreadcrumb", function() {
  before(() => {
    cy.login();
  });

  it("Shows the patches name", function() {
    cy.visit("/patch/5e4ff3abe3c3317e352062e4");
    // TODO: replace "Patch" with the actual patch's name once patch query is done
    cy.get("span[id=bc-patch]").should("include.text", "Patch");
  });

  it("Clicking 'My Patches' goes to /my-patches route", function() {
    cy.get("span[id=bc-my-patches]").click();
    cy.url().should("include", "/my-patches");
  });
});
