import {
  getGeneralRoute,
  getGithubCommitQueueRoute,
  project,
} from "./constants";
import { clickSave } from "../../utils";

describe("Renaming the identifier", () => {
  const origin = getGeneralRoute(project);

  beforeEach(() => {
    cy.visit(origin);
  });

  it("Update identifier", () => {
    const warningText =
      "Updates made to the project identifier will change the identifier used for the CLI, inter-project dependencies, etc. Project users should be made aware of this change, as the old identifier will no longer work.";

    cy.dataCy("input-warning").should("not.exist");
    cy.dataCy("identifier-input").clear();
    cy.dataCy("identifier-input").type("new-identifier");
    cy.dataCy("input-warning").should("contain", warningText);
    clickSave();
    cy.validateToast("success", "Successfully updated project");
    cy.url().should("include", "new-identifier");
  });
});

describe("A project that has GitHub webhooks disabled", () => {
  const origin = getGithubCommitQueueRoute("logkeeper");

  beforeEach(() => {
    cy.visit(origin);
  });

  it("Disables all interactive elements on the page", () => {
    cy.dataCy("project-settings-page")
      .find("button")
      .should("have.attr", "aria-disabled", "true");
    cy.get("input").should("be.disabled");
  });
});
