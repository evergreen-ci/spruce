// / <reference types="Cypress" />

describe("TaskBreadcrumb", () => {
  const taskRoute1 =
    "/task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
  const taskRoute2 =
    "/task/patch-2-evergreen_ubuntu1604_dist_patch_33016573166a36bd5f46b4111151899d5c4e95b1_6ecedafb562343215a7ff297_20_05_27_21_39_46";
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Shows tasks display name", () => {
    cy.visit(taskRoute1);
    cy.get("#bc-task").should("include.text", "test-model");
  });

  it("Shows the patches name", () => {
    cy.get("#bc-patch").should("include.text", "Patch 2567");
  });

  it("Clicking on the patch breadcrumb goes to patch for task", () => {
    cy.visit(taskRoute1);
    cy.get("#bc-patch").click();
    cy.url().should("include", "/version/5e4ff3abe3c3317e352062e4");
  });

  it("Clicking 'My Patches' breadcrumb goes to the logged in user's Patches Page when the current task belongs to the logged in user", () => {
    cy.visit(taskRoute1);
    cy.contains("My Patches").click();
    cy.url().should("include", "/user/admin/patches");
  });

  it("Clicking the 'Bob Hicks' Patches' breadcrumb goes to Bob Hicks' Patches page when the current task belongs to Bob Hicks", () => {
    cy.visit(taskRoute2);
    cy.contains("Bob Hicks' Patches").click();
    cy.url().should("include", "/user/bob.hicks/patches");
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

  it("Clicking the 'My Patches' breadcrumb goes to the logged in user's Patches Page when the current patch belongs to the logged in user", () => {
    cy.contains("My Patches").click();
    cy.url().should("include", "/user/admin/patches");
  });

  it("Clicking the 'Bob Hicks' Patches' breadcrumb goes to Bob Hicks' Patches page when the current patch belongs to Bob Hicks", () => {
    cy.visit("version/6ecedafb562343215a7ff297");
    cy.contains("Bob Hicks' Patches").click();
    cy.url().should("include", "/user/bob.hicks/patches");
  });
});
