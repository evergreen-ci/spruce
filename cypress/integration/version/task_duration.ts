const patch = "5e4ff3abe3c3317e352062e4";
const TASK_DURATION_ROUTE = `/version/${patch}/task-duration`;

// Can't test due to isBeta() flag.
describe.skip("Task Duration Tab", () => {
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
        `page=0&sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BDURATION%3ADESC&taskName=${filterText}`
      );
      // Clear text filter.
      cy.dataCy("task-name-filter-popover").click();
      cy.dataCy("input-filter").clear().type("{enter}");
      cy.location("search").should("include", `page=0`);
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
        `page=0&sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BDURATION%3ADESC&variant=${filterText}`
      );
      // Clear text filter.
      cy.dataCy("build-variant-filter-popover").click();
      cy.dataCy("input-filter").clear().type("{enter}");
      cy.location("search").should("include", `page=0`);
    });

    it("updates URL appropriately when sort is changing", () => {
      cy.visit(TASK_DURATION_ROUTE);
      // The default sort (DURATION DESC) should be applied
      cy.location("search").should(
        "include",
        `sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BDURATION%3ADESC`
      );
      const longestTask = "test-thirdparty";
      cy.contains(longestTask).should("be.visible");
      cy.dataCy("task-duration-table-row")
        .first()
        .should("contain", longestTask);

      // Apply new sort (DURATION ASC)
      cy.dataCy("sort-icon").click();
      cy.location("search").should(
        "include",
        `page=0&sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BDURATION%3AASC`
      );
      const shortestTask = "test-auth";
      cy.contains(shortestTask).should("be.visible");
      cy.dataCy("task-duration-table-row")
        .first()
        .should("contain", shortestTask);
    });

    it("clearing all filters resets to the default sort", () => {
      cy.location("search").should(
        "include",
        `page=0&sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BDURATION%3AASC`
      );
      cy.contains("Clear All Filters").click();
      cy.location("search").should(
        "include",
        `sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BDURATION%3ADESC`
      );
    });

    it("shows message when no test results are found", () => {
      cy.visit(TASK_DURATION_ROUTE);
      const filterText = "this_does_not_exist";

      cy.dataCy("task-name-filter-popover").click();
      cy.dataCy("input-filter").type(`${filterText}`).type("{enter}");
      cy.dataCy("task-duration-table-row").should("have.length", 0);
      cy.contains("No test results found.").should("exist");
    });
  });
});
