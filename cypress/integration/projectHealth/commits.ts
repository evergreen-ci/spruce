describe("commits page", () => {
  beforeEach(() => {
    cy.visit("/commits/spruce");
  });
  it("should present a default view with only failing task icons visible", () => {
    cy.dataCy("waterfall-task-status-icon").should("exist");
    cy.dataCy("waterfall-task-status-icon")
      .should("be.visible")
      .should("have.length", 2);
    cy.dataCy("waterfall-task-status-icon").should(
      "have.attr",
      "aria-label",
      "failed icon"
    );
    cy.dataCy("grouped-task-status-badge").should("not.exist");
  });

  it("shows all icons and no badges when the view is toggled", () => {
    cy.dataCy("waterfall-task-status-icon").should("exist");

    cy.dataCy("view-all").click();
    cy.dataCy("waterfall-task-status-icon")
      .should("be.visible")
      .should("have.length", 50);
    cy.dataCy("grouped-task-status-badge").should("have.length", 0);
    cy.location("search").should("contain", "view=ALL");

    cy.dataCy("view-failed").click();
    cy.dataCy("waterfall-task-status-icon")
      .should("be.visible")
      .should("have.length", 2);
  });

  it("shows all icons when loaded with the view all query param", () => {
    cy.visit(`/commits/spruce?view=ALL`);
    cy.dataCy("waterfall-task-status-icon")
      .should("be.visible")
      .should("have.length", 50);
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
    cy.location("search").should("contain", "chartType=percentage");
    cy.getInputByLabel("Absolute Number").click({ force: true });
    cy.getInputByLabel("Absolute Number").should("be.checked");
    cy.getInputByLabel("Percentage").should("not.be.checked");
    cy.dataCy("commit-chart-container").should(
      "have.attr",
      "data-type",
      "absolute"
    );
    cy.location("search").should("contain", "chartType=absolute");
  });
  it("Should be able to paginate between commits", () => {
    cy.dataCy("prev-page-button").should("have.attr", "aria-disabled", "true");
    cy.dataCy("next-page-button").should(
      "not.have.attr",
      "aria-disabled",
      "true"
    );
    cy.dataCy("next-page-button").click();
    cy.dataCy("prev-page-button").should(
      "not.have.attr",
      "aria-disabled",
      "true"
    );
    cy.dataCy("prev-page-button").click();
    cy.dataCy("prev-page-button").should("have.attr", "aria-disabled", "true");
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
  it("resizing the page adjusts the number of commits rendered", () => {
    cy.visit("/commits/spruce");
    cy.dataCy("commit-chart-container").should("have.length", 9);
    cy.viewport(2560, 1440);
    cy.dataCy("commit-chart-container").should("have.length", 12);
    cy.viewport(1280, 1024);
    cy.dataCy("commit-chart-container").should("have.length", 6);
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
      cy.dataCy("grouped-task-status-badge").should("have.length", 9);
      cy.dataCy("waterfall-task-status-icon").should("have.length", 2);
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
      cy.dataCy("grouped-task-status-badge").should("have.length", 9);
      cy.dataCy("grouped-task-status-badge").should(
        "contain.text",
        "Succeeded"
      );
      cy.dataCy("waterfall-task-status-icon").should("not.exist");
    });
    it("applying a build variant filter should show all task statuses by default", () => {
      cy.getInputByLabel("Add New Filter").type("Ubuntu").type("{enter}");
      cy.dataCy("filter-badge").should("have.length", 1);
      cy.dataCy("filter-badge").should("have.text", "buildVariants: Ubuntu");
      cy.location("search").should("contain", "?buildVariants=Ubuntu");
      cy.dataCy("grouped-task-status-badge").should("have.length", 9);
      cy.dataCy("waterfall-task-status-icon").should("have.length", 2);
      cy.dataCy("waterfall-task-status-icon").should(
        "have.attr",
        "aria-label",
        "failed icon"
      );
    });
    it("applying a task filter should show all task icons instead of groupings", () => {
      cy.contains("button", "Build Variant").should("exist");
      cy.contains("button", "Build Variant").click({ force: true });
      cy.get("li").contains("Task").should("be.visible");
      cy.get("li").contains("Task").click();
      cy.getInputByLabel("Add New Filter").type(".").type("{enter}");
      cy.dataCy("grouped-task-status-badge").should("not.exist");
      cy.dataCy("waterfall-task-status-icon").should("have.length", 51);
      cy.dataCy("waterfall-task-status-icon")
        .get("[aria-label='failed icon']")
        .should("exist");
      cy.dataCy("waterfall-task-status-icon")
        .get("[aria-label='failed icon']")
        .should("have.length", 2);
      cy.dataCy("waterfall-task-status-icon")
        .get("[aria-label='success icon']")
        .should("exist");
      cy.dataCy("waterfall-task-status-icon")
        .get("[aria-label='success icon']")
        .should("have.length", 49);
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
      cy.dataCy("inactive-commits-button").should("have.length", 5);
      cy.dataCy("inactive-commits-button").each(($el) => {
        cy.wrap($el).should("contain.text", "Unmatching");
      });
    });
  });
  describe("inactive / unmatching commit tooltips", () => {
    beforeEach(() => {
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
      beforeEach(() => {
        cy.visit("/commits/spruce");
      });
      it("hovering on a failing task should reveal task metadata along side test results", () => {
        cy.dataCy("waterfall-task-status-icon").should("have.length", 2);
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
        cy.dataCy("waterfall-task-status-icon").first().click({ force: true });
        cy.location("pathname").should("contain", "/task/");
      });
    });

    describe("grouped task status badges", () => {
      beforeEach(() => {
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
        cy.dataCy("grouped-task-status-badge").should("have.length", 9);
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
