// / <reference types="Cypress" />

const route = "/project/evergreen/patches";

describe("Project Patches Page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Patch card links to project patches page.", () => {
    cy.visit("/user/admin/patches");
    cy.dataCy("project-patches-link").first().click();
    cy.location("pathname").should("eq", route);
  });

  it("Page title and data rows are displayed.", () => {
    cy.visit(route);
    cy.dataCy("patches-page-title").contains("evergreen smoke test Patches");
    const patchDisplayNames = [
      "Commit Queue Merge:",
      "dist",
      "dist",
      "test meee",
      "'evergreen-ci/evergreen' pull request #3186 by bsamek: EVG-7425 Don't send ShouldExit to unprovisioned hosts (https://github.com/evergreen-ci/evergreen/pull/3186)",
    ];
    cy.dataCy("patch-card").each(($el, index) => {
      cy.wrap($el).contains(patchDisplayNames[index]);
    });
  });
});
