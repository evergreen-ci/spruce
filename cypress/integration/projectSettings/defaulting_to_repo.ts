import {
  getGeneralRoute,
  getVirtualWorkstationRoute,
  projectUseRepoEnabled,
  repo,
  saveButtonEnabled,
} from "./constants";
import { clickSave } from "../../utils";

describe("Project Settings when defaulting to repo", () => {
  const origin = getGeneralRoute(projectUseRepoEnabled);

  beforeEach(() => {
    cy.visit(origin);
  });

  describe("General Settings page", () => {
    it("Save button is disabled on load and shows a link to the repo", () => {
      saveButtonEnabled(false);
      cy.dataCy("attached-repo-link")
        .should("have.attr", "href")
        .and("eq", `/${getGeneralRoute(repo)}`);
    });

    it("Preserves edits to the form when navigating between settings tabs and does not show a warning modal", () => {
      cy.dataCy("spawn-host-input").should("have.value", "/path");
      cy.dataCy("spawn-host-input").type("/test");
      saveButtonEnabled();
      cy.dataCy("navitem-access").click();
      cy.dataCy("navigation-warning-modal").should("not.exist");
      cy.dataCy("navitem-general").click();
      cy.dataCy("spawn-host-input").should("have.value", "/path/test");
      saveButtonEnabled();
    });

    it("Shows a 'Default to Repo' button on page", () => {
      cy.dataCy("default-to-repo-button").should("exist");
    });

    it("Shows only two radio boxes even when rendering a project that inherits from repo", () => {
      cy.dataCy("enabled-radio-box").children().should("have.length", 2);
    });

    it("Does not default to repo value for display name", () => {
      cy.dataCy("display-name-input").should("not.have.attr", "placeholder");
    });

    it("Shows a navigation warning modal that lists the general page when navigating away from project settings", () => {
      cy.dataCy("spawn-host-input").type("/test");
      saveButtonEnabled();
      cy.contains("My Patches").click();
      cy.dataCy("navigation-warning-modal").should("be.visible");
      cy.dataCy("unsaved-pages").within(() => {
        cy.get("li").should("have.length", 1);
      });
      cy.get("body").type("{esc}");
    });

    it("Shows the repo value for Batch Time", () => {
      cy.dataCy("batch-time-input").should("have.attr", "placeholder");
    });

    it("Clicking on save button should show a success toast", () => {
      cy.dataCy("spawn-host-input").type("/test");
      clickSave();
      cy.validateToast("success", "Successfully updated project");
    });

    it("Saves when batch time is updated", () => {
      cy.dataCy("batch-time-input").type("12");
      clickSave();
      cy.validateToast("success", "Successfully updated project");
    });
  });

  describe("Variables page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-variables").click();
      saveButtonEnabled(false);
    });

    it("Successfully saves variables and then promotes them using the promote variables modal", () => {
      // Save variables
      cy.dataCy("add-button").should("be.visible").click();
      cy.dataCy("var-name-input").type("a");
      cy.dataCy("var-value-input").type("1");
      cy.contains("label", "Private").click();

      cy.dataCy("add-button").click();
      cy.dataCy("var-name-input").first().type("b");
      cy.dataCy("var-value-input").first().type("2");

      cy.dataCy("add-button").click();
      cy.dataCy("var-name-input").first().type("c");
      cy.dataCy("var-value-input").first().type("3");

      clickSave();
      cy.validateToast("success", "Successfully updated project");
      // Promote variables
      cy.dataCy("promote-vars-modal").should("not.exist");
      cy.dataCy("promote-vars-button").click();
      cy.dataCy("promote-vars-modal").should("be.visible");
      cy.dataCy("promote-var-checkbox").first().check({ force: true });
      cy.contains("button", "Move 1 variable").click();
      cy.validateToast("success", "Successfully moved variables to repo");
    });
  });

  describe("GitHub/Commit Queue page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-github-commitqueue").click();
    });

    it("Should not have the save button enabled on load", () => {
      saveButtonEnabled(false);
    });

    it("Allows overriding repo patch definitions", () => {
      cy.dataCy("pr-testing-enabled-radio-box")
        .find("label")
        .should("have.length", 3);
      cy.contains("label", "Override Repo Patch Definition").click();
      cy.dataCy("error-banner")
        .contains(
          "A GitHub Patch Definition must be specified for this feature to run.",
        )
        .should("exist");
      cy.contains("button", "Add Patch Definition").click();

      cy.dataCy("variant-input-control")
        .find("button")
        .contains("Regex")
        .click();
      cy.dataCy("variant-input").first().type(".*");
      saveButtonEnabled(false);
      // Persist input value when toggling inputs
      cy.contains("button", "Tags").first().click();
      cy.contains("button", "Regex").first().click();
      cy.dataCy("variant-input").should("have.value", ".*");
      cy.dataCy("task-input-control").find("button").contains("Regex").click();
      cy.dataCy("task-input").first().type(".*");
      clickSave();
      cy.validateToast("success", "Successfully updated project");
    });

    it("Shows a warning banner when a commit check definition does not exist", () => {
      cy.contains("Default to repo (disabled)").should("be.visible");
      cy.dataCy("github-checks-enabled-radio-box").scrollIntoView();
      cy.dataCy("github-checks-enabled-radio-box")
        .contains("label", "Enabled")
        .click();

      cy.dataCy("warning-banner")
        .contains(
          "This feature will only run if a Commit Check Definition is defined in the project or repo.",
        )
        .should("exist");
    });

    it("Disables Authorized Users section based on repo settings", () => {
      cy.contains("Authorized Users").should("not.exist");
      cy.contains("Authorized Teams").should("not.exist");
    });

    it("Displays the repo's merge method as its default", () => {
      cy.get("button[name=merge-method-select]").should(
        "have.text",
        "Default to Repo (squash)",
      );
    });

    it("Defaults to overriding repo since a patch definition is defined", () => {
      cy.dataCy("cq-override-radio-box")
        .find("input")
        .first()
        .should("be.checked");
    });

    it("Shows the existing patch definition", () => {
      cy.dataCy("variant-input").last().should("have.value", "^ubuntu1604$");
      cy.dataCy("task-input")
        .last()
        .should("have.value", "^smoke-test-endpoints$");
    });

    it("Returns an error on save because no commit check definitions are defined", () => {
      // Ensure page has loaded
      cy.dataCy("pr-testing-enabled-radio-box")
        .contains("label", "Default to repo (enabled)")
        .should("be.visible");
      cy.dataCy("pr-testing-enabled-radio-box")
        .contains("label", "Disabled")
        .click();
      cy.dataCy("manual-pr-testing-enabled-radio-box")
        .contains("label", "Disabled")
        .click();
      cy.dataCy("github-checks-enabled-radio-box")
        .contains("label", "Enabled")
        .click();
      clickSave();
      cy.validateToast(
        "error",
        "There was an error saving the project: GitHub checks cannot be enabled without aliases",
      );
    });

    it("Defaults to repo and shows the repo's disabled patch definition", () => {
      cy.dataCy("accordion-toggle")
        .contains("Repo Patch Definition 1")
        .should("not.exist");
      // Save a repo patch definition
      cy.visit(getGeneralRoute(repo));
      cy.dataCy("navitem-github-commitqueue").click();
      cy.contains("button", "Add Patch Definition").click();
      cy.dataCy("variant-tags-input").first().type("vtag");
      cy.dataCy("task-tags-input").first().type("ttag");
      clickSave();
      cy.validateToast("success", "Successfully updated repo");
      cy.visit(origin);
      cy.dataCy("navitem-github-commitqueue").click();
      cy.dataCy("default-to-repo-button").click();
      cy.dataCy("default-to-repo-modal").should("be.visible");
      cy.dataCy("default-to-repo-modal").contains("button", "Confirm").click();
      cy.validateToast("success", "Successfully defaulted page to repo");
      cy.dataCy("accordion-toggle").scrollIntoView();
      cy.dataCy("accordion-toggle")
        .should("be.visible")
        .contains("Repo Patch Definition 1");
    });
  });

  describe("Patch Aliases page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-patch-aliases").click();
      saveButtonEnabled(false);
    });

    it("Defaults to repo patch aliases", () => {
      cy.getInputByLabel("Default to Repo Patch Aliases").should(
        "have.attr",
        "checked",
      );
    });

    it("Patch aliases added before defaulting to repo patch aliases are cleared", () => {
      // Override repo patch alias and add a patch alias.
      cy.contains("label", "Override Repo Patch Aliases")
        .should("be.visible")
        .click();
      cy.getInputByLabel("Override Repo Patch Aliases").should(
        "have.attr",
        "aria-checked",
        "true",
      );
      saveButtonEnabled(false);
      cy.dataCy("add-button")
        .contains("Add Patch Alias")
        .parent()
        .click({ force: true });
      saveButtonEnabled(false);
      cy.dataCy("alias-input").type("my overriden alias name");
      cy.dataCy("variant-tags-input").first().type("alias variant tag 2");
      cy.dataCy("task-tags-input").first().type("alias task tag 2");
      cy.dataCy("add-button").contains("Add Task Tag").parent().click();
      cy.dataCy("task-tags-input").first().type("alias task tag 3");
      clickSave();
      cy.validateToast("success", "Successfully updated project");
      // Default to repo patch alias
      cy.contains("label", "Default to Repo Patch Aliases").click();
      clickSave();
      cy.validateToast("success", "Successfully updated project");
      saveButtonEnabled(false);
      // Aliases are cleared
      cy.contains("label", "Override Repo Patch Aliases").click();
      cy.dataCy("alias-row").should("have.length", 0);
    });
  });

  describe("Virtual Workstation page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-virtual-workstation").click();
    });

    it("Enable git clone", () => {
      cy.contains("label", "Enabled").click();
      cy.getInputByLabel("Enabled").should("be.checked");
      clickSave();
      cy.validateToast("success", "Successfully updated project");
    });
    it("Add commands", () => {
      // Repo commands should be visible on project page based on button selection
      cy.getInputByLabel("Default to repo (disabled)").should("be.checked");
      cy.dataCy("command-row").should("not.exist");
      cy.dataCy("attached-repo-link").click();
      cy.location("pathname").should(
        "equal",
        `/${getVirtualWorkstationRoute(repo)}`,
      );
      cy.contains("button", "Add Command").click();
      cy.dataCy("command-input").type("a repo command");
      clickSave();
      cy.validateToast("success", "Successfully updated repo");
      // Go to project page
      cy.visit(origin);
      cy.dataCy("navitem-virtual-workstation").click();
      cy.dataCy("command-row")
        .contains("textarea", "a repo command")
        .should("be.disabled");
      // Override commands, add a command, default to repo then show override commands are cleared
      cy.contains("label", "Override Repo Commands")
        .as("overrideRepoCommandsButton")
        .click();
      cy.dataCy("command-row").should("not.exist");
      cy.contains("button", "Add Command").click();
      cy.dataCy("command-input").type("a project command");
      clickSave();
      cy.validateToast("success", "Successfully updated project");
      cy.dataCy("command-row")
        .contains("textarea", "a project command")
        .should("be.enabled");
      cy.contains("label", "Default to Repo Commands").click();
      clickSave();
      cy.validateToast("success", "Successfully updated project");
      cy.dataCy("command-row")
        .contains("textarea", "a repo command")
        .should("be.disabled");
      cy.get("@overrideRepoCommandsButton").click();
      cy.dataCy("command-row").should("not.exist");
    });

    it("Allows overriding without adding a command", () => {
      cy.contains("label", "Override Repo Commands").click();
      clickSave();
      cy.validateToast("success", "Successfully updated project");
      cy.getInputByLabel("Override Repo Commands").should("be.checked");
    });
  });
});
