// / <reference types="Cypress" />

describe("Welcome Modal", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });
  it("Displays a welcome modal only when you first visit spruce", () => {
    cy.visit("/");
    cy.dataCy("welcome-modal").should("exist");
    cy.dataCy("close-welcome-modal").click();
    cy.visit("/");
    cy.dataCy("welcome-modal").should("not.exist");
  });
});
