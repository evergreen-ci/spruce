import { getGeneralRoute, project, saveButtonEnabled } from "./constants";
import { clickSave } from "../../utils";

describe("Project Settings when not defaulting to repo", () => {
  const origin = getGeneralRoute(project);

  beforeEach(() => {
    cy.visit(origin);
    saveButtonEnabled(false);
  });

  it("Does not show a 'Default to Repo' button on page", () => {
    cy.dataCy("default-to-repo-button").should("not.exist");
  });

  it("Shows two radio boxes", () => {
    cy.dataCy("enabled-radio-box").children().should("have.length", 2);
  });

  it("Successfully attaches to and detaches from a repo that does not yet exist and shows 'Default to Repo' options", () => {
    cy.dataCy("attach-repo-button").click();
    cy.dataCy("attach-repo-modal")
      .find("button")
      .contains("Attach")
      .parent()
      .click();
    cy.validateToast("success", "Successfully attached to repo");
    cy.dataCy("attach-repo-button").click();
    cy.dataCy("attach-repo-modal")
      .find("button")
      .contains("Detach")
      .parent()
      .click();
    cy.validateToast("success", "Successfully detached from repo");
  });

  describe("Variables page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-variables").click();
    });

    it("Should not have the save button enabled on load", () => {
      saveButtonEnabled(false);
    });

    it("Should not show the move variables button", () => {
      cy.dataCy("promote-vars-button").should("not.exist");
    });

    it("Should redact and disable private variables on saving", () => {
      cy.dataCy("add-button").click();
      cy.dataCy("var-name-input").type("sample_name");
      saveButtonEnabled(false);
      cy.dataCy("var-value-input").type("sample_value");
      cy.contains("label", "Private").click();
      cy.dataCy("var-private-input").should("be.checked");
      clickSave();
      cy.validateToast("success", "Successfully updated project");
      cy.dataCy("var-value-input").should("have.value", "{REDACTED}");
      cy.dataCy("var-name-input").should("be.disabled");
      cy.dataCy("var-value-input").should("be.disabled");
      cy.dataCy("var-private-input").should("be.disabled");
      cy.dataCy("var-admin-input").should("be.disabled");
    });

    it("Typing a duplicate variable name will disable saving and show an error message", () => {
      cy.dataCy("add-button").click();
      cy.dataCy("var-name-input").type("sample_name");
      cy.dataCy("var-value-input").type("sample_value");
      clickSave();
      cy.validateToast("success", "Successfully updated project");
      cy.dataCy("add-button").click();
      cy.dataCy("var-name-input").first().type("sample_name");
      cy.dataCy("var-value-input").first().type("sample_value_2");
      cy.contains("Value already appears in project variables.").as(
        "errorMessage",
      );
      saveButtonEnabled(false);
      // Undo variable duplication
      cy.dataCy("var-name-input").first().type("_2");
      saveButtonEnabled();
      cy.get("@errorMessage").should("not.exist");
    });

    it("Should correctly save an admin only variable", () => {
      cy.dataCy("add-button").click();
      cy.dataCy("var-name-input").first().type("admin_var");
      cy.dataCy("var-value-input").first().type("admin_value");
      cy.contains("label", "Admin Only").click();
      cy.dataCy("var-admin-input").should("be.checked");
      clickSave();
      cy.validateToast("success", "Successfully updated project");
    });

    it("Should persist saved variables and allow deletion", () => {
      // Add variables
      cy.dataCy("add-button").click();
      cy.dataCy("var-name-input").type("sample_name");
      cy.dataCy("var-value-input").type("sample_value");
      cy.dataCy("add-button").click();
      cy.dataCy("var-name-input").first().type("sample_name_2");
      cy.dataCy("var-value-input").first().type("sample_value");
      cy.dataCy("add-button").click();
      cy.dataCy("var-name-input").first().type("admin_var");
      cy.dataCy("var-value-input").first().type("admin_value");
      clickSave();
      cy.validateToast("success", "Successfully updated project");
      // Verify persistence
      cy.reload();
      cy.dataCy("var-name-input").eq(0).should("have.value", "admin_var");
      cy.dataCy("var-name-input").eq(1).should("have.value", "sample_name");
      cy.dataCy("var-name-input").eq(2).should("have.value", "sample_name_2");
      // Verify deletion
      cy.dataCy("delete-item-button").first().click();
      cy.dataCy("delete-item-button").first().click();
      cy.dataCy("delete-item-button").first().click();
      clickSave();
      cy.validateToast("success", "Successfully updated project");
      cy.dataCy("var-name-input").should("not.exist");
      // Verify persistence
      cy.reload();
      saveButtonEnabled(false);
      cy.dataCy("var-name-input").should("not.exist");
    });
  });

  describe("GitHub/Commit Queue page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-github-commitqueue").click();
    });

    it("Allows adding a git tag alias", () => {
      cy.dataCy("git-tag-enabled-radio-box").children().first().click();
      cy.dataCy("add-button").contains("Add Git Tag").parent().click();
      cy.dataCy("git-tag-input").type("myGitTag");
      cy.dataCy("remote-path-input").type("./evergreen.yml");

      clickSave();
      cy.validateToast("success", "Successfully updated project");
      cy.dataCy("remote-path-input").should("have.value", "./evergreen.yml");
    });
  });

  describe("Periodic Builds page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-periodic-builds").click();
    });

    it("Disables save button when interval is NaN or below minimum and allows saving a number in range", () => {
      cy.dataCy("add-button").click();
      cy.dataCy("interval-input").as("intervalInput").type("NaN");
      cy.dataCy("config-file-input").type("config.yml");
      saveButtonEnabled(false);
      cy.contains("Value should be a number.");
      cy.get("@intervalInput").clear();
      cy.get("@intervalInput").type("0");
      saveButtonEnabled(false);
      cy.get("@intervalInput").clear();
      cy.get("@intervalInput").type("12");
      clickSave();
      cy.validateToast("success", "Successfully updated project");
    });
  });

  describe("Project Triggers page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-project-triggers").click();
    });

    it("Saves a project trigger", () => {
      cy.dataCy("add-button").click();
      cy.dataCy("project-input").should("be.visible").should("not.be.disabled");
      cy.dataCy("project-input").type("spruce");
      cy.dataCy("config-file-input").type(".evergreen.yml");
    });
  });
});
