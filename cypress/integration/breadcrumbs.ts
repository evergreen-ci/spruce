// / <reference types="Cypress" />

describe("Task Page Breadcrumb", () => {
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

  describe("Viewing users own task", () => {
    before(() => {
      cy.visit(taskRoute1);
    });
    it("Shows tasks display name", () => {
      cy.dataCy("bc-task").should("include.text", "test-model");
    });

    it("Shows the patches name", () => {
      cy.dataCy("bc-patch").should("include.text", "Patch 2567");
    });

    it("Clicking on the patch breadcrumb goes to patch for task", () => {
      cy.dataCy("bc-patch").click();
      cy.url().should("include", "/version/5e4ff3abe3c3317e352062e4");
    });

    it("Clicking 'My Patches' breadcrumb goes to the logged in user's Patches Page when the current task belongs to the logged in user", () => {
      cy.visit(taskRoute1);
      cy.contains("My Patches").click();
      cy.url().should("include", "/user/admin/patches");
    });
  });

  describe("Viewing another users task", () => {
    before(() => {
      cy.visit(taskRoute2);
    });
    it("Should link to another users patches page when viewing another users task", () => {
      cy.contains("Bob Hicks' Patches").click();
      cy.url().should("include", "/user/bob.hicks/patches");
    });
  });
});

describe("Patch Page Breadcrumb", () => {
  const usersOwnPatch = "/version/5e4ff3abe3c3317e352062e4";
  const anotherUsersPatch = "/version/6ecedafb562343215a7ff297";
  beforeEach(() => {
    cy.preserveCookies();
  });

  describe("Viewing users own patch", () => {
    before(() => {
      cy.visit(usersOwnPatch);
    });
    it("Shows the patches name", () => {
      cy.dataCy("bc-patch").should("include.text", "Patch 2567");
    });

    it("Clicking the 'My Patches' breadcrumb goes to the logged in user's Patches Page when the current patch belongs to the logged in user", () => {
      cy.contains("My Patches").click();
      cy.url().should("include", "/user/admin/patches");
    });
  });
  describe("Viewing another users patch", () => {
    before(() => {
      cy.visit(anotherUsersPatch);
    });
    it("Should link to another users patches page when viewing another users patch", () => {
      cy.contains("Bob Hicks' Patches").click();
      cy.url().should("include", "/user/bob.hicks/patches");
    });
  });
});
