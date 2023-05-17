import { clickOnPageSizeBtnAndAssertURLandTableSize } from "../../utils";

const pathTasks = `/version/5e4ff3abe3c3317e352062e4/tasks`;
const patchDescriptionTasksExist = "dist";

describe("Task table", () => {
  it("Loading skeleton does not persist when you navigate to Patch page from My Patches and adjust a filter", () => {
    cy.visit("user/patches");
    cy.dataCy("patch-card-patch-link")
      .filter(`:contains(${patchDescriptionTasksExist})`)
      .click();
    cy.dataCy("tasks-table").should("exist");
  });

  it("Updates the url when column headers are clicked", () => {
    cy.visit(pathTasks);
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC"
    );

    cy.get("th.cy-task-table-col-NAME").click({ force: true });
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BNAME%3AASC"
    );

    cy.get("th.cy-task-table-col-NAME").click({ force: true });
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BNAME%3ADESC"
    );

    cy.get("th.cy-task-table-col-NAME").click({ force: true });
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC"
    );

    cy.get("th.cy-task-table-col-VARIANT").click({ force: true });
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BVARIANT%3AASC"
    );

    cy.get("th.cy-task-table-col-VARIANT").click({ force: true });
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BVARIANT%3ADESC"
    );

    cy.get("th.cy-task-table-col-VARIANT").click({ force: true });
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
    cy.dataCy("total-count").contains("50");
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
    it(`Fetches tasks sorted by ${sortBy} when ${sortBy} header is clicked`, () => {
      // clickSorterAndAssertTasksAreFetched(sortBy);
    });
  });

  describe("Changing page number", () => {
    // Instead of checking the entire table rows lets just check if the elements on the table have changed
    it("Displays the next page of results and updates URL when right arrow is clicked and next page exists", () => {
      cy.visit(`${pathTasks}?page=0`);
      cy.contains("test-cloud");
      const firstPageRows = tableRowToText(dataCyTableRows);
      cy.get(dataCyNextPage).click();
      cy.contains("js-test");
      const secondPageRows = tableRowToText(dataCyTableRows);

      expect(firstPageRows).to.not.eq(secondPageRows);
    });

    it("Displays the previous page of results and updates URL when the left arrow is clicked and previous page exists", () => {
      cy.visit(`${pathTasks}?page=1`);
      cy.contains("js-test");
      const secondPageRows = tableRowToText(dataCyTableRows);
      cy.get(dataCyPrevPage).click();
      cy.contains("test-cloud");
      const firstPageRows = tableRowToText(dataCyTableRows);
      expect(firstPageRows).to.not.eq(secondPageRows);
    });

    it("Does not update results or URL when left arrow is clicked and previous page does not exist", () => {
      cy.visit(`${pathTasks}?page=0`);
      cy.get(dataCyPrevPage).should("have.attr", "aria-disabled", "true");
    });

    it("Does not update results or URL when right arrow is clicked and next page does not exist", () => {
      cy.visit(`${pathTasks}?page=4`);
      cy.get(dataCyNextPage).should("have.attr", "aria-disabled", "true");
    });
  });

  describe("Changing page limit", () => {
    it("Changing page size updates URL and renders less than or equal to that many rows", () => {
      [20, 50, 100].forEach((pageSize) => {
        it(`when the page size is set to ${pageSize}`, () => {
          cy.visit(pathTasks);
          cy.dataCy("tasks-table").should("exist");
          clickOnPageSizeBtnAndAssertURLandTableSize(
            pageSize,
            dataCyTableDataRows
          );
        });
      });
    });
  });
});

const dataCyTableDataRows = ".ant-table-cell > .cy-task-table-col-NAME";

const dataCyTableRows = ".ant-table-cell.cy-task-table-col-NAME";

const TABLE_SORT_SELECTOR = ".ant-table-column-sorters";

const dataCyNextPage = ".ant-pagination-next";
const dataCyPrevPage = ".ant-pagination-prev";

const tableRowToText = (selector: string) =>
  new Cypress.Promise((resolve) => {
    cy.get(selector)
      .invoke("text")
      .then((txt) => resolve(txt.toString()));
  });
