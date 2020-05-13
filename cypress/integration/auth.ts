// / <reference types="Cypress" />
// / <reference path="../support/index.d.ts" />

describe("Auth", () => {
  it("Unauthenticated user is redirected to login page after visiting a private route", () => {
    cy.visit("/patch/123123");
    cy.url().should("include", "/login");
  });

  it("Redirects user back to the route they were trying to visit after login", () => {
    cy.enterLoginCredentials();
    cy.url().should("include", "/patch/123123");
  });

  it("Automatically authenticates user if they are logged in", () => {
    cy.visit("/patch/123123");
    cy.url().should("include", "/patch/123123");
  });

  it("Redirects user to home page by default if no previous referer", () => {
    cy.login();
    cy.url().should("include", "/my-patches");
  });

  it("Redirects user to /my-patches if they are already logged in and visit login page", () => {
    cy.login();
    cy.visit("/login");
    cy.url().should("include", "/my-patches");
  });
});
