import {
  clickOnPageSizeBtnAndAssertURLandTableSize,
  waitForTaskTable,
} from "../../utils";

const pathTasks = "/version/5e4ff3abe3c3317e352062e4/tasks";
const patchDescriptionTasksExist = "dist";

describe("Task table", () => {
  it("Loading skeleton does not persist when you navigate to Patch page from My Patches and adjust a filter", () => {
    cy.visit("user/patches");
    cy.dataCy("patch-card-patch-link")
      .filter(`:contains(${patchDescriptionTasksExist})`)
      .click();
    cy.dataCy("tasks-table").should("exist");
  });

  it("Updates sorting in the url when column headers are clicked", () => {
    cy.visit(pathTasks);
    waitForTaskTable();
    // TODO: Remove wait in DEVPROD-597.
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200);
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC",
    );

    const nameSortControl = "button[aria-label='Sort by Name']";
    const statusSortControl = "button[aria-label='Sort by Task Status']";
    const baseStatusSortControl =
      "button[aria-label='Sort by Previous Status']";
    const variantSortControl = "button[aria-label='Sort by Variant']";

    cy.get(nameSortControl).click();
    cy.location("search").should("contain", "BASE_STATUS%3ADESC%3BNAME%3AASC");

    cy.get(variantSortControl).click();
    cy.location("search").should("contain", "sorts=NAME%3AASC%3BVARIANT%3AASC");

    cy.get(statusSortControl).click();
    cy.location("search").should(
      "contain",
      "sorts=VARIANT%3AASC%3BSTATUS%3AASC",
    );

    cy.get(baseStatusSortControl).click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3AASC",
    );

    cy.get(baseStatusSortControl).click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC",
    );

    cy.get(baseStatusSortControl).click();
    cy.location("search").should("contain", "sortBy=STATUS&sortDir=ASC");
  });

  it("Clicking task name goes to task page for that task", () => {
    cy.visit(pathTasks);
    cy.dataCy("tasks-table-row")
      .eq(0)
      .within(() => {
        cy.get("a").should("have.attr", "href").and("include", "/task");
      });
  });

  it("Task count displays total tasks", () => {
    cy.visit(pathTasks);
    cy.dataCy("total-count").first().contains("46");
  });

  describe("Changing page number", () => {
    // Instead of checking the entire table rows lets just check if the elements on the table have changed
    it("Displays the next page of results and updates URL when right arrow is clicked and next page exists", () => {
      cy.visit(`${pathTasks}?page=0`);
      cy.dataCy(dataCyTableRows).should("be.visible");

      const firstPageRows = tableRowToText(dataCyTableRows);
      cy.dataCy(dataCyNextPage).click();
      cy.dataCy(dataCyTableRows).should("be.visible");

      const secondPageRows = tableRowToText(dataCyTableRows);
      expect(firstPageRows).to.not.eq(secondPageRows);
    });

    it("Displays the previous page of results and updates URL when the left arrow is clicked and previous page exists", () => {
      cy.visit(`${pathTasks}?page=1`);
      cy.dataCy(dataCyTableRows).should("be.visible");
      const secondPageRows = tableRowToText(dataCyTableRows);
      cy.dataCy(dataCyPrevPage).click();
      cy.dataCy(dataCyTableRows).should("be.visible");
      const firstPageRows = tableRowToText(dataCyTableRows);
      expect(firstPageRows).to.not.eq(secondPageRows);
    });

    it("Does not update results or URL when left arrow is clicked and previous page does not exist", () => {
      cy.visit(`${pathTasks}?page=0`);
      cy.dataCy(dataCyTableRows).should("be.visible");
      cy.dataCy(dataCyPrevPage).should("have.attr", "aria-disabled", "true");
    });

    it("Does not update results or URL when right arrow is clicked and next page does not exist", () => {
      cy.visit(`${pathTasks}?page=4`);
      cy.dataCy(dataCyTableRows).should("be.visible");
      cy.dataCy(dataCyNextPage).should("have.attr", "aria-disabled", "true");
    });
  });

  describe("Changing page limit", () => {
    it("Changing page size updates URL and renders less than or equal to that many rows", () => {
      [20, 50, 100].forEach((pageSize) => {
        it(`when the page size is set to ${pageSize}`, () => {
          cy.visit(pathTasks);
          cy.dataCy("tasks-table").should("exist");
          cy.dataCy(dataCyTableRows).should("be.visible");
          clickOnPageSizeBtnAndAssertURLandTableSize(
            pageSize,
            dataCyTableDataRows,
          );
        });
      });
    });
  });

  describe("blocked tasks", () => {
    beforeEach(() => {
      cy.visit(pathTasks);
      waitForTaskTable();
    });

    it("shows the blocking tasks when hovering over status badge", () => {
      cy.dataCy("depends-on-tooltip").should("not.exist");
      cy.dataCy("task-status-badge").contains("Blocked").trigger("mouseover");
      cy.dataCy("depends-on-tooltip").should("be.visible");
      cy.dataCy("depends-on-tooltip").contains(
        "Depends on tasks: “test-migrations”, “test-graphql”",
      );
    });
  });
});

const dataCyTableDataRows = "[data-cy=tasks-table-row]";
const dataCyTableRows = "tasks-table-row";
const dataCyNextPage = "next-page-button";
const dataCyPrevPage = "prev-page-button";

const tableRowToText = (selector: string) =>
  new Cypress.Promise((resolve) => {
    cy.dataCy(selector)
      .invoke("text")
      .then((txt) => resolve(txt.toString()));
  });
