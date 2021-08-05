// / <reference types="Cypress" />
// / <reference path="../support/index.d.ts" />

const patchId = "5ecedafb562343215a7ff297";

describe("Code Changes Table", () => {
  before(() => {
    cy.login();
    cy.visit(`/version/${patchId}/changes`);
  });

  beforeEach(() => {
    cy.preserveCookies();
  });
  it("Should display at least one table when there are code changes", () => {
    cy.dataCy("code-changes-table").should("exist");
  });
  it("Should link to code changes when they exist", () => {
    cy.dataCy("fileLink")
      .should("have.attr", "href")
      .and("include", `filediff/${patchId}`);
    cy.dataCy("html-diff-btn")
      .should("have.attr", "href")
      .and("include", `filediff/${patchId}`);
    cy.dataCy("raw-diff-btn")
      .should("have.attr", "href")
      .and("include", `rawdiff/${patchId}`);
  });
});
