// / <reference types="Cypress" />

describe("commits page", () => {
  before(() => {
    cy.login();
    cy.visit("/commits/spruce");
  });
  beforeEach(() => {
    cy.preserveCookies();
  });

  it("should present a default view with only failing task icons visible", () => {
    cy.dataCy("waterfall-task-status-icon").should("exist");
    cy.dataCy("waterfall-task-status-icon").scrollIntoView();
    cy.dataCy("waterfall-task-status-icon").should("be.visible");
    cy.dataCy("waterfall-task-status-icon").should("have.length", 1);
    cy.dataCy("waterfall-task-status-icon").should(
      "have.attr",
      "aria-label",
      "failed icon"
    );
    cy.dataCy("grouped-task-status-badge").should("not.exist");
  });
  it("toggling chart types should change the charts in view", () => {
    cy.getInputByLabel("Absolute Number").should("be.checked");
    cy.dataCy("commit-chart-container").should(
      "have.attr",
      "data-type",
      "absolute"
    );
    cy.getInputByLabel("Percentage").click({ force: true });
    cy.getInputByLabel("Absolute Number").should("not.be.checked");
    cy.getInputByLabel("Percentage").should("be.checked");
    cy.dataCy("commit-chart-container").should(
      "have.attr",
      "data-type",
      "percentage"
    );
    cy.location("search").should("contain", "?chartType=percentage");
    cy.getInputByLabel("Absolute Number").click({ force: true });
    cy.getInputByLabel("Absolute Number").should("be.checked");
    cy.getInputByLabel("Percentage").should("not.be.checked");
    cy.dataCy("commit-chart-container").should(
      "have.attr",
      "data-type",
      "absolute"
    );
    cy.location("search").should("contain", "?chartType=absolute");
  });
  it("Should be able to paginate between pages", () => {
    cy.dataCy("prev-page-button").should("be.disabled");
    cy.dataCy("next-page-button").should("not.be.disabled");
    cy.dataCy("next-page-button").click();
    cy.dataCy("prev-page-button").should("not.be.disabled");
    cy.dataCy("prev-page-button").click();
    cy.dataCy("prev-page-button").should("be.disabled");
  });
  it("should only show matching requester filters", () => {
    cy.dataCy("requester-select").click();
    cy.dataCy("requester-select-options").should("be.visible");
    cy.dataCy("requester-select-options").within(() => {
      cy.getInputByLabel("Git Tag").should("exist");
      cy.getInputByLabel("Git Tag").should("not.be.checked");
      cy.getInputByLabel("Git Tag").check({ force: true });
    });
    cy.dataCy("requester-select").click();
    cy.dataCy("requester-select-options").should("not.exist");
    cy.dataCy("commit-label").should("exist");
    cy.dataCy("commit-label").each(($el) => {
      cy.wrap($el).should("contain.text", "Git Tag");
    });
  });
  describe("task filtering", () => {
    beforeEach(() => {
      cy.visit("/commits/spruce");
    });
    it("applying an `all` status filter should show all matching tasks with non failing tasks grouped", () => {
      cy.dataCy("project-task-status-select").should("exist");
      cy.dataCy("project-task-status-select").click();
      cy.dataCy("project-task-status-select-options").should("be.visible");
      cy.dataCy("project-task-status-select-options").within(() => {
        cy.getInputByLabel("All").should("exist");
        cy.getInputByLabel("All").should("not.be.checked");
        cy.getInputByLabel("All").check({ force: true });
      });
      cy.dataCy("project-task-status-select").click();
      cy.dataCy("project-task-status-select-options").should("not.be.visible");
      cy.dataCy("grouped-task-status-badge").should("exist");
      cy.dataCy("grouped-task-status-badge").should("have.length", 5);
      cy.dataCy("waterfall-task-status-icon").should("exist");
      cy.dataCy("waterfall-task-status-icon").should("have.length", 1);
    });
    it("applying a status filter should only show matching tasks", () => {
      cy.dataCy("project-task-status-select").should("exist");
      cy.dataCy("project-task-status-select").click();
      cy.dataCy("project-task-status-select-options").should("be.visible");
      cy.dataCy("project-task-status-select-options").within(() => {
        cy.getInputByLabel("Succeeded").should("exist");
        cy.getInputByLabel("Succeeded").should("not.be.checked");
        cy.getInputByLabel("Succeeded").check({ force: true });
      });
      cy.dataCy("project-task-status-select").click();
      cy.dataCy("project-task-status-select-options").should("not.be.visible");
      cy.dataCy("grouped-task-status-badge").should("exist");
      cy.dataCy("grouped-task-status-badge").should("have.length", 5);
      cy.dataCy("grouped-task-status-badge").should(
        "contain.text",
        "Succeeded"
      );
      cy.dataCy("waterfall-task-status-icon").should("not.exist");
    });
    it("applying a build variant filter should show all task statuses by default", () => {
      cy.getInputByLabel("Add New Build Variant Filter").type("Ubuntu");
      cy.getInputByLabel("Add New Build Variant Filter").type("{enter}");
      cy.dataCy("filter-badge").should("exist");
      cy.dataCy("filter-badge").should("have.length", 1);
      cy.dataCy("filter-badge").should("have.text", "buildVariants : Ubuntu");
      cy.location("search").should("contain", "?buildVariants=Ubuntu");
      cy.dataCy("grouped-task-status-badge").should("exist");
      cy.dataCy("grouped-task-status-badge").should("have.length", 5);
      cy.dataCy("waterfall-task-status-icon").should("exist");
      cy.dataCy("waterfall-task-status-icon").should("have.length", 1);
      cy.dataCy("waterfall-task-status-icon").should(
        "have.attr",
        "aria-label",
        "failed icon"
      );
    });
    it("applying a task filter should show all task icons instead of groupings", () => {
      cy.dataCy("tuple-select-dropdown").should("exist");
      cy.dataCy("tuple-select-dropdown").click();
      cy.dataCy("tuple-select-option-taskNames").should("be.visible");
      cy.dataCy("tuple-select-option-taskNames").click();
      cy.getInputByLabel("Add New Task Filter").type(".");
      cy.getInputByLabel("Add New Task Filter").type("{enter}");
      cy.dataCy("grouped-task-status-badge").should("not.exist");
      cy.dataCy("waterfall-task-status-icon").should("exist");
      cy.dataCy("waterfall-task-status-icon").should("have.length", 33);
      cy.dataCy("waterfall-task-status-icon")
        .get("[aria-label='failed icon']")
        .should("exist");
      cy.dataCy("waterfall-task-status-icon")
        .get("[aria-label='failed icon']")
        .should("have.length", 1);
      cy.dataCy("waterfall-task-status-icon")
        .get("[aria-label='success icon']")
        .should("exist");
      cy.dataCy("waterfall-task-status-icon")

        .get("[aria-label='success icon']")
        .should("have.length", 32);
    });
    it("should hide commits that don't match applied filters", () => {
      cy.dataCy("project-task-status-select").should("exist");
      cy.dataCy("project-task-status-select").click();
      cy.dataCy("project-task-status-select-options").should("be.visible");
      cy.dataCy("project-task-status-select-options").within(() => {
        cy.getInputByLabel("Failed").should("exist");
        cy.getInputByLabel("Failed").should("not.be.checked");
        cy.getInputByLabel("Failed").check({ force: true });
      });
      cy.dataCy("project-task-status-select").click();
      cy.dataCy("project-task-status-select-options").should("not.be.visible");
      cy.dataCy("grouped-task-status-badge").should("not.exist");
      cy.dataCy("inactive-commits-button").should("exist");
      cy.dataCy("inactive-commits-button").should("have.length", 4);
      cy.dataCy("inactive-commits-button").each(($el) => {
        cy.wrap($el).should("contain.text", "Unmatching");
      });
    });
  });
  describe("inactive / unmatching commit tooltips", () => {
    before(() => {
      cy.visit("/commits/spruce");
    });
    it("should collapse inactive commits when no filters are applied", () => {
      cy.dataCy("inactive-commits-button").should("exist");
      cy.dataCy("inactive-commits-button").should("have.text", "1Inactive");
    });
    it("should open a tooltip with inactive commit details", () => {
      cy.dataCy("inactive-commits-button").click();
      cy.dataCy("inactive-commits-tooltip").should("exist");
      cy.dataCy("inactive-commits-tooltip").should(
        "contain.text",
        "1 Inactive Commit"
      );
      cy.dataCy("inactive-commits-tooltip").should("contain.text", "e695f65");
    });
  });
  describe("task icons", () => {
    before(() => {
      cy.visit("/commits/spruce");
    });
    it("hovering on a failing task should reveal task metadata along side test results", () => {
      cy.dataCy("waterfall-task-status-icon").should("exist");
      cy.dataCy("waterfall-task-status-icon").should("have.length", 1);
      cy.dataCy("waterfall-task-status-icon").should(
        "have.attr",
        "aria-label",
        "failed icon"
      );
      cy.dataCy("waterfall-task-status-icon").first().trigger("mouseover");
      cy.dataCy("waterfall-task-status-icon-tooltip").should("exist");
      cy.dataCy("waterfall-task-status-icon-tooltip").should("be.visible");
      cy.dataCy("waterfall-task-status-icon-tooltip").should(
        "contain.text",
        "check_codegen"
      );
      cy.dataCy("waterfall-task-status-icon-tooltip").should(
        "contain.text",
        "JustAFakeTestInALonelyWorld"
      );
    });
    it("clicking on a task icon should direct you to the task page", () => {
      cy.dataCy("waterfall-task-status-icon").first().click();
      cy.location("pathname").should("contain", "/task/");
    });
  });
});
