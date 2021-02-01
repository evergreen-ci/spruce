// / <reference types="Cypress" />
// / <reference path="../support/index.d.ts" />

describe("Auth", () => {
  it("Unauthenticated user is redirected to login page after visiting a private route", () => {
    cy.visit("/version/123123");
    cy.url().should("include", "/login");
  });

  it("Redirects user to My Patches page after logging in.", () => {
    cy.enterLoginCredentials();
    cy.url().should("include", "/user/admin/patches");
  });

  it("Automatically authenticates user if they are logged in", () => {
    cy.visit("/version/123123");
    cy.url().should("include", "/version/123123");
  });

  it("Redirects user to their patches page if they are already logged in and visit login page", () => {
    cy.login();
    cy.visit("/login");
    cy.url().should("include", "/user/admin/patches");
  });
});
