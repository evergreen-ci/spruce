/// <reference types="Cypress" />

describe("Auth", function() {
  it("Unauthenticated user is redirected to login page after visiting a private route", function() {
    cy.visit("/my-patches");
    cy.url().should("include", "/login");
  });

  it("Redirects user back to the route they were trying to visit after login", function() {
    cy.login();
    cy.url().should("include", "/my-patches");
  });

  it("Redirects user to /login after logging out", function() {
    cy.get("div[id=logout]").click();
    cy.url().should("include", "/login");
  });

  it("Redirects user to home page by default if no previous referer", function() {
    cy.visit("/login");
    cy.login();
    cy.url().should("include", "/");
  });
});
