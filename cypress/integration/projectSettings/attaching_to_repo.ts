import { getGeneralRoute, project } from "./constants";
import { clickSave } from "../../utils";

describe("Attaching Spruce to a repo", () => {
  const origin = getGeneralRoute(project);

  beforeEach(() => {
    cy.visit(origin);
  });

  it("Saves and attaches new repo and shows warnings on the Github/Commit Queue page", () => {
    cy.dataCy("repo-input").as("repoInput").clear();
    cy.get("@repoInput").type("evergreen");
    cy.dataCy("attach-repo-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );
    clickSave();
    cy.validateToast("success", "Successfully updated project");
    cy.dataCy("attach-repo-button").click();
    cy.dataCy("attach-repo-modal").contains("button", "Attach").click();
    cy.validateToast("success", "Successfully attached to repo");
    cy.dataCy("navitem-github-commitqueue").click();
    cy.dataCy("pr-testing-enabled-radio-box")
      .prev()
      .dataCy("warning-banner")
      .should("exist");
    cy.dataCy("manual-pr-testing-enabled-radio-box")
      .prev()
      .dataCy("warning-banner")
      .should("exist");
    cy.dataCy("github-checks-enabled-radio-box").prev().should("not.exist");
    cy.dataCy("cq-card").dataCy("warning-banner").should("exist");
    cy.dataCy("cq-enabled-radio-box").within(($el) => {
      cy.wrap($el).getInputByLabel("Enabled").parent().click();
    });
    cy.dataCy("cq-card").dataCy("error-banner").should("exist");
  });
});
