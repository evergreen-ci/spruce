// / <reference types="Cypress" />

describe("Navigating to Spawn Volume page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Visiting the spawn volume page should display the number of free and mounted volumes ", () => {
    cy.visit("/spawn/volume");
    cy.dataCy("mounted-badge").contains("9 Mounted");
    cy.dataCy("free-badge").contains("4 Free");
  });
});
