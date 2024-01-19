import { getGeneralRoute, project } from "./constants";

describe("Duplicating a project", () => {
  const destination = getGeneralRoute(project);

  it("Successfully duplicates a project with warnings", () => {
    cy.visit(destination);
    cy.dataCy("new-project-button").click();
    cy.dataCy("new-project-menu").should("be.visible");
    cy.dataCy("copy-project-button").click();
    cy.dataCy("copy-project-modal").should("be.visible");

    cy.dataCy("project-name-input").type("copied-project");

    cy.contains("button", "Duplicate").click();
    cy.validateToast("warning");

    cy.url().should("include", "copied-project");
  });
});

describe("Creating a new project and deleting it", () => {
  it("Successfully creates a new project and then deletes it", () => {
    // Create project
    cy.visit(getGeneralRoute(project));
    cy.dataCy("new-project-button").click();
    cy.dataCy("new-project-menu").should("be.visible");
    cy.dataCy("create-project-button").click();
    cy.dataCy("create-project-modal").should("be.visible");

    cy.dataCy("project-name-input").type("my-new-project");
    cy.dataCy("new-owner-select").contains("evergreen-ci");
    cy.dataCy("new-repo-input").should("have.value", "spruce");
    cy.dataCy("new-repo-input").clear().type("new-repo");

    cy.contains("button", "Create Project").click();
    cy.validateToast("success");

    cy.url().should("include", "my-new-project");

    // Delete project
    cy.visit(getGeneralRoute("my-new-project"));
    cy.dataCy("attach-repo-button").click();
    cy.dataCy("attach-repo-modal")
      .find("button")
      .contains("Attach")
      .parent()
      .click();
    cy.validateToast("success", "Successfully attached to repo");

    cy.dataCy("delete-project-button").scrollIntoView();
    cy.dataCy("delete-project-button").click();
    cy.dataCy("delete-project-modal")
      .find("button")
      .contains("Delete")
      .parent()
      .click();
    cy.validateToast("success");

    cy.reload();
    cy.validateToast(
      "error",
      "Could not find project with identifier: my-new-project",
    );
  });
});
