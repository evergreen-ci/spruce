describe("Restarting a patch with Downstream Tasks", () => {
  it("Clicking on the Select Downstream Tasks should show the downstream projects", () => {
    const versionWithDownstream = `/version/5f74d99ab2373627c047c5e5`;
    cy.visit(versionWithDownstream);
    cy.dataCy("restart-version").click();
    cy.dataCy("select-downstream").first().click();
    cy.dataCy("select-downstream").first().contains("evergreen").click();
  });
});

describe("Restarting a patch", () => {
  beforeEach(() => {
    cy.visit(path);
    cy.dataCy("version-restart-modal").should("not.exist");
    cy.dataCy("restart-version").click();
    cy.dataCy("version-restart-modal").should("be.visible");
  });
  it("Clicking on a variant should toggle an accordion drop down of tasks", () => {
    cy.dataCy("variant-accordion").first().click();
    cy.dataCy("task-status-checkbox").should("exist");
  });
  it("Clicking on a variant checkbox should toggle its textbox and all the associated tasks", () => {
    cy.dataCy("task-status-badge").should("contain.text", "0 of 1 Selected");
    cy.dataCy("variant-checkbox-select-all").first().click({ force: true });
    cy.dataCy("task-status-badge").should("contain.text", "1 of 1 Selected");
    cy.dataCy("variant-checkbox-select-all").first().click({ force: true });
    cy.dataCy("task-status-badge").should("contain.text", "0 of 1 Selected");
  });
  it("Clicking on a task should toggle its check box and select the task", () => {
    cy.dataCy("task-status-checkbox").first().click({ force: true });
    cy.dataCy("task-status-badge").should("contain.text", "1 of 1 Selected");
  });

  it("Selecting on the task status filter should toggle the tasks that have matching statuses to it", () => {
    cy.dataCy("task-status-filter").click();
    cy.getInputByLabel("All").check({ force: true });
    cy.dataCy("task-status-filter").click();

    cy.dataCy("version-restart-modal").should(
      "contain.text",
      "Are you sure you want to restart the 1 selected tasks?",
    );
    cy.dataCy("task-status-filter").click();
    cy.getInputByLabel("All").check({ force: true });
    cy.dataCy("task-status-filter").click();
  });

  it("Selecting on the base status filter should toggle the tasks that have matching statuses to it", () => {
    cy.dataCy("version-restart-modal").within(() => {
      cy.dataCy("base-task-status-filter").click();
      cy.getInputByLabel("Succeeded").check({ force: true });
      cy.dataCy("base-task-status-filter").click();

      // ideally this would target the text field itself but leafygreen Body tags dont
      // support cy-data elements currently
      cy.dataCy("confirmation-message").should(
        "contain.text",
        "Are you sure you want to restart the 1 selected tasks?",
      );
      cy.dataCy("base-task-status-filter").click();

      cy.getInputByLabel("Succeeded").check({ force: true });
      cy.dataCy("base-task-status-filter").click();
    });
  });

  it("Restarting a task should close the modal and display a success message if it occurs successfully.", () => {
    cy.dataCy("version-restart-modal").within(() => {
      cy.dataCy("task-status-checkbox").first().click({ force: true });
      cy.contains("button", "Restart").click();
    });
    cy.dataCy("version-restart-modal").should("not.exist");
    cy.validateToast("success", "Successfully restarted tasks!");
  });
});

describe("Restarting mainline commits", () => {
  it("should be able to restart scheduled mainline commit tasks", () => {
    cy.visit("/version/spruce_ab494436448fbb1d244833046ea6f6af1544e86d");
    cy.dataCy("restart-version").should(
      "not.have.attr",
      "aria-disabled",
      "true",
    );
    cy.dataCy("restart-version").click();
    cy.dataCy("version-restart-modal").should("be.visible");
    cy.dataCy("version-restart-modal").within(() => {
      cy.dataCy("accordion-toggle").click();
      cy.getInputByLabel("check_codegen").should("exist");
      cy.getInputByLabel("check_codegen").check({ force: true });
      cy.contains("button", "Restart").should(
        "not.have.attr",
        "aria-disabled",
        "true",
      );
      cy.contains("button", "Restart").click();
    });
    cy.validateToast("success", "Successfully restarted tasks!");
  });
});
const path = `/version/5ecedafb562343215a7ff297`;
