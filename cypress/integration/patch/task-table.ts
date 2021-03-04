// /<reference types="Cypress" />
// /<reference path="../support/index.d.ts" />

import {
  clickOnPageBtnAndAssertURLandTableResults,
  clickOnPageSizeBtnAndAssertURLandTableSize,
} from "../../utils";

const pathTasks = `/version/5e4ff3abe3c3317e352062e4/tasks`;
const patchDescriptionTasksExist = "dist";

describe("Task table", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Loading skeleton does not persist when you navigate to Patch page from My Patches and adjust a filter", () => {
    cy.visit("user/patches");
    cy.dataCy("patch-card-patch-link")
      .filter(`:contains(${patchDescriptionTasksExist})`)
      .click();
    cy.dataCy("tasks-table-page-size-selector").click();
    cy.dataCy("tasks-table-page-size-selector-20").click();
    cy.dataTestId("tasks-table").should("exist");
  });

  it("Updates the url when column headers are clicked", () => {
    cy.visit(pathTasks);
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC"
    );

    cy.get("th.cy-task-table-col-NAME").click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BNAME%3AASC"
    );

    cy.get("th.cy-task-table-col-NAME").click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BNAME%3ADESC"
    );

    cy.get("th.cy-task-table-col-NAME").click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC"
    );

    cy.get("th.cy-task-table-col-VARIANT").click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BVARIANT%3AASC"
    );

    cy.get("th.cy-task-table-col-VARIANT").click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BVARIANT%3ADESC"
    );

    cy.get("th.cy-task-table-col-VARIANT").click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC"
    );
  });

  it("Clicking task name goes to task page for that task", () => {
    cy.visit(pathTasks);
    cy.get("td.cy-task-table-col-NAME:first").within(() => {
      cy.get("a").should("have.attr", "href").and("include", "/task");
    });
  });

  it("Task count displays total tasks", () => {
    cy.visit(pathTasks);
    cy.dataCy("total-task-count").contains("50");
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

  ["NAME", "STATUS", "BASE_STATUS", "VARIANT"].forEach((sortBy) => {
    // TODO: This test doesn't work bc of issues with assertCorrectRequestVariables
    xit(`Fetches tasks sorted by ${sortBy} when ${sortBy} header is clicked`, () => {
      clickSorterAndAssertTasksAreFetched(sortBy);
    });
  });

  xdescribe("Changing page number", () => {
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
          "tasks-table-page-size-selector",
          `tasks-table-page-size-selector-${pageSize}`,
          dataCyTableRows
        );
      });
    });
  });

  it("The blocked status badge appears in the table when a task status or base task status is blocked", () => {
    cy.visit("/version/6ecedafb562343215a7ff297/tasks");
    cy.dataCy("task-status-badge").each(($el) =>
      cy.wrap($el).contains("Blocked")
    );
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
const TABLE_SORT_SELECTOR = ".ant-table-column-sorters";

const dataCyNextPage =
  "[data-cy=tasks-table-pagination] > .ant-pagination-next";
const dataCyPrevPage =
  "[data-cy=tasks-table-pagination] > .ant-pagination-prev";

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
