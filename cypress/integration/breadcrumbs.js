/// <reference types="Cypress" />

const taskRoute =
  "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33";

describe("TaskBreadcrumb", function() {
  before(() => {
    cy.login();
  });

  it("Shows tasks display name", function() {
    cy.visit(taskRoute);
    cy.get("span[id=bc-task]").should("include.text", "test-agent");
  });

  it("Shows the patches name", function() {
    // TODO: replace "Patch" with the actual patch's name once patch displayName is added to task query
    cy.get("span[id=bc-patch]").should("include.text", "Patch");
  });

  it("Clicking on the patch breadcrumb goes to patch for task", function() {
    cy.get("span[id=bc-patch]").click();
    cy.url().should(
      "include",
      "/patch/mci_8a4f834ba24ddf91f93d0a96b90452e9653f4138"
    );
  });

  it("Clicking 'My Patches' breadcrumb goes to /my-patches route", function() {
    cy.go("back");
    cy.get("span[id=bc-my-patches]").click();
    cy.url().should("include", "/my-patches");
  });
});

describe("PatchBreadcrumb", function() {
  before(() => {
    cy.login();
  });
  it("Shows the patches name", function() {
    cy.visit("/patch/mci_8a4f834ba24ddf91f93d0a96b90452e9653f4138");
    // TODO: replace "Patch" with the actual patch's name once patch query is done
    cy.get("span[id=bc-patch]").should("include.text", "Patch");
  });

  it("Clicking 'My Patches' goes to /my-patches route", function() {
    cy.get("span[id=bc-my-patches]").click();
    cy.url().should("include", "/my-patches");
  });
});
