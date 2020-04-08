/// <reference types="Cypress" />

const MY_PATCHES_ROUTE =
  "/my-patches";
describe("my patches page", function() {
  beforeEach(() => {
    cy.server();
    cy.login();
  });

  it("Should render with Show Commit Queue box checked when commitQueue not indicated in URL query param", () => {
    cy.visit(MY_PATCHES_ROUTE);
    cy.get(".cy-checkbox")
      .find("input")
      .should("be.checked");
  });

  it("Should render with Show Commit Queue box checked when commitQueue is false in URL query param", () => {
    cy.visit(`${MY_PATCHES_ROUTE}?commitQueue=false`);
    cy.get(".cy-checkbox")
      .find("input")
      .should("not.be.checked");
  });
  it("Should render with Show Commit Queue box checked when commitQueue is true in URL query param", () => {
    cy.visit(`${MY_PATCHES_ROUTE}?commitQueue=true`);
    cy.get(".cy-checkbox")
      .find("input")
      .should("be.checked");
  });

});
