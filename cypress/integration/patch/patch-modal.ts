// / <reference types="Cypress" />

describe("Restarting a patch", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.viewport(1920, 1600);
    cy.preserveCookies();
  });

  it("Clicking on the Restart button opens a patch restart modal", () => {
    cy.visit(path);
    cy.dataCy("patch-restart-modal").should("not.be.visible");
    cy.dataCy("restart-patch").click();
    cy.dataCy("patch-restart-modal").should("be.be.visible");
  });

  it("Clicking on a variant should toggle an accordian drop down of tasks", () => {
    cy.dataCy("variant-accordian").first().click();
    cy.dataCy("patch-status-selector-container").should("exist");
  });
  it("Clicking on a variant checkbox should toggle its textbox and all the associated tasks", () => {
    cy.dataCy("task-status-badge").should("contain.text", "0 of 2 Selected");
    cy.dataCy("variant-checkbox-select-all").first().click({ force: true });
    cy.dataCy("task-status-badge").should("contain.text", "2 of 2 Selected");
    cy.dataCy("variant-checkbox-select-all").first().click({ force: true });
    cy.dataCy("task-status-badge").should("contain.text", "0 of 2 Selected");
  });
  it("Clicking on a task should toggle its check box and select the task", () => {
    cy.dataCy("task-status-checkbox").first().click({ force: true });
    cy.dataCy("patch-status-selector-container").should("exist");
    cy.dataCy("task-status-badge").should("contain.text", "1 of 2 Selected");
  });

  it("Selecting on the patch status filter should toggle the tasks that have matching statuses to it", () => {
    cy.get(statusFilter).click();
    cy.get(".cy-checkbox").contains("All").as("target").click({ force: true });
    cy.get(statusFilter).click();

    // ideally this would target the text field itself but leafygreen Body tags dont
    // support cy-data elements currently
    cy.dataCy("patch-restart-modal").should(
      "contain.text",
      "Are you sure you want to restart the 50 selected tasks?"
    );
  });

  it("Selecting on the base status filter should toggle the tasks that have matching statuses to it", () => {
    cy.dataCy("patch-restart-modal").within(() => {
      cy.get(baseStatusFilter).click();
      cy.get(".cy-checkbox")
        .contains("Success")
        .as("target")
        .click({ force: true });
      cy.get(baseStatusFilter).click();

      // ideally this would target the text field itself but leafygreen Body tags dont
      // support cy-data elements currently
      cy.dataCy("confirmation-message").should(
        "contain.text",
        "Are you sure you want to restart the 44 selected tasks?"
      );
      cy.get(baseStatusFilter).click();

      cy.get(".cy-checkbox")
        .contains("Success")
        .as("target")
        .click({ force: true });
      cy.get(baseStatusFilter).click();
    });
  });

  it("Restarting a task should close the modal and display a success message if it occurs successfully.", () => {
    cy.dataCy("restart-patch-button").click();
    cy.dataCy("patch-restart-modal").should("not.be.be.visible");
    cy.dataCy("toast").should("exist");
    cy.dataCy("toast").should("contain.text", `Successfully restarted patch`);
  });

  xit("The status filters are prepopulated with the same selections as the task table status filters when the modal is opens.", () => {
    cy.visit(path);
    cy.dataCy(versionPageStatusFilter).click();
    cy.dataCy(versionPageStatusFilter).contains("Success").click();
    cy.dataCy(versionPageStatusFilter).contains("Undispatched").click();
    cy.get(versionPageBaseStatusFilter).click();
    cy.get(versionPageBaseStatusFilter).contains("Running").click();
    cy.wait(100);
    cy.get(versionPageBaseStatusFilter).contains("Dispatched").click();
    cy.dataCy("restart-patch").click();
    cy.get(statusFilter).contains(
      "Task Status: Success, Undispatched or Blocked"
    );
    cy.get(baseStatusFilter).contains("Task Base Status: Running, Dispatched");

    // close modal and do the same thing again
    cy.dataCy("cancel-restart-modal-button").click({ force: true });
    cy.dataCy(versionPageStatusFilter).first().click();
    cy.dataCy(versionPageStatusFilter).first().contains("Failed").click();
    cy.get(versionPageBaseStatusFilter).click();
    cy.get(versionPageBaseStatusFilter).contains("All").click();
    cy.dataCy("restart-patch").click();
    cy.get(statusFilter).contains(
      "Task Status: Success, Undispatched or Blocked, Failed"
    );
    cy.get(baseStatusFilter).contains("Task Base Status: All");
  });

  const path = `/version/5e4ff3abe3c3317e352062e4`;
  const statusFilter = ".ant-modal-body > div > [data-cy=task-status-filter]";
  const baseStatusFilter =
    ".ant-modal-body > div > [data-cy=task-base-status-filter]";
  const versionPageStatusFilter = "task-status-filter";
  const versionPageBaseStatusFilter =
    "[data-cy=task-tab] > div > div > [data-cy=task-base-status-filter]";
});
