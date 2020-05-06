/// <reference types="Cypress" />
/// <reference path="../support/index.d.ts" />

import { assertScrollFetchAppend } from "../utils/table";

const TABLE_SORT_SELECTOR = ".ant-table-column-title";
const patch = {
  id: "5e4ff3abe3c3317e352062e4",
};
const path = `/patch/${patch.id}`;
const pathTasks = `${path}/tasks`;

const badPatch = {
  id: "i-dont-exist",
};

const locationHasUpdatedParams = (sortBy, sortDir) => {
  cy.location().should((loc) => {
    expect(loc.pathname).to.equal(pathTasks);
    expect(loc.search).to.include(`sortBy=${sortBy}`);
    if (!sortDir) {
      expect(loc.search).to.not.include("sortDir");
    } else {
      expect(loc.search).to.include(`sortDir=${sortDir}`);
    }
  });
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
    cy.location("pathname").should("eq", "/commit-queue/mongodb-mongo-test");
  });

  it("'Base commit' link in metadata links to version page of legacy UI", () => {
    cy.visit(`/patch/${patch.id}`);
    cy.get("#patch-base-commit")
      .should("have.attr", "href")
      .and("include", `http://localhost:9090/version/${patch.id}`);
  });

  it("Shows a message if there was a problem loading data", () => {
    cy.visit(`/patch/${badPatch.id}`);
    cy.dataCy("banner").should("exist");
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
      cy.get(".patch-build-variant").within(($variants) => {
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
      cy.listenGQL();
      cy.preserveCookies();
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

    it("Clicking task name goes to task page for that task", () => {
      cy.visit(path);
      cy.get("td.cy-task-table-col-NAME:first").within(() => {
        cy.get("a")
          .should("have.attr", "href")
          .and("include", "/task");
      });
    });

    it("Task count displays total tasks", () => {
      cy.visit(path);
      cy.waitForGQL("PatchTasks");
      cy.get("[data-cy=total-task-count]")
        .invoke("text")
        .then(($taskCount) => {
          cy.get("[data-cy=current-task-count]")
            .invoke("text")
            .should("eq", $taskCount);
        });
    });

    it("Sort buttons are disabled when fetching data", () => {
      cy.visit(path);
      cy.contains(TABLE_SORT_SELECTOR, "Name").click();
      cy.once("fail", (err) => {
        expect(err.message).to.include(
          "'pointer-events: none' prevents user mouse interaction."
        );
      });

      it("Fetches additional tasks as the user scrolls", () => {
        assertScrollFetchAppend(() => {
          cy.waitForGQL("PatchTasks", {
            "requestBody.variables.page": (v) => v === 1,
          });
        });
      });

      it("Stops fetching tasks when all tasks have been fetched", () => {
        scrollTasksTableUntilAllTasksFetched({ hasMore: true });
        cy.get(".ant-table-body").scrollTo("top");
        scrollToBottomOfTasksTable();
        cy.wait("@gqlQuery").then((xhr) => {
          expect(xhr.requestBody.operationName).not.eq("PatchTasks");
        });
      });
    });

    // flakey test - must fix
    ["NAME", "STATUS", "BASE_STATUS", "VARIANT"].forEach((sortBy) => {
      xit(`Fetches tasks sorted by ${sortBy} when ${sortBy} header is clicked`, () => {
        clickSorterAndAssertTasksAreFetched(sortBy);
      });
    });
  });
});

const scrollToBottomOfTasksTable = () => {
  cy.get(".ant-table-body").scrollTo("bottom", { duration: 500 });
  cy.wait(200);
};

const scrollTasksTableUntilAllTasksFetched = ({ hasMore }) => {
  if (!hasMore) {
    return;
  }
  cy.dataCy("total-task-count")
    .invoke("text")
    .then(($totalTaskCount) => {
      scrollToBottomOfTasksTable();
      cy.dataCy("current-task-count")
        .invoke("text")
        .then(($currentTaskCount) => {
          if ($currentTaskCount === $totalTaskCount) {
            hasMore = false;
          }
        })
        .then(() => scrollTasksTableUntilAllTasksFetched({ hasMore }));
    });
};

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

const clickSorterAndAssertTasksAreFetched = (patchSortBy) => {
  cy.visit(path);
  cy.get(`th.cy-task-table-col-${patchSortBy}`).click();
  cy.waitForGQL("PatchTasks");
  assertCorrectRequestVariables(patchSortBy, "ASC");
  cy.get(`th.cy-task-table-col-${patchSortBy}`).click();
  assertCorrectRequestVariables(patchSortBy, "DESC");
};
