// / <reference types="Cypress" />
// / <reference path="../support/index.d.ts" />

const patches = {
  0: "5e4ff3abe3c3317e352062e4", // normal patch
  1: "i-dont-exist", // non existant patch
  2: "52a630633ff1227909000021", // patch 2
  3: "5e6bb9e23066155a993e0f1a", // unconfigured patch
};

const versionRoute = (id) => `/version/${id}`;
const hasText = ($el) => {
  expect($el.text.length > 0).to.eq(true);
};

describe("Patch route", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Redirects to configure patch page if patch is not activated", () => {
    cy.visit(versionRoute(patches[3]));
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(`/patch/${patches[3]}/configure/tasks`);
    });
  });

  it("Renders patch info", () => {
    cy.visit(versionRoute(patches[0]));
    cy.dataCy("page-title").within(hasText);
    cy.dataCy("patch-page").within(hasText);
  });

  it("Shows patch parameters if they exist", () => {
    cy.dataCy("parameters-modal").should("not.be.visible");
    cy.dataCy("parameters-link").click();
    cy.dataCy("parameters-modal").should("be.visible");
    cy.get(".ant-modal-close-x").click();
    cy.dataCy("parameters-modal").should("not.be.visible");
  });
  it("'Base commit' link in metadata links to version page of legacy UI", () => {
    cy.dataCy("patch-base-commit")
      .should("have.attr", "href")
      .and("include", `http://localhost:9090/version/${patches[0]}`);
  });
  it("Doesn't show patch parameters if they don't exist", () => {
    cy.visit(versionRoute(patches[2]));
    cy.dataCy("parameters-link").should("not.be.visible");
    cy.dataCy("parameters-modal").should("not.be.visible");
  });

  it("Shows a message if there was a problem loading data", () => {
    cy.visit(versionRoute(patches[1]));
    cy.dataCy("toast").contains("Error").should("exist");
  });

  describe("Build Variants", () => {
    beforeEach(() => {
      cy.preserveCookies();
      cy.visit(versionRoute(patches[0]));
    });

    it("Lists the patch's build variants", () => {
      cy.dataCy("patch-build-variant").within(
        ($variants) => Array.from($variants).length > 0
      );
    });

    it("Shows tooltip with task's name on hover", () => {
      cy.dataCy("task-square").first().trigger("mouseover");
      cy.dataCy("task-square-tooltip").within(hasText);
    });

    it("Navigates to task page from clicking task square", () => {
      cy.dataCy("task-square")
        .should("have.attr", "href")
        .and("include", "/task");
    });
  });
});
