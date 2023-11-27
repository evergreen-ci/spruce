describe("Task Duration Tab", () => {
  const patch = "5e4ff3abe3c3317e352062e4";
  const TASK_DURATION_ROUTE = `/version/${patch}/task-duration`;

  describe("when interacting with the filters on the page", () => {
    it("updates URL appropriately when task name filter is applied", () => {
      cy.visit(TASK_DURATION_ROUTE);
      const filterText = "test-annotation";
      // Apply text filter.
      cy.dataCy("task-name-filter-popover").click();
      cy.dataCy("task-name-filter-popover-input-filter").type(
        `${filterText}{enter}`
      );
      cy.dataCy("task-duration-table-row").should("have.length", 1);
      cy.location("search").should(
        "include",
        `duration=DESC&page=0&taskName=${filterText}`
      );
      // Clear text filter.
      cy.dataCy("task-name-filter-popover").click();
      cy.dataCy("task-name-filter-popover-input-filter").clear();
      cy.dataCy("task-name-filter-popover-input-filter").type("{enter}");
      cy.location("search").should("include", `page=0`);
    });

    it("updates URL appropriately when status filter is applied", () => {
      cy.visit(TASK_DURATION_ROUTE);

      // Apply status filter.
      cy.dataCy("status-filter-popover").click();
      cy.dataCy("tree-select-options").within(() =>
        cy.contains("Running").click({ force: true })
      );
      cy.dataCy("task-duration-table-row").should("have.length", 2);
      cy.location("search").should(
        "include",
        `duration=DESC&page=0&statuses=started`
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
      cy.dataCy("build-variant-filter-popover-input-filter").type(
        `${filterText}{enter}`
      );
      cy.dataCy("task-duration-table-row").should("have.length", 2);
      cy.location("search").should(
        "include",
        `duration=DESC&page=0&variant=${filterText}`
      );
      // Clear text filter.
      cy.dataCy("build-variant-filter-popover").click();
      cy.dataCy("build-variant-filter-popover-input-filter").clear();
      cy.dataCy("build-variant-filter-popover-input-filter").type("{enter}");
      cy.location("search").should("include", `page=0`);
    });

    it("updates URL appropriately when sort is changing", () => {
      cy.visit(TASK_DURATION_ROUTE);
      // The default sort (DURATION DESC) should be applied
      cy.location("search").should("include", "duration=DESC");
      const longestTask = "test-thirdparty";
      cy.contains(longestTask).should("be.visible");
      cy.dataCy("task-duration-table-row")
        .first()
        .should("contain", longestTask);
      cy.dataCy("duration-sort-icon").click();
      cy.location("search").should("include", "duration=ASC");
      const shortestTask = "generate-lint";
      cy.contains(shortestTask).should("be.visible");
      cy.dataCy("task-duration-table-row")
        .first()
        .should("contain", shortestTask);
    });

    it("clearing all filters resets to the default sort", () => {
      cy.visit(TASK_DURATION_ROUTE);
      cy.dataCy("duration-sort-icon").click();
      cy.location("search").should("include", "duration=ASC");
      cy.contains("Clear all filters").click();
      cy.location("search").should("include", "duration=DESC");
    });

    it("shows message when no test results are found", () => {
      cy.visit(TASK_DURATION_ROUTE);
      const filterText = "this_does_not_exist";

      cy.dataCy("task-name-filter-popover").click();
      cy.dataCy("task-name-filter-popover-input-filter").type(
        `${filterText}{enter}`
      );
      cy.dataCy("task-name-filter-popover-task-duration-table-row").should(
        "have.length",
        0
      );
      cy.contains("No tasks found.").should("exist");
    });
  });
});
