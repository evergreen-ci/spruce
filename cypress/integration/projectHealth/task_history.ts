describe("task history", () => {
  it("shows an error message if mainline commit history could not be retrieved", () => {
    cy.visit("/task-history/bogus-project/bogus-task");
    cy.dataCy("loading-cell").should("have.length", 0);
    cy.validateToast(
      "error",
      "There was an error loading the task history: Could not find project with id: bogus-project",
    );
  });

  it("link from task page should link to the commit and scroll to it", () => {
    cy.visit(`/task/${taskId}`);
    cy.contains("See history").should("exist");
    cy.contains("See history").click();
    cy.location("pathname").should("eq", "/task-history/spruce/check_codegen");
    cy.location("search").should("contain", `selectedCommit=1236`);
    cy.dataCy("commit-label")
      .contains("Mohamed Khelif -v2.28.5")
      .should("be.visible");
  });
  it("should be able expand and collapse inactive commits", () => {
    cy.visit("/task-history/spruce/check_codegen");
    // Expand
    cy.contains("2ab1c56").should("not.be.visible");
    cy.contains("Expand 1 inactive").should("be.visible");
    cy.contains("Expand 1 inactive").click();
    cy.contains("2ab1c56").should("be.visible");

    // Collapse
    cy.contains("Expand 1 inactive").should("have.length", 1);
    cy.contains("Collapse 1 inactive").should("be.visible");
    cy.contains("Collapse 1 inactive").click();
    cy.contains("2ab1c56").should("not.be.visible");
  });

  it("clicking on a failing test history button should show the task history view with the failing test filter applied", () => {
    cy.visit(`/task/${taskId}`);
    cy.dataCy("task-history-tests-btn").click();
    cy.location("pathname").should(
      "contain",
      `/task-history/spruce/check_codegen`,
    );
    cy.dataCy("filter-badge").should("exist");
    cy.dataCy("filter-badge").should("contain.text", "JustAFake");
  });
  it("hovering over a failing task should show test results", () => {
    cy.visit(
      "/task-history/spruce/check_codegen?failed=JustAFakeTestInALonelyWorld&selectedCommit=1236",
    );
    cy.dataCy("history-table-icon").get("[data-status=failed]").should("exist");
    cy.dataCy("history-table-icon")
      .get("[data-status=failed]")
      .first()
      .scrollIntoView();
    cy.dataCy("history-table-icon")
      .get("[data-status=failed]")
      .should("be.visible");
    cy.dataCy("history-table-icon")
      .get("[data-status=failed]")
      .first()
      .trigger("mouseover");
    cy.dataCy("test-tooltip").should("be.visible");
    cy.dataCy("test-tooltip").contains("JustAFakeTestInALonelyWorld");
    cy.dataCy("history-table-icon")
      .get("[data-status=failed]")
      .first()
      .trigger("mouseout");
  });
  describe("applying a test filter", () => {
    beforeEach(() => {
      cy.visit("/task-history/spruce/check_codegen");
      cy.getInputByLabel("Filter by Failed Tests").should("exist");
      cy.getInputByLabel("Filter by Failed Tests")
        .type("JustAFakeTestInALonelyWorld")
        .type("{enter}");
      cy.dataCy("filter-badge").should("exist");
      cy.dataCy("filter-badge").should("contain.text", "JustAFake");
    });
    it("should disable non matching tasks", () => {
      cy.dataCy("history-table-icon")
        .get("[data-status=success]")
        .each(($el) => {
          cy.wrap($el).should("have.attr", "aria-disabled", "true");
        });
    });
    it("should display a message and tooltip on matching tasks with test results", () => {
      cy.contains("1 / 1 Failing Tests").should("exist");
      cy.contains("1 / 1 Failing Tests").trigger("mouseover");
      cy.dataCy("test-tooltip").should("be.visible");
      cy.dataCy("test-tooltip").contains("JustAFakeTestInALonelyWorld");
    });
  });
});

const taskId =
  "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35";
