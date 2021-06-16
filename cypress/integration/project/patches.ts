// / <reference types="Cypress" />

const route = "/project/evergreen/patches";

describe("Project Patches Page", () => {
  before(() => {
    cy.login();
    cy.preserveCookies();
  });

  it("Should link to project patches page from the user patches page", () => {
    cy.visit("/user/admin/patches");
    cy.dataCy("project-patches-link").first().click();
    cy.location("pathname").should("eq", route);
    cy.dataCy("patch-card").should("exist");
  });

  it("Should link to author patches page from the project patches page", () => {
    cy.visit("/project/evergreen/patches");
    cy.dataCy("user-patches-link").first().click();
    cy.location("pathname").should("eq", "/user/admin/patches");
    cy.dataCy("patch-card").should("exist");
  });
});
