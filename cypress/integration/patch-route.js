/// <reference types="Cypress" />
import { waitForGQL } from "../utils/networking";

const TABLE_SORT_SELECTOR = ".ant-table-column-title";
const patch = {
  id: "5e4ff3abe3c3317e352062e4"
};
const path = `/patch/${patch.id}`;
const pathTasks = `${path}/tasks`;
const pathChanges = `${path}/changes`;

const badPatch = {
  id: "i-dont-exist"
};

const locationPathEquals = path =>
  cy.location().should(loc => expect(loc.pathname).to.eq(path));

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

  it("Renders patch title", function() {
    cy.visit(`/patch/${patch.id}`);
    cy.get("#patch-name").within(hasText);
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

  describe("Tabs", () => {
    it("selects tasks tasb by default", () => {
      cy.visit(path);
      cy.get("button[id=task-tab]")
        .should("have.attr", "aria-selected")
        .and("eq", "true");
    });

    it("includes selected tab name in url path", () => {
      cy.visit(path);
      locationPathEquals(pathTasks);
    });

    it("updates the url path when another tab is selected", () => {
      cy.visit(path);
      cy.get("button[id=changes-tab]").click();
      locationPathEquals(pathChanges);
    });

    it("replaces invalid tab names in url path with default", () => {
      cy.visit(`${path}/chicken`);
      locationPathEquals(pathTasks);
    });

    describe("Tasks Table", () => {
      beforeEach(() => {
        cy.server();
        cy.route("POST", "/graphql/query").as("gqlQuery");
        cy.visit(path);
      });

      it("updates the url when column headers are clicked", () => {
        cy.visit(path);

        cy.get("th.cy-task-table-col-name").click();
        locationHasUpdatedParams("NAME", "ASC");

        cy.get("th.cy-task-table-col-name").click();
        locationHasUpdatedParams("NAME", "DESC");

        cy.get("th.cy-task-table-col-name").click();
        locationHasUpdatedParams("NAME");

        cy.get("th.cy-task-table-col-variant").click();
        locationHasUpdatedParams("VARIANT", "ASC");

        cy.get("th.cy-task-table-col-variant").click();
        locationHasUpdatedParams("VARIANT", "DESC");

        cy.get("th.cy-task-table-col-variant").click();
        locationHasUpdatedParams("VARIANT");
      });

      it("clicking task name goes to task page for that task", () => {
        cy.visit(path);
        cy.get("td.cy-task-table-col-name:first").within(() => {
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

      it("Updates url and fetches new tasks when table sort headers are clicked", () => {
        cy.visit(path);

        cy.get("th.cy-task-table-col-name").click();
        locationHasUpdatedParams("NAME", "ASC");
        waitForGQL("@gqlQuery", "PatchBuildVariants");

        cy.get("@gqlQuery")
          .its("requestBody.operationName")
          .should("equal", "PatchTasks")
          .its("requestBody.variables.sortBy")
          .should("equal", "NAME")
          .its("requestBody.variables.sortDir")
          .should("equal", "ASC");

        cy.get("th.cy-task-table-col-name").click();
        waitForGQL("@gqlQuery", "PatchBuildVariants");

        cy.get("@gqlQuery")
          .its("requestBody.operationName")
          .should("equal", "PatchTasks")
          .its("requestBody.variables.sortDir")
          .should("equal", "DESC");
      });
    });
  });
});
