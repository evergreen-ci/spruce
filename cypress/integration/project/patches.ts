// / <reference types="Cypress" />

const route = "/project/evergreen/patches";

describe("Project Patches Page", () => {
  before(() => {
    cy.login();
    cy.preserveCookies();
  });

  it("Patch card links to project patches page.", () => {
    cy.visit("/user/admin/patches");
    cy.dataCy("project-patches-link").first().click();
    cy.location("pathname").should("eq", route);
  });
});
