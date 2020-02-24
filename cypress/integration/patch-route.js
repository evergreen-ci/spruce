/// <reference types="Cypress" />

const patch = {
  id: "5e53f9c9a0182531515737ef",
  desc: "'evergreen-ci/evergreen' pull request #3186 by bsamek: EVG-7425 Don't send ShouldExit to unprovisioned hosts (https://github.com/evergreen-ci/evergreen/pull/3186)"
};

const badPatch = {
  id: "i-dont-exist"
};

describe("Patch route", function() {
  beforeEach(() => {
    cy.login();
  });

  it("Loads patch data and renders it on the page", function() {
    cy.visit(`/patch/${patch.id}`);
    cy.get("h1[id=patch-name]").should("include.text", patch.desc);
  });

  it("'Base commit' link in metadata links to version page of legacy UI", function() {
    cy.visit(`/patch/${patch.id}`);
    cy.get("a[id=patch-base-commit]").should("have.attr", "href").and("eq", "http://localhost:9090/version/5e4ff3abe3c3317e352062e4")
  });

  it("Shows an error page if there was a problem loading data", () => {
    cy.visit(`/patch/${badPatch.id}`);
    cy.get("div[id=patch-error]").should("exist");
  });
});
