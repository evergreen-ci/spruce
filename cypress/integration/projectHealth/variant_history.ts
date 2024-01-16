describe("variant history", () => {
  it("shows an error message if mainline commit history could not be retrieved", () => {
    cy.visit("/variant-history/bogus-project/bogus-variant");
    cy.dataCy("loading-cell").should("have.length", 0);
    cy.validateToast(
      "error",
      "There was an error loading the variant history: Could not find project with id: bogus-project",
    );
  });

  it("should link to a specific commit from the project health page", () => {
    cy.visit("/commits/spruce");
    cy.dataCy("variant-header").should("exist");
    cy.dataCy("variant-header").should("contain.text", "Ubuntu 16.04");
    cy.dataCy("variant-header").first().click();
    cy.location("pathname").should("eq", "/variant-history/spruce/ubuntu1604");
    cy.location("search").should("eq", "?selectedCommit=1236");
    cy.contains("v2.28.5").should("be.visible");
    cy.get("[data-selected='true']").should("exist");
    cy.get("[data-selected='true']").should("contain.text", "v2.28.5");
  });
  it(
    "should be able to paginate column headers",
    {
      viewportHeight: 600,
      viewportWidth: 1000,
    },
    () => {
      cy.visit("/variant-history/spruce/ubuntu1604");
      cy.dataCy("header-cell").should("have.length", 4);
      cy.dataCy("next-page-button").click();
      cy.dataCy("header-cell").should("have.length", 4);
      cy.dataCy("prev-page-button").click();
      cy.dataCy("header-cell").should("have.length", 4);
    },
  );
  it("should be able expand and collapse inactive commits", () => {
    cy.visit("/variant-history/spruce/ubuntu1604?selectedCommit=1238");
    // Expand
    cy.contains("EVG-16356").should("not.exist");
    cy.contains("Expand 1 inactive").should("be.visible");
    cy.contains("Expand 1 inactive").click();
    cy.contains("EVG-16356").should("be.visible");

    // Collapse
    cy.contains("Collapse 1 inactive").should("be.visible");
    cy.contains("Collapse 1 inactive").click();
    cy.contains("EVG-16356").should("not.be.visible");
  });
  it("should be able to filter column headers", () => {
    cy.visit("/variant-history/spruce/ubuntu1604");
    cy.dataCy("header-cell").should("have.length", 9);

    cy.getInputByLabel("Tasks").click();
    cy.get("[aria-label='compile']").click();
    cy.get("[aria-label='e2e_test']").click();

    cy.getInputByLabel("Tasks").click();
    cy.dataCy("header-cell").should("have.length", 2);

    // removing column header filters should restore all columns
    cy.getInputByLabel("Tasks").click();
    cy.get("[aria-label='compile']").click();
    cy.get("[aria-label='e2e_test']").click();

    cy.getInputByLabel("Tasks").click();
    cy.dataCy("header-cell").should("have.length", 9);
  });
  it("hovering over a failing task should show test results", () => {
    cy.visit(
      "/variant-history/spruce/ubuntu1604?failed=JustAFakeTestInALonelyWorld&selectedCommit=1236",
    );
    cy.dataCy("history-table-icon")
      .get("[data-status=failed]")
      .should("have.length", 3);
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
      cy.visit("/variant-history/spruce/ubuntu1604");
      cy.getInputByLabel("Filter by Failed Tests").should("exist");
      cy.getInputByLabel("Filter by Failed Tests")
        .focus()
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
