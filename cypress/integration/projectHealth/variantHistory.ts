// / <reference types="Cypress" />

describe("variant history", () => {
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    cy.preserveCookies();
  });

  it("should link to a specific commit from the project health page", () => {
    cy.visit("/commits/spruce");
    cy.dataCy("variant-header").should("exist");
    cy.dataCy("variant-header").scrollIntoView();
    cy.dataCy("variant-header").should("be.visible");
    cy.dataCy("variant-header").should("contain.text", "Ubuntu 16.04");
    cy.dataCy("variant-header").click();
    cy.location("pathname").should("eq", "/variant-history/spruce/ubuntu1604");
    cy.location("search").should("eq", "?selectedCommit=1236");
    cy.contains("Triggered From Git Tag").should("be.visible");
    cy.get("[data-selected='true']").should("exist");
    cy.get("[data-selected='true']").should("contain.text", "v2.28.5");
  });
  it("should be able to paginate column headers", () => {
    cy.dataCy("header-cell").should("have.length", 7);
    cy.dataCy("next-page-button").click();
    cy.dataCy("header-cell").should("have.length", 2);
    cy.dataCy("prev-page-button").click();
    cy.dataCy("header-cell").should("have.length", 7);
  });
  it("should be able expand and collapse inactive commits", () => {
    cy.visit("/variant-history/spruce/ubuntu1604");
    // Expand
    cy.contains("EVG-16356").should("not.be.visible");
    cy.contains("Expand 1 inactive").should("exist");
    cy.contains("Expand 1 inactive").click();
    cy.contains("EVG-16356").should("be.visible");

    // Collapse
    cy.contains("Expand 1 inactive").should("not.exist");
    cy.contains("Collapse 1 inactive").should("exist");
    cy.contains("Collapse 1 inactive").click();
    cy.contains("EVG-16356").should("not.be.visible");
  });
  it("should be able to filter column headers", () => {
    cy.dataCy("header-cell").should("have.length", 7);
    cy.getInputByLabel("Tasks").click();
    cy.getInputByLabel("Tasks").within(($el) => {
      cy.wrap($el)
        .dataCy("searchable-dropdown-option")
        .contains("compile")
        .click();
      cy.wrap($el)
        .dataCy("searchable-dropdown-option")
        .contains("e2e_test")
        .click();
    });
    cy.getInputByLabel("Tasks").click();
    cy.dataCy("header-cell").should("have.length", 2);
  });
  it("removing column header filters should restore all columns", () => {
    cy.dataCy("header-cell").should("have.length", 2);
    cy.getInputByLabel("Tasks").click();
    cy.getInputByLabel("Tasks").within(($el) => {
      cy.wrap($el)
        .dataCy("searchable-dropdown-option")
        .contains("compile")
        .click();
      cy.wrap($el)
        .dataCy("searchable-dropdown-option")
        .contains("e2e_test")
        .click();
    });
    cy.getInputByLabel("Tasks").click();
    cy.dataCy("header-cell").should("have.length", 7);
  });
  it("hovering over a failing task should show test results", () => {
    cy.dataCy("history-table-icon")
      .get("[data-status=failed]")
      .should("have.length", 1);
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
    before(() => {
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
    it("should display a message on matching tasks", () => {
      cy.contains("1 / 1 Failing Tests").should("exist");
    });
    it("should have a tooltip on matching tests with test results", () => {
      cy.contains("1 / 1 Failing Tests").should("exist");
      cy.contains("1 / 1 Failing Tests").trigger("mouseover");
      cy.dataCy("test-tooltip").should("be.visible");
      cy.dataCy("test-tooltip").contains("JustAFakeTestInALonelyWorld");
    });
  });
});
