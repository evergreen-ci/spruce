// / <reference types="Cypress" />
// / <reference path="../support/index.d.ts" />

const patchWithChanges = "5e4ff3abe3c3317e352062e4";
const CODE_CHANGES_ROUTE = `version/${patchWithChanges}/changes`;
const NO_CODE_CHANGES_ROUTE =
  "patch/5e6bb9e23066155a993e0f1a/configure/changes";
describe("Code Changes Table", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Shows all columns even when the file name is super long.", () => {
    cy.visit("/version/52a630633ff1227909000021/changes");
    cy.contains(
      "superloooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg name"
    ).should("be.visible");
    cy.dataCy("additions-column").should("be.visible");
    cy.dataCy("deletions-column").should("be.visible");
  });

  it("HTML and Raw buttons should have href when there are code changes", () => {
    cy.visit(CODE_CHANGES_ROUTE);
    cy.dataCy("html-diff-btn")
      .should("have.attr", "href")
      .and("include", `filediff/${patchWithChanges}`);
    cy.dataCy("raw-diff-btn")
      .should("have.attr", "href")
      .and("include", `rawdiff/${patchWithChanges}`);
  });

  it("Should display at least one table when there are code changes", () => {
    cy.visit(CODE_CHANGES_ROUTE);
    cy.dataCy("code-changes-table").should("exist");
  });

  it("Should display 'No code changes' when there are no code changes", () => {
    cy.visit(NO_CODE_CHANGES_ROUTE);
    cy.contains("No code changes");
  });

  it("File names in table should have href", () => {
    cy.visit(CODE_CHANGES_ROUTE);
    cy.dataCy("fileLink")
      .should("have.attr", "href")
      .and("include", `filediff/${patchWithChanges}`);
  });
});
