describe("commits page", () => {
  beforeEach(() => {
    cy.visit("/commits/spruce");
  });

  describe("view", () => {
    it("should present a default view with only failing task icons visible", () => {
      cy.dataCy("waterfall-task-status-icon").should("exist");
      cy.dataCy("waterfall-task-status-icon")
        .should("be.visible")
        .should("have.length", 2);
      cy.dataCy("waterfall-task-status-icon").should(
        "have.attr",
        "aria-label",
        "failed icon",
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
      "absolute",
    );
    cy.getInputByLabel("Percentage").click({ force: true });
    cy.getInputByLabel("Absolute Number").should("not.be.checked");
    cy.getInputByLabel("Percentage").should("be.checked");
    cy.dataCy("commit-chart-container").should(
      "have.attr",
      "data-type",
      "percentage",
    );
    cy.location("search").should("contain", "chartType=percentage");
    cy.getInputByLabel("Absolute Number").click({ force: true });
    cy.getInputByLabel("Absolute Number").should("be.checked");
    cy.getInputByLabel("Percentage").should("not.be.checked");
    cy.dataCy("commit-chart-container").should(
      "have.attr",
      "data-type",
      "absolute",
    );
    cy.location("search").should("contain", "chartType=absolute");
  });
  it("Should be able to paginate between commits", () => {
    cy.dataCy("prev-page-button").should("have.attr", "aria-disabled", "true");
    cy.dataCy("next-page-button").should(
      "not.have.attr",
      "aria-disabled",
      "true",
    );
    cy.dataCy("next-page-button").click();
    cy.dataCy("prev-page-button").should(
      "not.have.attr",
      "aria-disabled",
      "true",
    );
    cy.dataCy("prev-page-button").click();
    cy.dataCy("prev-page-button").should("have.attr", "aria-disabled", "true");
  });

  it("resizing the page adjusts the number of commits rendered", () => {
    cy.visit("/commits/spruce");
    cy.dataCy("commit-chart-container").should("have.length", 9);
    cy.viewport(2560, 1440);
    cy.dataCy("commit-chart-container").should("have.length", 12);
    cy.viewport(1280, 1024);
    cy.dataCy("commit-chart-container").should("have.length", 6);
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
        "1 Inactive Commit",
      );
      cy.dataCy("inactive-commits-tooltip").should("contain.text", "e695f65");
      cy.contains("e695f65").should(
        "have.attr",
        "href",
        "/version/spruce_e695f654c8b4b959d3e12e71696c3e318bcd4c33/tasks",
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
          "failed icon",
        );
        cy.dataCy("waterfall-task-status-icon").first().trigger("mouseover");
        cy.dataCy("waterfall-task-status-icon-tooltip").should("exist");
        cy.dataCy("waterfall-task-status-icon-tooltip").should("be.visible");
        cy.dataCy("waterfall-task-status-icon-tooltip").should(
          "contain.text",
          "check_codegen",
        );
        cy.dataCy("waterfall-task-status-icon-tooltip").should(
          "contain.text",
          "JustAFakeTestInALonelyWorld",
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
          "1 Succeeded",
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

  describe("search by git commit", () => {
    const revision = "aac24c894994e44a2dadc6db40b46eb82e41f2cc";

    const searchCommit = (commitHash: string) => {
      cy.dataCy("waterfall-menu").click();
      cy.dataCy("git-commit-search").click();
      cy.dataCy("git-commit-search-modal").should("be.visible");
      cy.getInputByLabel("Git Commit Hash").type(commitHash);
      cy.contains("button", "Submit").click();
      cy.location("search").should("contain", `revision=${commitHash}`);
    };

    beforeEach(() => {
      cy.visit("/commits/spruce");
    });

    it("should show an error toast if the commit could not be found", () => {
      searchCommit(revision.slice(3, 12));
      cy.validateToast("error");
    });

    it("should jump to the given commit", () => {
      searchCommit(revision);
      cy.get("[data-selected='true']").should("be.visible");
      cy.get("[data-selected='true']").should(
        "contain.text",
        revision.substring(0, 7),
      );
    });

    it("should clear any applied filters and skip numbers", () => {
      cy.visit(
        "/commits/spruce?buildVariants=ubuntu&skipOrderNumber=1231&taskNames=codegen&view=FAILED",
      );
      searchCommit(revision);
      cy.location("search").should("not.contain", "buildVariants");
      cy.location("search").should("not.contain", "taskNames");
      cy.location("search").should("not.contain", "skipOrderNumber");
    });

    it("should be possible to paginate from the given commit", () => {
      searchCommit(revision);
      cy.get("[data-selected='true']").should("be.visible");

      cy.dataCy("next-page-button").click();
      cy.get("[data-selected='true']").should("not.exist");
      cy.dataCy("prev-page-button").click();
      cy.get("[data-selected='true']").should("be.visible");

      cy.dataCy("prev-page-button").click();
      cy.get("[data-selected='true']").should("not.exist");
      cy.dataCy("next-page-button").click();
      cy.get("[data-selected='true']").should("be.visible");
    });
  });
});
