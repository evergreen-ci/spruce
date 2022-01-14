// / <reference types="Cypress" />

describe("Mainline Commits page", () => {
  before(() => {
    cy.login();
    cy.preserveCookies();
  });

  it("Should not show a badge for task filters", () => {
    cy.visit("/commits/evergreen");
    cy.dataCy("project-task-status-select-button").click();
    cy.getInputByLabel("All").check({ force: true });

    cy.location().should((loc) => {
      expect(loc.search).to.include("statuses");
    });

    cy.dataCy("filter-badge").should("not.be.visible");
  });
});
