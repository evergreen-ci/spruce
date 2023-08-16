import { clickSave } from "../../utils";

describe("task section", () => {
  beforeEach(() => {
    cy.visit("/distro/localhost/settings/task");
  });

  it("should only show tunable options if planner version is tunable", () => {
    cy.getInputByLabel("Task Planner Version").should("contain.text", "Legacy");
    cy.dataCy("tunable-options").should("not.exist");
    cy.selectLGOption("Task Planner Version", "Tunable");
    cy.dataCy("tunable-options").should("be.visible");
  });

  it("should surface warnings for invalid number inputs", () => {
    cy.selectLGOption("Task Planner Version", "Tunable");
    cy.getInputByLabel("Target Time (seconds)").clear();
    cy.getInputByLabel("Target Time (seconds)").type("500");
    cy.contains("Value should be <= 100.").should("be.visible");
    cy.getInputByLabel("Target Time (seconds)").clear();
    cy.getInputByLabel("Target Time (seconds)").type("-500");
    cy.contains("Value should be >= 0.").should("be.visible");
  });

  it("can update fields and those changes will persist", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true"
    );

    // Update fields.
    cy.selectLGOption("Task Finder Version", "Parallel");
    cy.selectLGOption("Task Planner Version", "Tunable");
    cy.selectLGOption("Task Dispatcher Version", "Revised with dependencies");
    clickSave();
    cy.validateToast("success");

    // Changes should persist.
    cy.reload();
    cy.getInputByLabel("Task Finder Version").should(
      "contain.text",
      "Parallel"
    );
    cy.getInputByLabel("Task Planner Version").should(
      "contain.text",
      "Tunable"
    );
    cy.getInputByLabel("Task Dispatcher Version").should(
      "contain.text",
      "Revised with dependencies"
    );

    // Undo changes.
    cy.selectLGOption("Task Finder Version", "Legacy");
    cy.selectLGOption("Task Planner Version", "Legacy");
    cy.selectLGOption("Task Dispatcher Version", /^Revised$/);
    clickSave();
    cy.validateToast("success");
  });
});
