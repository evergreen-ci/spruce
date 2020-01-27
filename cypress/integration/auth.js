/// <reference types="Cypress" />

function login() {
  cy.get("input[name=username]").type("admin");
  cy.get("input[name=password]").type("password");
  cy.get("button[id=login-submit]").click();
}

describe("Auth", function() {
  it("Unauthenticated user is redirected to login page after visiting a private route", function() {
    cy.visit("/private");
    cy.url().should("include", "/login");
  });

  it("Redirects user back to the route they were trying to visit after login", function() {
    login();
    cy.url().should("include", "/private");
  });

  it("Redirects user to /login after logging out", function() {
    cy.get("div[id=logout]").click();
    cy.url().should("include", "/login");
  });

  it("Redirects user to home page by default if no previous referer", function() {
    cy.visit("/login");
    login();
    cy.url().should("include", "/");
  });
});
