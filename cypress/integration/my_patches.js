/// <reference types="Cypress" />

const MY_PATCHES_ROUTE = "/my-patches";
describe("my patches page", function () {
  beforeEach(() => {
    cy.server();
    cy.login();
  });

  it("Should render with Show Commit Queue box checked when commitQueue not indicated in URL query param", () => {
    cy.visit(MY_PATCHES_ROUTE);
    cy.get("[data-cy=commit-queue-checkbox]").should("be.checked");
  });

  it("Should render with Show Commit Queue box unchecked when commitQueue is false in URL query param", () => {
    cy.visit(`${MY_PATCHES_ROUTE}?commitQueue=false`);
    cy.get("[data-cy=commit-queue-checkbox]").should("not.be.checked");
  });
  it("Should render with Show Commit Queue box checked when commitQueue is true in URL query param", () => {
    cy.visit(`${MY_PATCHES_ROUTE}?commitQueue=true`);
    cy.get("[data-cy=commit-queue-checkbox]").should("be.checked");
  });
});
