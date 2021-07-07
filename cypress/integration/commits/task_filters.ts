// / <reference types="Cypress" />

describe("Mainline Commits page", () => {
  before(() => {
    cy.login();
    cy.preserveCookies();
  });

  it("Should not show a badge for task filters", () => {
    cy.visit("/commits/evergreen");
    cy.dataCy("project-test-status-select").first().click();
    cy.get(".cy-checkbox").first().click();

    cy.location().should((loc) => {
      expect(loc.search).to.include("statuses");
    });

    cy.dataCy("filter-badge").should("have.length", 0);
  });
});
