// / <reference types="Cypress" />

const patch = {
  id: "5e4ff3abe3c3317e352062e4",
};
const path = `/patch/${patch.id}`;
const allTasksSelectedConfirmationMessage =
  "Are you sure you want to restart the 2 selected tasks?";
describe("Restarting a patch", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Clicking on the Restart button opens a patch restart modal", () => {
    cy.visit(path);
    cy.dataCy("patch-restart-modal").should("not.be.visible");
    cy.dataCy("restart-patch").click();
    cy.dataCy("patch-restart-modal").should("be.be.visible");
  });

  it("Clicking on a variant should toggle an accordian drop down of tasks", () => {
    cy.dataCy("variant-accordian")
      .first()
      .click();
    cy.dataCy("patch-status-selector-container").should("exist");
  });
  it("Clicking on a task should toggle its check box and select the task", () => {
    cy.dataCy("task-status-checkbox")
      .first()
      .click({ force: true });
    cy.dataCy("patch-status-selector-container").should("exist");
    cy.dataCy("task-status-badge").should("contain.text", "1 of 2 Selected");
  });

  it("Selecting on a filter should toggle the tasks that have matching statuses to it", () => {
    cy.get(`[data-cy=patch-status-filter] > .cy-treeselect-bar`).click();
    cy.get(".cy-checkbox")
      .contains("All")
      .as("target")
      .click({ force: true });
    cy.get(`[data-cy=patch-status-filter] > .cy-treeselect-bar`).click();

    // ideally this would target the text field itself but leafygreen Body tags dont
    // support cy-data elements currently
    cy.dataCy("patch-restart-modal").should(
      "contain.text",
      allTasksSelectedConfirmationMessage
    );
  });
  it("Restarting a task should close the modal and display a success message if it occurs successfully", () => {
    cy.dataCy("restart-patch-button").click();
    cy.dataCy("patch-restart-modal").should("not.be.be.visible");
    cy.dataCy("banner").should("exist");
    cy.dataCy("banner").should(
      "contain.text",
      `Successfully restarted patch: ${patch.id}`
    );
  });
});
