/// <reference types="Cypress" />
import { waitForGQL } from "../utils/networking";

const TABLE_SORT_SELECTOR = ".ant-table-column-title";
const patch = {
  id: "5e4ff3abe3c3317e352062e4"
};
const path = `/patch/${patch.id}`;
const pathTasks = `${path}/tasks`;

const badPatch = {
  id: "i-dont-exist"
};

const locationHasUpdatedParams = (sortBy, sortDir) => {
  cy.location().should(loc => {
    expect(loc.pathname).to.equal(pathTasks);
    expect(loc.search).to.include(`sortBy=${sortBy}`);
    if (!sortDir) {
      expect(loc.search).to.not.include("sortDir");
    } else {
      expect(loc.search).to.include(`sortDir=${sortDir}`);
    }
  });
};

const hasText = $el => {
  expect($el.text.length > 0).to.eq(true);
};

describe("Patch route", function() {
  beforeEach(() => {
    cy.login();
  });

  it("Renders patch info", function() {
    cy.visit(`/patch/${patch.id}`);
    cy.get("#patch-name").within(hasText);
    cy.get("#task-count").within(hasText);
  });

  it("'Base commit' link in metadata links to version page of legacy UI", function() {
    cy.visit(`/patch/${patch.id}`);
    cy.get("#patch-base-commit")
      .should("have.attr", "href")
      .and("include", `http://localhost:9090/version/${patch.id}`);
  });

  it("Shows an error page if there was a problem loading data", () => {
    cy.visit(`/patch/${badPatch.id}`);
    cy.get("#patch-error").should("exist");
    cy.get("#task-count").should("not.exist");
  });

  describe("Build Variants", () => {
    beforeEach(() => {
      cy.server();
      cy.route("POST", "/graphql/query").as("gqlQuery");
      cy.visit(path);
      waitForGQL("@gqlQuery", "PatchBuildVariants");
    });

    it("Lists the patch's build variants", () => {
      cy.get(".patch-build-variant").within($variants => {
        Array.from($variants).length > 0;
      });
    });

    it("Shows tooltip with task's name on hover", () => {
      cy.get(".task-square")
        .first()
        .trigger("mouseover");
      cy.get(".task-square-tooltip").within(hasText);
    });

    it("Navigates to task page from clicking task square", () => {
      cy.get(".task-square")
        .should("have.attr", "href")
        .and("include", "/task");
    });
  });

  describe("Tasks Table", () => {
    beforeEach(() => {
      cy.server();
      cy.route("POST", "/graphql/query").as("gqlQuery");
      cy.visit(path);
    });

    it("Updates the url when column headers are clicked", () => {
      cy.visit(path);

      cy.get("th.cy-task-table-col-NAME").click();
      locationHasUpdatedParams("NAME", "ASC");

      cy.get("th.cy-task-table-col-NAME").click();
      locationHasUpdatedParams("NAME", "DESC");

      cy.get("th.cy-task-table-col-NAME").click();
      locationHasUpdatedParams("NAME");

      cy.get("th.cy-task-table-col-VARIANT").click();
      locationHasUpdatedParams("VARIANT", "ASC");

      cy.get("th.cy-task-table-col-VARIANT").click();
      locationHasUpdatedParams("VARIANT", "DESC");

      cy.get("th.cy-task-table-col-VARIANT").click();
      locationHasUpdatedParams("VARIANT");
    });

    it("clicking task name goes to task page for that task", () => {
      cy.visit(path);
      cy.get("td.cy-task-table-col-NAME:first").within(() => {
        cy.get("a")
          .should("have.attr", "href")
          .and("include", "/task");
      });
    });

    it("Should have sort buttons disabled when fetching data", () => {
      cy.visit(path);
      cy.contains(TABLE_SORT_SELECTOR, "Name").click();
      cy.once("fail", err => {
        expect(err.message).to.include(
          "'pointer-events: none' prevents user mouse interaction."
        );
      });
    });

    it("Fetches sorted tasks when table sort headers are clicked", () => {
      ["NAME", "STATUS", "BASE_STATUS", "VARIANT"].forEach(sortBy =>
        clickSorterAndAssertTasksAreFetched(sortBy)
      );
    });
  });
});

const assertCorrectRequestVariables = (sortBy, sortDir) => {
  cy.get("@gqlQuery")
    .its("requestBody.operationName")
    .should("equal", "PatchTasks");
  cy.get("@gqlQuery")
    .its("requestBody.variables.sortBy")
    .should("equal", sortBy);
  cy.get("@gqlQuery")
    .its("requestBody.variables.sortDir")
    .should("equal", sortDir);
};

const clickSorterAndAssertTasksAreFetched = patchSortBy => {
  cy.visit(path);

  cy.get(`th.cy-task-table-col-${patchSortBy}`).click();
  waitForGQL("@gqlQuery", "PatchBuildVariants");
  assertCorrectRequestVariables(patchSortBy, "ASC");

  cy.get(`th.cy-task-table-col-${patchSortBy}`).click();
  assertCorrectRequestVariables(patchSortBy, "DESC");
};
