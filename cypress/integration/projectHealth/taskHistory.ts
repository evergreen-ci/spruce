// / <reference types="Cypress" />

// TODO: Reenable this test after PM-1976 is resolved
// This fails because the links are not active
describe.skip("task history", () => {
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    cy.preserveCookies();
  });

  it("should be linked to from the task page", () => {
    cy.visit(`/task/${taskId}`);
    cy.contains("See history").should("exist");
    cy.contains("See history").click();
    cy.location("pathname").should("eq", "/task-history/spruce/check_codegen");
  });
  it("should be able expand and collapse inactive commits", () => {
    // Expand
    cy.contains("EVG-16356").should("not.exist");
    cy.contains("Expand 1 inactive").should("exist");
    cy.contains("Expand 1 inactive").click();
    cy.contains("EVG-16356").should("exist");

    // Collapse
    cy.contains("Expand 1 inactive").should("not.exist");
    cy.contains("Collapse 1 inactive").should("exist");
    cy.contains("Collapse 1 inactive").click();
    cy.contains("EVG-16356").should("not.exist");
  });
  it("clicking on a failing test history button should show the task history view with the failing test filter applied", () => {
    cy.visit(`/task/${taskId}`);

    cy.dataCy("task-history-tests-btn").click();
    cy.location("pathname").should(
      "contain",
      `/task-history/spruce/check_codegen`
    );
    cy.dataCy("filter-badge").should("exist");
    cy.dataCy("filter-badge").should("contain.text", "JustAFake");
  });
  it("hovering over a failing task should show test results", () => {
    cy.dataCy("history-table-icon")
      .get("[data-status=failed]")
      .should("have.length", 1);
    cy.dataCy("history-table-icon")
      .get("[data-status=failed]")
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

const taskId =
  "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35";
