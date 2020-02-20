/// <reference types="Cypress" />

const patch = {
  id: "5983798397b1d35eb800040f",
  desc: "Ernie testing 20"
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

  it("Clicking 'Base commit' link in metadata goes to version page of legacy UI", function() {
    cy.visit(`/patch/${patch.id}`);
    cy.get("a[id=patch-base-commit]").click();
    cy.url().should(
      "include",
      `https://evergreen.mongodb.com/version/${patch.id}`
    );
  });

  it("Shows an error page if there was a problem loading data", () => {
    cy.visit(`/patch/${badPatch.id}`);
    cy.get("div[id=patch-error]").should("exist");
  });
});
