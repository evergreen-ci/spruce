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

  it("Should not show a Sitewide banner after it has been dismissed", () => {
    cy.dataCy("sitewide-banner").should("exist");
    cy.dataCy("dismiss-sitewide-banner-button").click();
    cy.dataCy("sitewide-banner").should("not.exist");
    cy.visit("/");
    cy.dataCy("sitewide-banner").should("not.exist");
  });
});
