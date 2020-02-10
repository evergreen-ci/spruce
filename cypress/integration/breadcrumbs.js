/// <reference types="Cypress" />

const taskRoute =
  "/task/performance_linux_mmap_standalone_insert_37cb7ea09393e88662e3139bd20fa29e59f2a1a3_18_01_11_00_01_36";

describe("TaskBreadcrumb", function() {
  it("Shows tasks display name", function() {
    cy.visit(taskRoute);
    cy.login();
    cy.get("span[id=bc-task]").should("include.text", "insert");
  });

  it("Shows the patches name", function() {
    // TODO: replace "Patch" with the actual patch's name once patch displayName is added to task query
    cy.get("span[id=bc-patch]").should("include.text", "Patch");
  });

  it("Clicking on the patch breadcrumb goes to patch for task", function() {
    cy.get("span[id=bc-patch]").click();
    cy.url().should(
      "include",
      "/patch/performance_37cb7ea09393e88662e3139bd20fa29e59f2a1a3"
    );
  });

  it("Clicking 'My Patches' breadcrumb goes to /my-patches route", function() {
    cy.visit(taskRoute);
    cy.login();
    cy.get("span[id=bc-my-patches]").click();
    cy.url().should("include", "/my-patches");
  });
});

describe("PatchBreadcrumb", function() {
  it("Shows the patches name", function() {
    cy.visit("/patch/performance_37cb7ea09393e88662e3139bd20fa29e59f2a1a3");
    cy.login();
    // TODO: replace "Patch" with the actual patch's name once patch query is done
    cy.get("span[id=bc-patch]").should("include.text", "Patch");
  });

  it("Clicking 'My Patches' goes to /my-patches route", function() {
    cy.get("span[id=bc-my-patches]").click();
    cy.url().should("include", "/my-patches");
  });
});
