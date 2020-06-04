// /<reference types="Cypress" />
// /<reference path="../support/index.d.ts" />

import {
  clickOnPageBtnAndAssertURLandTableResults,
  clickOnPageSizeBtnAndAssertURLandTableSize,
} from "../../utils";

const pathTasks = `/patch/5e4ff3abe3c3317e352062e4/tasks`;

describe("Task table", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.listenGQL();
    cy.preserveCookies();
  });

  it("Loading skeleton does not persist when you navigate to Patch page from My Patches and adjust a filter", () => {
    cy.visit("user/patches");
    cy.dataCy("patch-card-patch-link")
      .first()
      .click();
    cy.dataTestId("tasks-table-page-size-selector").click();
    cy.dataTestId("tasks-table-page-size-selector-20").click();
    cy.dataTestId("tasks-table").should("exist");
  });

  it("Updates the url when column headers are clicked", () => {
    cy.visit(pathTasks);

    cy.get("th.cy-task-table-col-NAME").click();
    locationHasUpdatedParams("NAME", "ASC");

    cy.get("th.cy-task-table-col-NAME").click();
    locationHasUpdatedParams("NAME", "DESC");

    cy.get("th.cy-task-table-col-NAME").click();
    locationHasUpdatedParams("NAME", "DESC");

    cy.get("th.cy-task-table-col-VARIANT").click();
    locationHasUpdatedParams("VARIANT", "ASC");

    cy.get("th.cy-task-table-col-VARIANT").click();
    locationHasUpdatedParams("VARIANT", "DESC");

    cy.get("th.cy-task-table-col-VARIANT").click();
    locationHasUpdatedParams("VARIANT", "DESC");
  });

  it("Clicking task name goes to task page for that task", () => {
    cy.visit(pathTasks);
    cy.get("td.cy-task-table-col-NAME:first").within(() => {
      cy.get("a")
        .should("have.attr", "href")
        .and("include", "/task");
    });
  });

  it("Task count displays total tasks", () => {
    cy.visit(pathTasks);
    cy.waitForGQL("PatchTasks");
    cy.get("[data-cy=total-task-count]").contains("47");
  });

  it("Sort buttons are disabled when fetching data", () => {
    cy.visit(pathTasks);
    cy.contains(TABLE_SORT_SELECTOR, "Name").click();
    cy.once("fail", (err) => {
      expect(err.message).to.include(
        "'pointer-events: none' prevents user mouse interaction."
      );
    });
  });

  // flakey test - must fix
  ["NAME", "STATUS", "BASE_STATUS", "VARIANT"].forEach((sortBy) => {
    xit(`Fetches tasks sorted by ${sortBy} when ${sortBy} header is clicked`, () => {
      clickSorterAndAssertTasksAreFetched(sortBy);
    });
  });

  describe("Changing page number", () => {
    beforeEach(() => {
      cy.preserveCookies();
    });

    it("Displays the next page of results and updates URL when right arrow is clicked and next page exists", () => {
      cy.visit(pathTasks);
      clickOnPageBtnAndAssertURLandTableResults(
        dataCyNextPage,
        secondPageDisplayNames,
        1,
        dataCyTableRows
      );
    });

    it("Displays the previous page of results and updates URL when the left arrow is clicked and previous page exists", () => {
      clickOnPageBtnAndAssertURLandTableResults(
        dataCyPrevPage,
        firstPageDisplayNames,
        0,
        dataCyTableRows
      );
    });

    it("Does not update results or URL when left arrow is clicked and previous page does not exist", () => {
      clickOnPageBtnAndAssertURLandTableResults(
        dataCyPrevPage,
        firstPageDisplayNames,
        0,
        dataCyTableRows
      );
    });

    it("Does not update results or URL when right arrow is clicked and next page does not exist", () => {
      cy.visit(`${pathTasks}?page=4`);
      clickOnPageBtnAndAssertURLandTableResults(
        dataCyNextPage,
        fourthPageDisplayNames,
        4,
        dataCyTableRows
      );
    });
  });

  describe("Changing page size updates URL and renders less than or equal to that many rows ", () => {
    [20, 10, 50, 100].forEach((pageSize) => {
      it(`Updates URL and displays up to ${pageSize} results at once when the page size is changed to ${pageSize}`, () => {
        clickOnPageSizeBtnAndAssertURLandTableSize(
          pageSize,
          "[data-test-id=tasks-table-page-size-selector]",
          `[data-test-id=tasks-table-page-size-selector-${pageSize}]`,
          dataCyTableRows
        );
      });
    });
  });
});

const dataCyTableRows = "[data-test-id=tasks-table] tr td:first-child";
const firstPageDisplayNames = [
  "lint-service",
  "test-cloud",
  "test-service",
  "test-thirdparty",
  "test-thirdparty",
  "test-model",
  "generate-lint",
  "js-test",
  "test-agent",
  "test-auth",
];
const secondPageDisplayNames = [
  "test-command",
  "test-db",
  "test-evergreen",
  "test-graphql",
  "test-migrations",
  "test-model-alertrecord",
  "test-model-artifact",
  "test-model-build",
  "test-model-commitqueue",
  "test-model-distro",
];
const fourthPageDisplayNames = [
  "test-thirdparty-docker",
  "test-thirdparty",
  "test-trigger",
  "test-units",
  "test-util",
  "test-validator",
  "test-model-2",
];
const TABLE_SORT_SELECTOR = ".ant-table-column-title";

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

const dataCyNextPage =
  "[data-test-id=tasks-table-pagination] > .ant-pagination-next";
const dataCyPrevPage =
  "[data-test-id=tasks-table-pagination] > .ant-pagination-prev";

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
  cy.visit(pathTasks);
  cy.get(`th.cy-task-table-col-${patchSortBy}`).click();
  cy.waitForGQL("PatchTasks");
  assertCorrectRequestVariables(patchSortBy, "ASC");
  cy.get(`th.cy-task-table-col-${patchSortBy}`).click();
  assertCorrectRequestVariables(patchSortBy, "DESC");
};
