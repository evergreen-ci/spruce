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
});
