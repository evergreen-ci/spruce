const patch = "5e4ff3abe3c3317e352062e4";
const TASK_DURATION_ROUTE = `/version/${patch}/task-duration`;

describe("Task Duration Tab", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  describe("when interacting with the filters on the page", () => {
    it("updates URL appropriately when task name filter is applied", () => {
      cy.visit(TASK_DURATION_ROUTE);
      const filterText = "test-annotation";
      // Apply text filter.
      cy.dataCy("task-name-filter-popover").click();
      cy.dataCy("input-filter").type(`${filterText}`).type("{enter}");
      cy.dataCy("task-duration-table-row").should("have.length", 2);
      cy.location("search").should(
        "include",
        `duration=DESC&page=0&taskName=${filterText}`
      );
      // Clear text filter.
      cy.dataCy("task-name-filter-popover").click();
      cy.dataCy("input-filter").clear().type("{enter}");
      cy.location("search").should("include", `page=0`);
    });

    it("updates URL appropriately when status filter is applied", () => {
      cy.visit(TASK_DURATION_ROUTE);

      // Apply status filter.
      cy.dataCy("status-filter-popover").click();
      cy.dataCy("tree-select-options").within(() =>
        cy.contains("Running").click({ force: true })
      );
      cy.dataCy("task-duration-table-row").should("have.length", 5);
      cy.location("search").should(
        "include",
        `duration=DESC&page=0&statuses=running-umbrella,started,dispatched`
      );
      // Clear status filter.
      cy.dataCy("status-filter-popover").click();
      cy.dataCy("tree-select-options").within(() =>
        cy.contains("Running").click({ force: true })
      );
      cy.location("search").should("include", `duration=DESC&page=0`);
    });

    it("updates URL appropriately when build variant filter is applied", () => {
      cy.visit(TASK_DURATION_ROUTE);
      const filterText = "Lint";
      // Apply text filter.
      cy.dataCy("build-variant-filter-popover").click();
      cy.dataCy("input-filter").type(`${filterText}`).type("{enter}");
      cy.dataCy("task-duration-table-row").should("have.length", 2);
      cy.location("search").should(
        "include",
        `duration=DESC&page=0&variant=${filterText}`
      );
      // Clear text filter.
      cy.dataCy("build-variant-filter-popover").click();
      cy.dataCy("input-filter").clear().type("{enter}");
      cy.location("search").should("include", `page=0`);
    });

    it("updates URL appropriately when sort is changing", () => {
      cy.visit(TASK_DURATION_ROUTE);
      // The default sort (DURATION DESC) should be applied
      cy.location("search").should("include", `duration=DESC`);
      const longestTask = "test-thirdparty";
      cy.contains(longestTask).should("be.visible");
      cy.dataCy("task-duration-table-row")
        .first()
        .should("contain", longestTask);

      // Apply new sort (DURATION ASC). The sort icon is clicked twice because LG assumes no
      // default sorting.
      cy.get(`[aria-label="sort"]`).click();
      cy.get(`[aria-label="sort"]`).click();
      cy.location("search").should("include", `duration=ASC&page=0`);
      const shortestTask = "test-auth";
      cy.contains(shortestTask).should("be.visible");
      cy.dataCy("task-duration-table-row")
        .first()
        .should("contain", shortestTask);
    });

    it("clearing all filters resets to the default sort", () => {
      cy.location("search").should("include", `duration=ASC&page=0`);
      cy.contains("Clear All Filters").click();
      cy.location("search").should("include", `duration=DESC`);
    });

    it("shows message when no test results are found", () => {
      cy.visit(TASK_DURATION_ROUTE);
      const filterText = "this_does_not_exist";

      cy.dataCy("task-name-filter-popover").click();
      cy.dataCy("input-filter").type(`${filterText}`).type("{enter}");
      cy.dataCy("task-duration-table-row").should("have.length", 0);
      cy.contains("No tasks found.").should("exist");
    });
  });
});
