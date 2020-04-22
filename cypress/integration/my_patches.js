/// <reference types="Cypress" />

const MY_PATCHES_ROUTE = "/my-patches";
describe("My Patches Page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.listenGQL();
  });

  it("Initial load should make a userPatches gql query with default query params when none are specified in the URL", () => {
    cy.visit(MY_PATCHES_ROUTE);
    cy.waitForGQL("userPatches", {
      "request.body.variables.$includeCommitQueue": (v) => v == true,
      "request.body.variables.$limit": (v) => v === 10,
      "request.body.variables.$page": (v) => v === 0,
      "request.body.variables.$patchName": (v) => v === "",
      "request.body.variables.$statuses": (v) =>
        Array.isArray(v) && v.length === 0,
    }).then((xhr) => console.log(xhr));
  });

  describe("Show commit queue checkbox", () => {
    beforeEach(() => {
      cy.preserveCookies();
    });

    it("Should render with Show Commit Queue box checked when commitQueue not indicated in URL query param", () => {
      cy.visit(MY_PATCHES_ROUTE);
      cy.dataCy("commit-queue-checkbox").should("be.checked");
    });

    it("Should render with Show Commit Queue box unchecked when commitQueue is false in URL query param", () => {
      cy.visit(`${MY_PATCHES_ROUTE}?commitQueue=false`);
      cy.dataCy("commit-queue-checkbox").should("not.be.checked");
    });

    it("Should render with Show Commit Queue box checked when commitQueue is true in URL query param", () => {
      cy.visit(`${MY_PATCHES_ROUTE}?commitQueue=true`);
      cy.dataCy("commit-queue-checkbox").should("be.checked");
    });
  });
});
