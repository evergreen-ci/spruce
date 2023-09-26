import {
  getAccessRoute,
  getGeneralRoute,
  getGithubCommitQueueRoute,
  getVirtualWorkstationRoute,
  project,
  projectUseRepoEnabled,
  repo,
  saveButtonEnabled,
} from "./constants";
import { clickSave } from "../../utils";

describe("Access page", () => {
  const origin = getAccessRoute(projectUseRepoEnabled);
  beforeEach(() => {
    cy.visit(origin);
    saveButtonEnabled(false);
    cy.dataCy("default-to-repo-button")
      .should("be.visible")
      .should("be.enabled");
  });

  it("Changing settings and clicking the save button produces a success toast and the changes are persisted", () => {
    // Wait for internal access buttons to load
    cy.get("[aria-label='Internal Access']")
      .children()
      .as("internalAccessButtons")
      .should("have.length", 3);
    cy.contains("label", "Unrestricted").click();
    cy.getInputByLabel("Unrestricted").should(
      "have.attr",
      "aria-checked",
      "true"
    );
    // Input and save username
    cy.contains("Add Username").click();
    cy.get("[aria-label='Username'").as("usernameInput").type("admin");
    cy.get("@usernameInput").should("have.value", "admin").should("be.visible");
    clickSave();
    cy.validateToast("success", "Successfully updated project");
    // Assert persistence
    cy.reload();
    cy.get("@usernameInput").should("have.value", "admin").should("be.visible");
    // Delete a username
    cy.get("@internalAccessButtons").should("have.length", 3);
    cy.dataCy("delete-item-button").should("be.visible").click();
    cy.get("@usernameInput").should("not.exist");
    clickSave();
    cy.validateToast("success", "Successfully updated project");
    // Assert persistence
    cy.reload();
    cy.get("@usernameInput").should("not.exist");
  });

  it("Clicking on 'Default to Repo on Page' selects the 'Default to repo (unrestricted)' radio box and produces a success banner", () => {
    cy.dataCy("default-to-repo-button").click();
    cy.dataCy("default-to-repo-modal").contains("Confirm").click();
    cy.validateToast("success", "Successfully defaulted page to repo");
    cy.getInputByLabel("Default to repo (unrestricted)").should(
      "have.attr",
      "aria-checked",
      "true"
    );
  });

  it("Submitting an invalid admin username produces an error toast", () => {
    cy.visit(getAccessRoute(project));
    cy.contains("Add Username").click();
    cy.get("[aria-label='Username'")
      .should("have.length", 4)
      .first()
      .type("mongodb_user");
    clickSave();
    cy.validateToast(
      "error",
      "There was an error saving the project: error updating project admin roles: no admin role for project 'spruce' found"
    );
  });
});

describe("Clicking on The Project Select Dropdown", () => {
  const origin = getGeneralRoute(project);

  beforeEach(() => {
    cy.visit(origin);
  });

  it("Headers are clickable", () => {
    cy.dataCy("project-select").should("be.visible");
    cy.dataCy("project-select").click();
    cy.dataCy("project-select-options").should("be.visible");
    cy.dataCy("project-select-options")
      .find("div")
      .contains("evergreen-ci/evergreen")
      .click();
    cy.location().should((loc) => expect(loc.pathname).to.not.eq(origin));
  });
});

describe("Repo Settings", () => {
  const origin = getGeneralRoute(repo);

  beforeEach(() => {
    cy.visit(origin);
  });

  describe("General settings pag", () => {
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
            "A Commit Check Definition must be specified for this feature to run."
          )
          .as("errorBanner")
          .should("be.visible");
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
          "A GitHub Patch Definition must be specified for this feature to run."
        )
          .as("errorBanner")
          .should("be.visible");
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
          "A GitHub Patch Definition must be specified for this feature to run."
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
            "A Commit Queue Patch Definition must be specified for this feature to run."
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
          "Repo message wohoo! (Default from repo)"
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
      cy.getInputByLabel("Add to GitHub Trigger Alias")
        .as("triggerAliasCheckbox")
        .should("not.be.checked");
      cy.contains("label", "Add to GitHub Trigger Alias").click();
      cy.get("@triggerAliasCheckbox").should("be.checked");
      clickSave();
      cy.validateToast("success", "Successfully updated repo");
      saveButtonEnabled(false);
      // Demonstrate Wait on field is optional
      cy.selectLGOption("Wait on", "Success");
      cy.getInputByLabel("Wait on").should(
        "have.attr",
        "aria-invalid",
        "false"
      );
      saveButtonEnabled(true);
      cy.selectLGOption("Wait on", "Select event…");
      cy.getInputByLabel("Wait on").should(
        "have.attr",
        "aria-invalid",
        "false"
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
        "errorMessage"
      );
      saveButtonEnabled(false);
      // Fix duplication
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
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
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
      cy.validateToast("success", "Successfully updated repo");
      // Promote variables
      cy.dataCy("promote-vars-modal").should("not.exist");
      cy.dataCy("promote-vars-button").click();
      cy.dataCy("promote-vars-modal").should("be.visible");
      cy.dataCy("promote-var-checkbox").first().check({ force: true });
      cy.contains("button", "Move 1 variable").click();
      cy.validateToast("success", "Successfully updated repo");
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
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(200);
      cy.contains("label", "Override Repo Patch Definition").click();
      cy.dataCy("error-banner")
        .contains(
          "A GitHub Patch Definition must be specified for this feature to run."
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
          "This feature will only run if a Commit Check Definition is defined in the project or repo."
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
        "Default to Repo (squash)"
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
        "There was an error saving the project: GitHub checks cannot be enabled without aliases"
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
        "checked"
      );
    });

    it("Patch aliases added before defaulting to repo patch aliases are cleared", () => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(200);
      // Override repo patch alias and add a patch alias.
      cy.contains("label", "Override Repo Patch Aliases")
        .should("be.visible")
        .click();
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
      cy.get('[aria-label="Git Clone"]')
        .as("gitCloneButtonContainer")
        .children()
        .should("have.length", 3);
    });

    it("Enable git clone", () => {
      cy.get("@gitCloneButtonContainer").contains("Enabled").click();
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
        `/${getVirtualWorkstationRoute(repo)}`
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

describe("Attaching Spruce to a repo", () => {
  const origin = getGeneralRoute(project);

  beforeEach(() => {
    cy.visit(origin);
  });

  it("Saves a new repo", () => {
    cy.dataCy("repo-input").as("repoInput").clear();
    cy.get("@repoInput").type("evergreen");
    cy.dataCy("attach-repo-button").should(
      "have.attr",
      "aria-disabled",
      "true"
    );
    clickSave();
    cy.validateToast("success", "Successfully updated project");
  });

  it("Attaches to new repo", () => {
    cy.dataCy("attach-repo-button").click();
    cy.dataCy("attach-repo-modal").contains("button", "Attach").click();
    cy.validateToast("success", "Successfully attached to repo");
  });

  describe("GitHub/Commit Queue page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-github-commitqueue").click();
    });

    xit("Shows warnings about enabling PR Testing", () => {
      cy.dataCy("pr-testing-enabled-radio-box")
        .contains("label", "Enabled")
        .click();
      cy.dataCy("pr-testing-enabled-radio-box")
        .prev()
        .dataCy("warning-banner")
        .should("exist");
      cy.dataCy("manual-pr-testing-enabled-radio-box")
        .prev()
        .dataCy("warning-banner")
        .should("exist");
    });

    xit("Doesn't show a warning about enabling commit checks because the feature is disabled", () => {
      cy.dataCy("github-checks-enabled-radio-box").prev().should("not.exist");
    });

    xit("Shows a warning about enabling commit queue", () => {
      cy.dataCy("cq-card").dataCy("warning-banner").should("exist");
    });

    it("Shows an error banner about enabling commit queue if the feature is enabled", () => {
      cy.dataCy("cq-enabled-radio-box").within(($el) => {
        cy.wrap($el).getInputByLabel("Enabled").parent().click();
      });
      cy.dataCy("cq-card").dataCy("error-banner").should("exist");
    });
  });
});

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
