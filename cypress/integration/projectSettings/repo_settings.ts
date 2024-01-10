import {
  getAccessRoute,
  getGeneralRoute,
  projectUseRepoEnabled,
  repo,
  saveButtonEnabled,
} from "./constants";
import { clickSave } from "../../utils";

describe("Repo Settings", () => {
  const origin = getGeneralRoute(repo);

  beforeEach(() => {
    cy.visit(origin);
  });

  describe("General settings page", () => {
    it("Should have the save button disabled on load", () => {
      saveButtonEnabled(false);
    });

    it("Does not show a 'Default to Repo' button on page", () => {
      cy.dataCy("default-to-repo-button").should("not.exist");
    });

    it("Does not show a 'Move to New Repo' button on page", () => {
      cy.dataCy("move-repo-button").should("not.exist");
    });

    it("Does not show an Attach/Detach to Repo button on page", () => {
      cy.dataCy("attach-repo-button").should("not.exist");
    });

    it("Does not show a 'Go to repo settings' link on page", () => {
      cy.dataCy("attached-repo-link").should("not.exist");
    });
    it("Inputting a display name then clicking save shows a success toast", () => {
      cy.dataCy("display-name-input").type("evg");
      clickSave();
      cy.validateToast("success", "Successfully updated repo");
    });
  });

  describe("GitHub/Commit Queue page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-github-commitqueue").click();
      saveButtonEnabled(false);
    });
    describe("GitHub section", () => {
      it("Shows an error banner when Commit Checks are enabled and hides it when Commit Checks are disabled", () => {
        cy.dataCy("github-checks-enabled-radio-box")
          .contains("label", "Enabled")
          .click();
        cy.dataCy("error-banner")
          .contains(
            "A Commit Check Definition must be specified for this feature to run.",
          )
          .as("errorBanner");
        cy.get("@errorBanner").should("be.visible");
        cy.dataCy("github-checks-enabled-radio-box")
          .contains("label", "Disabled")
          .click();
        cy.get("@errorBanner").should("not.exist");
      });

      it("Allows enabling manual PR testing", () => {
        cy.dataCy("manual-pr-testing-enabled-radio-box")
          .children()
          .first()
          .click();
      });
      it("Saving a patch defintion should hide the error banner, success toast and displays disable patch definitions for the repo", () => {
        cy.contains(
          "A GitHub Patch Definition must be specified for this feature to run.",
        ).as("errorBanner");
        cy.get("@errorBanner").should("be.visible");
        cy.contains("button", "Add Patch Definition").click();
        cy.get("@errorBanner").should("not.exist");
        saveButtonEnabled(false);
        cy.dataCy("variant-tags-input").first().type("vtag");
        cy.dataCy("task-tags-input").first().type("ttag");
        saveButtonEnabled(true);
        clickSave();
        cy.validateToast("success", "Successfully updated repo");
        cy.visit(getGeneralRoute(projectUseRepoEnabled));
        cy.dataCy("navitem-github-commitqueue").click();
        cy.contains("Repo Patch Definition 1")
          .as("patchDefAccordion")
          .scrollIntoView();
        cy.get("@patchDefAccordion").click();
        cy.dataCy("variant-tags-input").should("have.value", "vtag");
        cy.dataCy("variant-tags-input").should("be.disabled");
        cy.dataCy("task-tags-input").should("have.value", "ttag");
        cy.dataCy("task-tags-input").should("be.disabled");
        cy.contains(
          "A GitHub Patch Definition must be specified for this feature to run.",
        ).should("not.exist");
      });
    });

    describe("Commit Queue section", () => {
      beforeEach(() => {
        cy.dataCy("cq-enabled-radio-box")
          .contains("label", "Enabled")
          .as("enableCQButton")
          .scrollIntoView();
      });
      it("Enabling commit queue shows hidden inputs and error banner", () => {
        cy.dataCy("cq-card")
          .children()
          .as("cqCardFields")
          .should("have.length", 2);

        cy.get("@enableCQButton").click();
        cy.get("@cqCardFields").should("have.length", 4);
        cy.contains("Commit Queue Patch Definitions").scrollIntoView();
        cy.dataCy("error-banner")
          .contains(
            "A Commit Queue Patch Definition must be specified for this feature to run.",
          )
          .should("be.visible");
      });

      it("Shows merge method only if merge queue is Evergreen", () => {
        cy.get("@enableCQButton").click();
        // Evergreen is the default value
        cy.getInputByLabel("Evergreen").should("be.checked");
        const selectId = "merge-method-select";
        cy.dataCy(selectId).as("mergeMethodDropdown").scrollIntoView();
        cy.dataCy(selectId).should("be.visible");
        // Click GitHub
        cy.contains("label", "GitHub").click();
        cy.getInputByLabel("GitHub").should("be.checked");

        // Hides merge method for GitHub.
        cy.get("mergeMethodDropdown").should("not.exist");
        // Shows merge method for Evergreen.
        cy.contains("label", "Evergreen").click();
        cy.getInputByLabel("Evergreen").should("be.checked");
        cy.get("@mergeMethodDropdown").should("be.visible");
      });

      it("Does not show override buttons for commit queue patch definitions", () => {
        cy.get("@enableCQButton").click();
        cy.getInputByLabel("Evergreen").should("be.checked");
        cy.dataCy("cq-override-radio-box").should("not.exist");
      });

      it("Saves a commit queue definition and uses the repo message as placeholder for a project setting ", () => {
        cy.get("@enableCQButton").click();
        cy.dataCy("cq-message-input").type("Repo message wohoo!");
        cy.contains("button", "Add Patch Definition").click();
        cy.dataCy("variant-tags-input").first().type("vtag");
        cy.dataCy("task-tags-input").first().type("ttag");
        saveButtonEnabled(false);
        cy.contains("button", "Add Commit Queue Patch Definition").click();
        cy.dataCy("variant-tags-input").last().type("cqvtag");
        cy.dataCy("task-tags-input").last().type("cqttag");
        cy.dataCy("warning-banner").should("not.exist");
        cy.dataCy("error-banner").should("not.exist");
        clickSave();
        cy.validateToast("success", "Successfully updated repo");
        cy.visit(getGeneralRoute(projectUseRepoEnabled));
        cy.dataCy("navitem-github-commitqueue").click();
        cy.dataCy("cq-message-input").should(
          "have.attr",
          "placeholder",
          "Repo message wohoo! (Default from repo)",
        );
      });
    });
  });

  describe("Patch Aliases page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-patch-aliases").click();
      saveButtonEnabled(false);
      cy.dataCy("patch-aliases-override-radio-box").should("not.exist");
    });

    it("Saving a patch alias shows a success toast, the alias name in the card title and in the repo defaulted project", () => {
      cy.dataCy("add-button").contains("Add Patch Alias").parent().click();
      cy.dataCy("expandable-card-title").contains("New Patch Alias");
      cy.dataCy("alias-input").type("my alias name");
      saveButtonEnabled(false);
      cy.dataCy("variant-tags-input").first().type("alias variant tag");
      cy.dataCy("task-tags-input").first().type("alias task tag");
      clickSave();
      cy.validateToast("success", "Successfully updated repo");
      cy.dataCy("expandable-card-title").contains("my alias name");
      // Verify persistence
      cy.reload();
      cy.dataCy("expandable-card-title").contains("my alias name");
      cy.visit(getAccessRoute(projectUseRepoEnabled));
      cy.dataCy("default-to-repo-button").click();
      cy.dataCy("default-to-repo-modal").should("be.visible");
      cy.dataCy("default-to-repo-modal").contains("button", "Confirm").click();
      cy.validateToast("success", "Successfully defaulted page to repo");
      cy.dataCy("navitem-patch-aliases").click();
      cy.dataCy("expandable-card-title").contains("my alias name");
      cy.dataCy("expandable-card-title")
        .parentsUntil("div")
        .first()
        .click({ force: true });
      cy.dataCy("expandable-card").find("input").should("be.disabled");
      cy.dataCy("expandable-card").find("button").should("be.disabled");
    });

    it("Saving a Patch Trigger Alias shows a success toast and updates the Github/Commit Queue page", () => {
      cy.dataCy("add-button")
        .contains("Add Patch Trigger Alias")
        .parent()
        .click();
      cy.dataCy("pta-alias-input").type("my-alias");
      cy.dataCy("project-input").type("spruce");
      cy.dataCy("module-input").type("module_name");
      cy.contains("button", "Variant/Task").click();
      cy.dataCy("variant-regex-input").type(".*");
      cy.dataCy("task-regex-input").type(".*");
      cy.getInputByLabel("Add to GitHub Trigger Alias").as(
        "triggerAliasCheckbox",
      );
      cy.get("@triggerAliasCheckbox").should("not.be.checked");
      cy.get("@triggerAliasCheckbox").check({ force: true });
      cy.get("@triggerAliasCheckbox").should("be.checked");
      clickSave();
      cy.validateToast("success", "Successfully updated repo");
      saveButtonEnabled(false);
      // Demonstrate Wait on field is optional
      cy.selectLGOption("Wait on", "Success");
      cy.getInputByLabel("Wait on").should(
        "have.attr",
        "aria-invalid",
        "false",
      );
      saveButtonEnabled(true);
      cy.selectLGOption("Wait on", "Select event…");
      cy.getInputByLabel("Wait on").should(
        "have.attr",
        "aria-invalid",
        "false",
      );
      saveButtonEnabled(false);
      // Verify information on Github/Commit Queue page
      cy.dataCy("navitem-github-commitqueue").click();
      cy.contains("GitHub Trigger Aliases").scrollIntoView();
      cy.dataCy("pta-item").should("have.length", 1);
      cy.contains("my-alias").should("be.visible");
      cy.dataCy("pta-item").trigger("mouseover");
      cy.dataCy("pta-tooltip").should("be.visible");
      cy.dataCy("pta-tooltip").contains("spruce");
      cy.dataCy("pta-tooltip").contains("module_name");
      cy.dataCy("pta-tooltip").contains("Variant/Task Regex Pairs");
    });
  });

  describe("Virtual Workstation page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-virtual-workstation").click();
    });

    it("Adds two commands and then reorders them", () => {
      saveButtonEnabled(false);
      cy.dataCy("add-button").click();
      cy.dataCy("command-input").type("command 1");
      cy.dataCy("directory-input").type("mongodb.user.directory");

      cy.dataCy("add-button").click();
      cy.dataCy("command-input").eq(1).type("command 2");
      clickSave();
      cy.validateToast("success", "Successfully updated repo");
      cy.dataCy("array-down-button").click();
      cy.dataCy("save-settings-button").scrollIntoView();
      clickSave();
      cy.validateToast("success", "Successfully updated repo");
      cy.dataCy("command-input").first().should("have.value", "command 2");
      cy.dataCy("command-input").eq(1).should("have.value", "command 1");
    });
  });
});
