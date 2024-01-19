describe("filtering", () => {
  beforeEach(() => {
    cy.visit("/commits/spruce");
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
        "Succeeded",
      );
      cy.dataCy("waterfall-task-status-icon").should("not.exist");
    });
    it("applying a build variant filter should show all task statuses by default", () => {
      cy.getInputByLabel("Add New Filter").type("Ubuntu{enter}");
      cy.dataCy("filter-badge").should("have.length", 1);
      cy.dataCy("filter-badge").should("have.text", "buildVariants: Ubuntu");
      cy.location("search").should("contain", "?buildVariants=Ubuntu");
      cy.dataCy("grouped-task-status-badge").should("have.length", 9);
      cy.dataCy("waterfall-task-status-icon").should("have.length", 2);
      cy.dataCy("waterfall-task-status-icon").should(
        "have.attr",
        "aria-label",
        "failed icon",
      );
    });
    it("applying a task filter should show all task icons instead of groupings", () => {
      cy.contains("button", "Build Variant").should("exist");
      cy.contains("button", "Build Variant").click({ force: true });
      cy.get("li").contains("Task").should("be.visible");
      cy.get("li").contains("Task").click();
      cy.getInputByLabel("Add New Filter").type(".{enter}");
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
});
