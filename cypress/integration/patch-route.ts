// / <reference types="Cypress" />
// / <reference path="../support/index.d.ts" />

const patch = {
  id: "5e4ff3abe3c3317e352062e4",
};
const path = `/version/${patch.id}`;

const badPatch = {
  id: "i-dont-exist",
};
const patch2 = {
  id: "52a630633ff1227909000021",
};

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
    const unactivatedPatchId = "5e6bb9e23066155a993e0f1a";
    cy.visit(`/patch/${unactivatedPatchId}`);
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(
        `/patch/${unactivatedPatchId}/configure/tasks`
      );
    });
  });

  it("Renders patch info", () => {
    cy.visit(`/patch/${patch.id}`);
    cy.dataCy("page-title").within(hasText);
    cy.dataCy("patch-page").within(hasText);
  });

  it("Shows commit queue position in metadata if patch is on commit queue", () => {
    cy.visit(`/patch/${patch.id}`);
    cy.dataCy("commit-queue-position").click();
    cy.location("pathname").should("eq", "/commit-queue/evergreen");
  });

  it("Shows patch parameters if they exist", () => {
    cy.visit(`/patch/${patch.id}`);
    cy.dataCy("parameters-modal").should("not.be.visible");
    cy.dataCy("parameters-link").click();
    cy.dataCy("parameters-modal").should("be.visible");
  });

  it("Doesn't show patch parameters if they don't exist", () => {
    cy.visit(`/patch/${patch2.id}`);
    cy.dataCy("parameters-link").should("not.be.visible");
    cy.dataCy("parameters-modal").should("not.be.visible");
  });

  it("'Base commit' link in metadata links to version page of legacy UI", () => {
    cy.visit(`/patch/${patch.id}`);
    cy.get("#patch-base-commit")
      .should("have.attr", "href")
      .and("include", `http://localhost:9090/version/${patch.id}`);
  });

  it("Shows a message if there was a problem loading data", () => {
    cy.visit(`/patch/${badPatch.id}`);
    cy.dataCy("toast").should("exist");
    cy.get("#task-count").should("not.exist");
  });

  describe("Build Variants", () => {
    beforeEach(() => {
      cy.listenGQL();
      cy.preserveCookies();
      cy.visit(path);
      cy.waitForGQL("PatchBuildVariants");
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
