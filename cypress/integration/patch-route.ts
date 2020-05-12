/// <reference types="Cypress" />
/// <reference path="../support/index.d.ts" />

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

  // it("Redirects to configure patch page if patch is not activated", () => {
  //   const unactivatedPatchId = "5e6bb9e23066155a993e0f1a";
  //   cy.visit(`/patch/${unactivatedPatchId}`);
  //   cy.location().should((loc) => {
  //     expect(loc.pathname).to.equal(
  //       `/patch/${unactivatedPatchId}/configure/tasks`
  //     );
  //   });
  // });

  // it("Renders patch info", () => {
  //   cy.visit(`/patch/${patch.id}`);
  //   cy.dataCy("page-title").within(hasText);
  //   cy.dataCy("patch-page").within(hasText);
  // });

  // it("Shows commit queue position in metadata if patch is on commit queue", () => {
  //   cy.visit(`/patch/${patch.id}`);
  //   cy.dataCy("commit-queue-position").click();
  //   cy.location("pathname").should("eq", "/commit-queue/mongodb-mongo-test");
  // });

  // it("'Base commit' link in metadata links to version page of legacy UI", () => {
  //   cy.visit(`/patch/${patch.id}`);
  //   cy.get("#patch-base-commit")
  //     .should("have.attr", "href")
  //     .and("include", `http://localhost:9090/version/${patch.id}`);
  // });

  // it("Shows a message if there was a problem loading data", () => {
  //   cy.visit(`/patch/${badPatch.id}`);
  //   cy.dataCy("banner").should("exist");
  //   cy.get("#task-count").should("not.exist");
  // });

  xdescribe("Build Variants", () => {
    beforeEach(() => {
      cy.listenGQL();
      cy.preserveCookies();
      cy.waitForGQL("PatchBuildVariants");
    });

    it("Lists the patch's build variants", () => {
      cy.visit(path);
      cy.get(".patch-build-variant").within(
        ($variants) => Array.from($variants).length > 0
      );
    });

    it("Shows tooltip with task's name on hover", () => {
      cy.visit(path);
      cy.get(".task-square")
        .first()
        .trigger("mouseover");
      cy.get(".task-square-tooltip").within(hasText);
    });

    it("Navigates to task page from clicking task square", () => {
      cy.visit(path);
      cy.get(".task-square")
        .should("have.attr", "href")
        .and("include", "/task");
    });
  });

  describe("Tasks Table", () => {
    before(() => {
      cy.login();
    });
    beforeEach(() => {
      cy.listenGQL();
      cy.preserveCookies();
    });

    it("Updates the url when column headers are clicked", () => {
      cy.visit(path);

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
      cy.get("[data-cy=total-task-count]").contains("47");
    });

    it("Sort buttons are disabled when fetching data", () => {
      cy.visit(path);
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
        cy.get(
          "[data-test-id=tasks-table-pagination] > .ant-pagination-next"
        ).click();
        cy.get(tableRows).each(($el, index) => {
          cy.wrap($el).contains(secondPageDisplayNames[index]);
        });
        cy.location("search").should("include", "page=1");
      });

      // it("Does not update results or URL when right arrow is clicked and next page does not exist", () => {
      //   cy.get(
      //     "[data-test-id=tests-table-pagination] > .ant-pagination-next"
      //   ).click();
      //   cy.get(tableRows).each(($el, index) => {
      //     cy.wrap($el).contains(secondPageDisplayNames[index]);
      //   });
      //   cy.location("search").should("include", "page=1");
      // });

      it("Displays the previous page of results and updates URL when the left arrow is clicked and previous page exists", () => {
        cy.get(
          "[data-test-id=tasks-table-pagination] > .ant-pagination-prev"
        ).click();
        cy.get(tableRows).each(($el, index) => {
          cy.wrap($el).contains(firstPageDisplayNames[index]);
        });
        cy.location("search").should("include", "page=0");
      });

      it("Does not update results or URL when left arrow is clicked and previous page does not exist", () => {
        cy.get(
          "[data-test-id-tasks-table-pagination] > .ant-pagination-prev"
        ).click();
        cy.get(tableRows).each(($el, index) => {
          cy.wrap($el).contains(firstPageDisplayNames[index]);
        });
        cy.location("search").should("include", "page=0");
      });
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

const clickSorterAndAssertTasksAreFetched = (patchSortBy) => {
  cy.visit(path);
  cy.get(`th.cy-task-table-col-${patchSortBy}`).click();
  cy.waitForGQL("PatchTasks");
  assertCorrectRequestVariables(patchSortBy, "ASC");
  cy.get(`th.cy-task-table-col-${patchSortBy}`).click();
  assertCorrectRequestVariables(patchSortBy, "DESC");
};

const tableRows = "[data-test-id=tasks-table] tr td:first-child";
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
