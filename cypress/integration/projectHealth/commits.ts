// / <reference types="Cypress" />

describe("commits page", () => {
  before(() => {
    cy.login();
    cy.visit("/commits/spruce");
  });
  beforeEach(() => {
    cy.preserveCookies();
  });
  it("visiting the commits page for the first time should show a welcome modal", () => {
    cy.dataCy("welcome-modal").should("be.visible");
    cy.dataCy("close-welcome-modal").click();
    cy.reload();
    cy.dataCy("welcome-modal").should("not.exist");
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
  it("should be able to collapse/expand commit graph which retains state when paginating", () => {
    cy.dataCy("commit-chart-container").should("exist");
    cy.dataCy("commit-chart-container").should("be.visible");
    cy.dataCy("accordion-toggle").contains("Project Health").click();

    cy.dataCy("commit-chart-container").should("not.be.visible");

    cy.dataCy("next-page-button").click();
    cy.dataCy("commit-chart-container").should("not.be.visible");
    cy.location("search").should("contain", "chartOpen=false");

    cy.dataCy("accordion-toggle").contains("Project Health").click();
    cy.dataCy("commit-chart-container").should("be.visible");
    cy.dataCy("prev-page-button").click();
    cy.dataCy("commit-chart-container").should("be.visible");
    cy.location("search").should("contain", "chartOpen=true");
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
    cy.location("search").should(
      "contain",
      "?chartOpen=true&chartType=percentage"
    );
    cy.getInputByLabel("Absolute Number").click({ force: true });
    cy.getInputByLabel("Absolute Number").should("be.checked");
    cy.getInputByLabel("Percentage").should("not.be.checked");
    cy.dataCy("commit-chart-container").should(
      "have.attr",
      "data-type",
      "absolute"
    );
    cy.location("search").should(
      "contain",
      "?chartOpen=true&chartType=absolute"
    );
  });
  it("Should be able to paginate between commits", () => {
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
      cy.dataCy("project-task-status-select-options").should("not.exist");
      cy.dataCy("grouped-task-status-badge").should("have.length", 5);
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
      cy.dataCy("project-task-status-select-options").should("not.exist");
      cy.dataCy("grouped-task-status-badge").should("have.length", 5);
      cy.dataCy("grouped-task-status-badge").should(
        "contain.text",
        "Succeeded"
      );
      cy.dataCy("waterfall-task-status-icon").should("not.exist");
    });
    it("applying a build variant filter should show all task statuses by default", () => {
      cy.getInputByLabel("Add New Build Variant Filter")
        .type("Ubuntu")
        .type("{enter}");
      cy.dataCy("filter-badge").should("have.length", 1);
      cy.dataCy("filter-badge").should("have.text", "buildVariants : Ubuntu");
      cy.location("search").should("contain", "?buildVariants=Ubuntu");
      cy.dataCy("grouped-task-status-badge").should("have.length", 5);
      cy.dataCy("waterfall-task-status-icon").should("have.length", 1);
      cy.dataCy("waterfall-task-status-icon").should(
        "have.attr",
        "aria-label",
        "failed icon"
      );
    });
    it("applying a task filter should show all task icons instead of groupings", () => {
      cy.get("button").contains("Build Variant").should("exist");
      cy.get("button").contains("Build Variant").click({ force: true });
      cy.get("li").contains("Task").should("be.visible");
      cy.get("li").contains("Task").click();
      cy.getInputByLabel("Add New Task Filter").type(".").type("{enter}");
      cy.dataCy("grouped-task-status-badge").should("not.exist");
      cy.dataCy("waterfall-task-status-icon").should("have.length", 26);
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
        .should("have.length", 25);
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
      cy.dataCy("project-task-status-select-options").should("not.exist");
      cy.dataCy("grouped-task-status-badge").should("not.exist");
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
      cy.contains("e695f65").should(
        "have.attr",
        "href",
        "/version/spruce_e695f654c8b4b959d3e12e71696c3e318bcd4c33/tasks"
      );
    });
  });
  describe("task icons", () => {
    describe("individual task icons", () => {
      before(() => {
        cy.visit("/commits/spruce");
      });
      it("hovering on a failing task should reveal task metadata along side test results", () => {
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

    describe("grouped task status badges", () => {
      before(() => {
        cy.visit("/commits/spruce");
        cy.dataCy("project-task-status-select").should("exist");
        cy.dataCy("project-task-status-select").click();
        cy.dataCy("project-task-status-select-options").should("be.visible");
        cy.dataCy("project-task-status-select-options").within(() => {
          cy.getInputByLabel("All").should("exist");
          cy.getInputByLabel("All").should("not.be.checked");
          cy.getInputByLabel("All").check({ force: true });
        });
        cy.dataCy("project-task-status-select").click();
        cy.dataCy("project-task-status-select-options").should("not.exist");
      });
      it("hovering over a badge should show metadata about the task statuses", () => {
        cy.dataCy("grouped-task-status-badge").should("exist");
        cy.dataCy("grouped-task-status-badge").first().scrollIntoView();
        cy.dataCy("grouped-task-status-badge").should("have.length", 5);
        cy.dataCy("grouped-task-status-badge").first().trigger("mouseover");
        cy.dataCy("grouped-task-status-badge-tooltip").should("exist");
        cy.dataCy("grouped-task-status-badge-tooltip").should("be.visible");
        cy.dataCy("grouped-task-status-badge-tooltip").should(
          "contain.text",
          "1 Succeeded"
        );
      });
      it("should direct you to the version page with the build variant and task status filters applied", () => {
        cy.dataCy("grouped-task-status-badge").first().click();
        cy.location("pathname").should("contain", "/version/");
        cy.location("search").should("contain", "statuses=success");
        cy.location("search").should("contain", "variant=%5Eubuntu1604%24"); // %5E and %24 are the url encoded values used for strictRegex matching
      });
    });
  });
});
