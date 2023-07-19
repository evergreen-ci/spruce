import {
  getAccessRoute,
  getContainersRoute,
  getGeneralRoute,
  getGithubCommitQueueRoute,
  getNotificationsRoute,
  project,
  projectUseRepoEnabled,
  repo,
  saveButtonEnabled,
  clickSave,
} from "./constants";

describe("Access page", { testIsolation: false }, () => {
  const destination = getAccessRoute(projectUseRepoEnabled);
  before(() => {
    cy.visit(destination);
  });

  it("Save button should be disabled on initial load", () => {
    saveButtonEnabled(false);
  });

  it("Shows a 'Default to Repo on Page' button on page", () => {
    cy.dataCy("default-to-repo-button").should("exist").should("be.enabled");
  });

  it("Changing settings and clicking the save button produces a success toast and the changes are persisted", () => {
    cy.getInputByLabel("Unrestricted").parent().click();
    cy.getInputByLabel("Unrestricted").should(
      "have.attr",
      "aria-checked",
      "true"
    );

    cy.contains("Add Username").click();
    cy.get("[aria-label='Username'")
      .should("have.length", 1)
      .first()
      .type("admin");
    cy.get("[aria-label='Username']")
      .should("have.value", "admin")
      .should("exist");
    clickSave();
    cy.validateToast("success", "Successfully updated project");
  });

  it("Deleting a username results in a success toast and the changes are persisted", () => {
    cy.get("[aria-label='Username']").should("have.length", 1);
    cy.dataCy("delete-item-button").should("be.visible").click();
    cy.get("[aria-label='Username']").should("have.length", 0);
    clickSave();
    cy.validateToast("success", "Successfully updated project");

    cy.reload();
    cy.get("[aria-label='Username']").should("have.length", 0);
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

describe(
  "Clicking on The Project Select Dropdown",
  { testIsolation: false },
  () => {
    const destination = getGeneralRoute(project);

    before(() => {
      cy.visit(destination);
    });

    it("Headers are clickable", () => {
      cy.dataCy("project-select").should("be.visible");
      cy.dataCy("project-select").click();
      cy.dataCy("project-select-options").should("be.visible");
      cy.dataCy("project-select-options")
        .find("div")
        .contains("evergreen-ci/evergreen")
        .click();
      cy.location().should((loc) =>
        expect(loc.pathname).to.not.eq(destination)
      );
    });
  }
);

describe("Repo Settings", { testIsolation: false }, () => {
  const destination = getGeneralRoute(repo);

  before(() => {
    cy.visit(destination);
  });

  it("Should not have the save button enabled on load", () => {
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

  it("Sets a display name", () => {
    cy.dataCy("display-name-input").type("evg");
  });

  it("Clicking on save button should show a success toast", () => {
    clickSave();
    cy.validateToast("success", "Successfully updated repo");
  });

  describe("GitHub/Commit Queue page", () => {
    before(() => {
      cy.dataCy("navitem-github-commitqueue").click();
    });

    it("Should not have the save button enabled on load", () => {
      saveButtonEnabled(false);
    });

    it("Shows an error banner when a patch definition does not exist", () => {
      cy.dataCy("error-banner")
        .contains(
          "A GitHub Patch Definition must be specified for this feature to run."
        )
        .should("exist");
    });

    it("Shows an error banner when Commit Checks are enabled", () => {
      cy.dataCy("github-checks-enabled-radio-box").within(($el) => {
        cy.wrap($el).getInputByLabel("Enabled").parent().click();
      });
      cy.dataCy("error-banner")
        .contains(
          "A Commit Check Definition must be specified for this feature to run."
        )
        .should("exist");
    });

    it("Hides error banner when Commit Checks are disabled", () => {
      cy.dataCy("github-checks-enabled-radio-box").within(($el) => {
        cy.wrap($el).getInputByLabel("Disabled").parent().click();
      });
      cy.dataCy("error-banner")
        .contains(
          "A Commit Check Definition must be specified for this feature to run."
        )
        .should("not.exist");
    });

    it("Allows enabling manual PR testing", () => {
      cy.dataCy("manual-pr-testing-enabled-radio-box")
        .children()
        .first()
        .click();
    });

    it("Updates a patch definition", () => {
      cy.dataCy("add-button").contains("Add Patch Definition").parent().click();

      cy.dataCy("variant-tags-input").first().type("vtag");

      cy.dataCy("task-tags-input").first().type("ttag");
    });

    it("Does not show an error banner when a patch definition is added", () => {
      cy.contains(
        "A GitHub Patch Definition must be specified for this feature to run."
      ).should("not.exist");
    });

    it("Enabling commit queue shows hidden inputs and error banner", () => {
      const countCQFields = (count: number) => {
        cy.dataCy("cq-card").children().should("have.length", count);
      };

      countCQFields(2);
      cy.dataCy("cq-enabled-radio-box").children().first().click();
      countCQFields(7);

      cy.dataCy("error-banner")
        .contains(
          "A Commit Check Definition must be specified for this feature to run."
        )
        .should("not.exist");
    });

    it("Presents three options for merge method", () => {
      const selectId = "merge-method-select";
      cy.get(`button[name=${selectId}]`).click();
      cy.get(`#${selectId}-menu`).children().should("have.length", 3);
      cy.get(`#${selectId}-menu`).children().first().click();
    });

    it("Does not show override buttons for commit queue patch definitions", () => {
      cy.dataCy("cq-override-radio-box").should("not.exist");
    });

    it("Updates the commit queue message", () => {
      cy.dataCy("cq-message-input").type("Repo message");
    });

    it("Disables save button because Commit Queue definition is missing", () => {
      saveButtonEnabled(false);
    });

    it("Adds a commit queue definition", () => {
      cy.dataCy("add-button")
        .contains("Add Commit Queue Patch Definition")
        .parent()
        .click();
      cy.dataCy("variant-tags-input").last().type("cqvtag");
      cy.dataCy("task-tags-input").last().type("cqttag");
    });

    it("Successfully saves the page", () => {
      clickSave();
      cy.validateToast("success", "Successfully updated repo");
    });
  });

  describe("Patch Aliases page", () => {
    before(() => {
      cy.dataCy("navitem-patch-aliases").click();
    });

    it("Should not have the save button enabled on load", () => {
      saveButtonEnabled(false);
    });

    it("Does not show override buttons for patch aliases", () => {
      cy.dataCy("patch-aliases-override-radio-box").should("not.exist");
    });

    it("Prevents saving an incomplete patch alias", () => {
      cy.dataCy("add-button").contains("Add Patch Alias").parent().click();
      cy.dataCy("expandable-card-title").contains("New Patch Alias");

      cy.dataCy("alias-input").type("my alias name");
      saveButtonEnabled(false);
    });

    it("Successfully saves a complete alias", () => {
      cy.dataCy("variant-tags-input").first().type("alias variant tag");
      cy.dataCy("task-tags-input").first().type("alias task tag");
      clickSave();
      cy.validateToast("success", "Successfully updated repo");
    });

    it("Shows the alias name in the card title upon save", () => {
      cy.dataCy("expandable-card-title").contains("my alias name");
    });

    it("Saves a Patch Trigger Alias", () => {
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
      cy.dataCy("github-trigger-alias-checkbox").check({ force: true });

      clickSave();
      cy.validateToast("success", "Successfully updated repo");
      saveButtonEnabled(false);
    });

    it("Should be possible to return to a deselected state for Wait On", () => {
      cy.selectLGOption("Wait on", "Success");
      cy.getInputByLabel("Wait on").should(
        "have.attr",
        "aria-invalid",
        "false"
      );
      saveButtonEnabled();
      cy.selectLGOption("Wait on", "Select event…");
      cy.getInputByLabel("Wait on").should(
        "have.attr",
        "aria-invalid",
        "false"
      );
      saveButtonEnabled(false);
    });
  });

  describe("Virtual Workstation page", { testIsolation: false }, () => {
    before(() => {
      cy.dataCy("navitem-virtual-workstation").click();
    });

    it("Adds two commands", () => {
      saveButtonEnabled(false);

      cy.dataCy("add-button").click({ force: true });
      cy.dataCy("command-input").type("command 1");
      cy.dataCy("directory-input").type("mongodb.user.directory");

      cy.dataCy("add-button").click({ force: true });
      cy.dataCy("command-input").eq(1).type("command 2");

      clickSave();
      cy.validateToast("success", "Successfully updated repo");
    });

    it("Reorders the commands", () => {
      cy.dataCy("array-down-button").click();

      cy.dataCy("save-settings-button").scrollIntoView();
      clickSave();
      cy.validateToast("success", "Successfully updated repo");

      cy.dataCy("command-input").first().should("have.value", "command 2");
      cy.dataCy("command-input").eq(1).should("have.value", "command 1");
    });
  });

  describe("GitHub/Commit Queue page after adding patch trigger alias", () => {
    before(() => {
      cy.dataCy("navitem-github-commitqueue").click();
    });

    it("Shows the patch trigger alias", () => {
      cy.contains("GitHub Trigger Aliases").scrollIntoView();
      cy.dataCy("pta-item").should("have.length", 1);
      cy.contains("my-alias").should("be.visible");
    });

    it("Hovering over the alias name shows its details", () => {
      cy.dataCy("pta-item").trigger("mouseover");
      cy.dataCy("pta-tooltip").should("be.visible");
      cy.dataCy("pta-tooltip").contains("spruce");
      cy.dataCy("pta-tooltip").contains("module_name");
      cy.dataCy("pta-tooltip").contains("Variant/Task Regex Pairs");
    });
  });
});

describe(
  "Project Settings when not defaulting to repo",
  { testIsolation: false },
  () => {
    const destination = getGeneralRoute(project);

    before(() => {
      cy.visit(destination);
    });

    it("Should not have the save button enabled on load", () => {
      saveButtonEnabled(false);
    });

    it("Does not show a 'Default to Repo' button on page", () => {
      cy.dataCy("default-to-repo-button").should("not.exist");
    });

    it("Shows two radio boxes", () => {
      cy.dataCy("enabled-radio-box").children().should("have.length", 2);
    });

    it("Successfully attaches to a repo that does not yet exist and shows 'Default to Repo' options", () => {
      cy.dataCy("attach-repo-button").click();
      cy.dataCy("attach-repo-modal")
        .find("button")
        .contains("Attach")
        .parent()
        .click();
      cy.validateToast("success", "Successfully attached to repo");
    });

    it("Successfully detaches from repo", () => {
      cy.dataCy("attach-repo-button").click();
      cy.dataCy("attach-repo-modal")
        .find("button")
        .contains("Detach")
        .parent()
        .click();
      cy.validateToast("success", "Successfully detached from repo");
    });

    describe("Variables page", () => {
      before(() => {
        cy.dataCy("navitem-variables").click();
      });

      it("Should not have the save button enabled on load", () => {
        saveButtonEnabled(false);
      });

      it("Should not show the move variables button", () => {
        cy.dataCy("promote-vars-button").should("not.exist");
      });

      it("Should not enable save when the value field is empty", () => {
        cy.dataCy("add-button").click();
        cy.dataCy("var-name-input").type("sample_name");
        saveButtonEnabled(false);
      });

      it("Should correctly save a private variable", () => {
        cy.dataCy("var-value-input").type("sample_value");
        cy.dataCy("var-private-input").check({ force: true });
        clickSave();
        cy.validateToast("success", "Successfully updated project");
      });

      it("Should redact and disable private variables on save", () => {
        cy.dataCy("var-value-input").should("have.value", "{REDACTED}");
        cy.dataCy("var-name-input").should("be.disabled");
        cy.dataCy("var-value-input").should("be.disabled");
        cy.dataCy("var-private-input").should("be.disabled");
        cy.dataCy("var-admin-input").should("be.disabled");
      });

      it("Should error when a duplicate variable name is entered and disable saving", () => {
        cy.dataCy("add-button").click();
        cy.dataCy("var-name-input").first().type("sample_name");
        cy.dataCy("var-value-input").first().type("sample_value_2");
        cy.contains("Value already appears in project variables.");
        saveButtonEnabled(false);
      });

      it("Should remove the error and enable save when the value changes", () => {
        cy.dataCy("var-name-input").first().type("_2");
        saveButtonEnabled();
        cy.contains("Value already appears in project variables.").should(
          "not.exist"
        );
      });

      it("Should correctly save an admin only variable", () => {
        cy.dataCy("add-button").click();
        cy.dataCy("var-name-input").first().type("admin_var");
        cy.dataCy("var-value-input").first().type("admin_value");
        cy.dataCy("var-admin-input").first().check({ force: true });
        clickSave();
        cy.validateToast("success", "Successfully updated project");
      });

      it("Should show three populated fields when navigating back from another page", () => {
        cy.dataCy("navitem-access").click();
        cy.dataCy("navitem-variables").click();
        cy.dataCy("var-name-input").eq(0).should("have.value", "admin_var");
        cy.dataCy("var-name-input").eq(1).should("have.value", "sample_name");
        cy.dataCy("var-name-input").eq(2).should("have.value", "sample_name_2");
      });

      it("Should allow deleting all items", () => {
        cy.dataCy("delete-item-button").first().click();
        cy.dataCy("delete-item-button").first().click();
        cy.dataCy("delete-item-button").first().click();
        clickSave();
        cy.validateToast("success", "Successfully updated project");
      });

      it("Should show no variables after deleting", () => {
        cy.dataCy("var-name-input").should("not.exist");
      });
    });

    describe("GitHub/Commit Queue page", () => {
      before(() => {
        cy.dataCy("navitem-github-commitqueue").click();
      });

      it("Allows adding a git tag alias", () => {
        cy.dataCy("git-tag-enabled-radio-box").children().first().click();
        cy.dataCy("add-button").contains("Add Git Tag").parent().click();
        cy.dataCy("git-tag-input").type("myGitTag");
        cy.dataCy("remote-path-input").type("./evergreen.yml");

        clickSave();
        cy.validateToast("success", "Successfully updated project");
      });

      it("Shows the saved Git Tag", () => {
        cy.dataCy("remote-path-input").should("have.value", "./evergreen.yml");
      });
    });

    describe("Periodic Builds page", () => {
      before(() => {
        cy.dataCy("navitem-periodic-builds").click({ force: true });
      });

      it("Does not allow saving when interval is not a number", () => {
        cy.dataCy("add-button").click();
        cy.dataCy("interval-input").type("NaN");
        cy.dataCy("config-file-input").type("config.yml");
        saveButtonEnabled(false);
        cy.contains("Value should be a number.");
      });

      it("Does not allow saving when interval is below minimum", () => {
        cy.dataCy("interval-input").clear().type("0");
        saveButtonEnabled(false);
      });

      it("Saves when a number is entered", () => {
        cy.dataCy("interval-input").clear().type("12");
        clickSave();
        cy.validateToast("success", "Successfully updated project");
      });
    });

    describe("Project Triggers page", () => {
      before(() => {
        cy.dataCy("navitem-project-triggers").click({ force: true });
      });

      it("Saves a project trigger", () => {
        cy.dataCy("add-button").click();
        cy.dataCy("project-input")
          .should("be.visible")
          .should("not.be.disabled");
        cy.dataCy("project-input").type("spruce");
        cy.dataCy("config-file-input").type(".evergreen.yml");
      });
    });
  }
);

describe(
  "Project Settings when defaulting to repo",
  { testIsolation: false },
  () => {
    const destination = getGeneralRoute(projectUseRepoEnabled);

    before(() => {
      cy.visit(destination);
    });

    describe("General Settings page", () => {
      it("Should not have the save button enabled on load", () => {
        saveButtonEnabled(false);
      });

      it("Shows a link to the repo", () => {
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
      });

      it("Enables the save button", () => {
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
      before(() => {
        cy.dataCy("navitem-variables").click();
      });

      it("Successfully saves variables", () => {
        cy.dataCy("add-button").click();
        cy.dataCy("var-name-input").type("a");
        cy.dataCy("var-value-input").type("1");
        cy.dataCy("var-private-input").check({ force: true });

        cy.dataCy("add-button").click();
        cy.dataCy("var-name-input").first().type("b");
        cy.dataCy("var-value-input").first().type("2");

        cy.dataCy("add-button").click();
        cy.dataCy("var-name-input").first().type("c");
        cy.dataCy("var-value-input").first().type("3");

        clickSave();
        cy.validateToast("success", "Successfully updated project");
      });

      it("Opens the modal and promotes variables", () => {
        cy.dataCy("promote-vars-modal").should("not.exist");
        cy.dataCy("promote-vars-button").click();
        cy.dataCy("promote-vars-modal").should("be.visible");
        cy.dataCy("promote-var-checkbox").first().check({ force: true });
        cy.contains("button", "Move 1 variable").click();
        cy.validateToast("success");
      });
    });

    describe("GitHub/Commit Queue page", () => {
      before(() => {
        cy.dataCy("navitem-github-commitqueue").click();
      });

      it("Should not have the save button enabled on load", () => {
        saveButtonEnabled(false);
      });

      it("Shows the repo's disabled patch definition", () => {
        cy.dataCy("accordion-toggle").should("exist");
        cy.dataCy("accordion-toggle").first().click();
        cy.dataCy("variant-tags-input").should("have.value", "vtag");
        cy.dataCy("variant-tags-input").should("be.disabled");
        cy.dataCy("task-tags-input").should("have.value", "ttag");
        cy.dataCy("task-tags-input").should("be.disabled");
      });

      it("Does not show an error banner when a patch definition is defined in the repo", () => {
        cy.contains(
          "A GitHub Patch Definition must be specified for this feature to run."
        ).should("not.exist");
      });

      it("Allows overriding repo patch definitions", () => {
        cy.getInputByLabel("Override Repo Patch Definition").first().click({
          force: true,
        });
        cy.dataCy("error-banner")
          .contains(
            "A GitHub Patch Definition must be specified for this feature to run."
          )
          .should("exist");
        cy.dataCy("add-button")
          .contains("Add Patch Definition")
          .parent()
          .click();
        cy.dataCy("variant-input-control")
          .find("button")
          .contains("Regex")
          .click();
        cy.dataCy("variant-input").first().type(".*");
      });

      it("Disables save when the task field is empty", () => {
        saveButtonEnabled(false);
      });

      it("Does not clear tag/regex fields when toggling between them", () => {
        cy.contains("button", "Tags").first().click();
        cy.contains("button", "Regex").first().click();

        cy.dataCy("variant-input").should("have.value", ".*");
      });

      it("Should enable save when the task and variant fields are filled in", () => {
        cy.dataCy("task-input-control")
          .find("button")
          .contains("Regex")
          .click();
        cy.dataCy("task-input").first().type(".*");
        saveButtonEnabled();
      });

      it("Shows a warning banner when a commit check definition does not exist", () => {
        cy.dataCy("github-checks-enabled-radio-box").within(($el) => {
          cy.wrap($el).getInputByLabel("Enabled").parent().click();
        });

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

      it("Shows the repo's commit queue message as a placeholder when the field is cleared", () => {
        cy.dataCy("cq-message-input").clear();
        cy.dataCy("cq-message-input").should(
          "have.attr",
          "placeholder",
          "Repo message (Default from repo)"
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
        clickSave();
        cy.validateToast("error");
      });

      it("Disabling commit checks saves successfully", () => {
        cy.dataCy("github-checks-enabled-radio-box").within(($el) => {
          cy.wrap($el).getInputByLabel("Disabled").parent().click();
        });

        clickSave();
        cy.validateToast("success", "Successfully updated project");
      });

      it("Defaults to repo", () => {
        cy.dataCy("default-to-repo-button").click();
        cy.dataCy("default-to-repo-modal").should("be.visible");
        cy.dataCy("default-to-repo-modal")
          .contains("button", "Confirm")
          .click();
        cy.validateToast("success", "Successfully defaulted page to repo");
      });

      it("Again shows the repo's disabled patch definition", () => {
        cy.dataCy("accordion-toggle").should("exist");
        cy.dataCy("accordion-toggle").contains("Patch Definition 1");
      });
    });

    describe("Patch Aliases page", () => {
      before(() => {
        cy.dataCy("navitem-patch-aliases").click();
      });

      it("Should not have the save button enabled on load", () => {
        saveButtonEnabled(false);
      });

      it("Defaults to repo patch aliases", () => {
        cy.getInputByLabel("Default to Repo Patch Aliases").should(
          "have.attr",
          "checked"
        );
      });

      it("Shows the saved repo patch alias", () => {
        cy.dataCy("expandable-card-title").contains("my alias name");
      });

      it("Displays disabled fields when the card is expanded", () => {
        cy.dataCy("expandable-card-title")
          .parentsUntil("div")
          .first()
          .click({ force: true });
        cy.dataCy("expandable-card").find("input").should("be.disabled");
        cy.dataCy("expandable-card").find("button").should("be.disabled");
      });

      it("Allows adding a patch alias", () => {
        cy.getInputByLabel("Override Repo Patch Aliases").click({
          force: true,
        });
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
      });

      it("Allows defaulting to repo patch aliases", () => {
        cy.getInputByLabel("Default to Repo Patch Aliases").click({
          force: true,
        });

        clickSave();
        cy.validateToast("success", "Successfully updated project");

        saveButtonEnabled(false);
        cy.dataCy("expandable-card-title").contains("my alias name");
      });

      it("Has cleared previously saved alias definitions", () => {
        cy.getInputByLabel("Override Repo Patch Aliases").click({
          force: true,
        });
        cy.dataCy("alias-row").should("have.length", 0);
      });
    });

    describe("Virtual Workstation page", () => {
      before(() => {
        cy.dataCy("navitem-virtual-workstation").click();
      });

      it("Shows repo commands", () => {
        cy.dataCy("add-button").should("not.exist");
        cy.dataCy("command-row").should("have.length", 2);
        cy.dataCy("command-row").each(() => {
          cy.get("input").should("be.disabled");
          cy.get("textarea").should("be.disabled");
        });
      });

      it("Allows overriding without adding a command", () => {
        cy.getInputByLabel("Override Repo Commands").click({ force: true });

        clickSave();
        cy.validateToast("success", "Successfully updated project");

        cy.getInputByLabel("Override Repo Commands").should("be.checked");
      });
    });
  }
);

describe("Attaching Spruce to a repo", { testIsolation: false }, () => {
  const destination = getGeneralRoute(project);

  before(() => {
    cy.visit(destination);
  });

  it("Saves a new repo", () => {
    cy.dataCy("repo-input").clear().type("evergreen");

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
    before(() => {
      cy.dataCy("navitem-github-commitqueue").click();
    });

    it("Shows warnings about enabling PR Testing", () => {
      cy.dataCy("pr-testing-enabled-radio-box")
        .prev()
        .dataCy("warning-banner")
        .should("exist");
      cy.dataCy("manual-pr-testing-enabled-radio-box")
        .prev()
        .dataCy("warning-banner")
        .should("exist");
    });

    it("Doesn't show a warning about enabling commit checks because the feature is disabled", () => {
      cy.dataCy("github-checks-enabled-radio-box").prev().should("not.exist");
    });

    it("Shows a warning about enabling commit queue", () => {
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

describe("Renaming the identifier", { testIsolation: false }, () => {
  const destination = getGeneralRoute(project);

  before(() => {
    cy.visit(destination);
  });

  it("Shows warning text when identifier is changed", () => {
    const warningText =
      "Updates made to the project identifier will change the identifier used for the CLI, inter-project dependencies, etc. Project users should be made aware of this change, as the old identifier will no longer work.";

    cy.dataCy("input-warning").should("not.exist");
    cy.dataCy("identifier-input").clear().type("new-identifier");
    cy.dataCy("input-warning").should("contain", warningText);
  });

  it("Successfully saves", () => {
    clickSave();
    cy.validateToast("success", "Successfully updated project");
  });

  it("Redirects to a new URL", () => {
    cy.url().should("include", "new-identifier");
  });
});

describe(
  "A project that has GitHub webhooks disabled",
  { testIsolation: false },
  () => {
    const destination = getGithubCommitQueueRoute("logkeeper");

    before(() => {
      cy.visit(destination);
    });

    it("Disables all interactive elements on the page", () => {
      cy.dataCy("project-settings-page")
        .find("button")
        .should("have.attr", "aria-disabled", "true");
      cy.get("input").should("be.disabled");
    });
  }
);

describe("Notifications", { testIsolation: false }, () => {
  const destination = getNotificationsRoute("evergreen");
  before(() => {
    cy.visit(destination);
  });
  it("Does not show a 'Default to Repo' button on page", () => {
    cy.dataCy("default-to-repo-button").should("not.exist");
  });
  it("shouldn't have any subscriptions defined", () => {
    cy.contains("No subscriptions are defined.").should("exist");
  });
  it("shouldn't be able to save anything if no changes were made", () => {
    saveButtonEnabled(false);
  });
  it("should be able to add a subscription and save it", () => {
    cy.dataCy("expandable-card").should("not.exist");
    cy.dataCy("add-button").contains("Add Subscription").should("be.visible");
    cy.dataCy("add-button").contains("Add Subscription").click({ force: true });
    cy.dataCy("expandable-card").should("contain.text", "New Subscription");
    cy.selectLGOption("Event", "Any Version Finishes");
    cy.selectLGOption("Notification Method", "Email");
    cy.getInputByLabel("Email").type("mohamed.khelif@mongodb.com");
    cy.dataCy("save-settings-button").scrollIntoView();
    clickSave();
    cy.validateToast("success", "Successfully updated project");

    saveButtonEnabled(false);
    cy.dataCy("expandable-card").should("exist");
    cy.dataCy("expandable-card").scrollIntoView();
    cy.dataCy("expandable-card").should(
      "contain.text",
      "Version outcome  - mohamed.khelif@mongodb.com"
    );
  });
  it("should be able to delete a subscription", () => {
    cy.dataCy("expandable-card").should("exist");
    cy.dataCy("expandable-card").scrollIntoView();
    cy.dataCy("delete-item-button").click({ force: true });
    cy.dataCy("expandable-card").should("not.exist");
    cy.dataCy("save-settings-button").scrollIntoView();
    clickSave();
    cy.validateToast("success", "Successfully updated project");
  });
  it("should not be able to combine a jira comment subscription with a task event", () => {
    cy.dataCy("expandable-card").should("not.exist");
    cy.dataCy("add-button").contains("Add Subscription").should("be.visible");
    cy.dataCy("add-button").contains("Add Subscription").click({ force: true });
    cy.dataCy("expandable-card").should("exist").scrollIntoView();
    cy.dataCy("expandable-card").should("contain.text", "New Subscription");
    cy.selectLGOption("Event", "Any Task Finishes");
    cy.selectLGOption("Notification Method", "Comment on a JIRA issue");
    cy.getInputByLabel("JIRA Issue").type("JIRA-123");
    cy.contains("Subscription type not allowed for tasks in a project.").should(
      "exist"
    );
    cy.dataCy("save-settings-button").scrollIntoView();
    saveButtonEnabled(false);
  });
  it("should not be able to save a subscription if an input is invalid", () => {
    cy.selectLGOption("Event", "Any Version Finishes");
    cy.selectLGOption("Notification Method", "Email");
    cy.getInputByLabel("Email").type("Not a real email");
    cy.contains("Value should be a valid email.").should("exist");
    cy.dataCy("save-settings-button").scrollIntoView();
    saveButtonEnabled(false);
  });
  it("Setting a project banner displays the banner on the correct pages and unsetting is removes it", () => {
    cy.visit(destination);
    const bannerText = "This is a project banner!";

    // set banner
    cy.dataCy("banner-text").clear().type(bannerText);
    clickSave();
    cy.validateToast("success", "Successfully updated project");

    // ensure banner is displayed
    cy.contains(bannerText).should("be.visible");

    const taskRoute =
      "task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
    cy.visit(taskRoute);
    cy.contains(bannerText).should("be.visible");

    const configureRoute = "patch/5e6bb9e23066155a993e0f1b/configure/tasks";
    cy.visit(configureRoute);
    cy.contains(bannerText).should("be.visible");

    const versionRoute = "version/5e4ff3abe3c3317e352062e4";
    cy.visit(versionRoute);
    cy.contains(bannerText).should("be.visible");

    const projectHealthRoute = "commits/evergreen";
    cy.visit(projectHealthRoute);
    cy.contains(bannerText).should("be.visible");

    const variantHistoryRoute = "/variant-history/evergreen/ubuntu1604";
    cy.visit(variantHistoryRoute);
    cy.contains(bannerText).should("be.visible");

    const taskHistoryRoute = "task-history/evergreen/test-cloud";
    cy.visit(taskHistoryRoute);
    cy.contains(bannerText).should("be.visible");

    // clear banner
    cy.visit(destination);
    cy.dataCy("banner-text").clear();
    clickSave();

    // ensure banner is not displayed
    cy.contains(bannerText).should("not.exist");

    cy.visit(taskRoute);
    cy.contains(bannerText).should("not.exist");

    cy.visit(configureRoute);
    cy.contains(bannerText).should("not.exist");

    cy.visit(versionRoute);
    cy.contains(bannerText).should("not.exist");

    cy.visit(projectHealthRoute);
    cy.contains(bannerText).should("not.exist");

    cy.visit(variantHistoryRoute);
    cy.contains(bannerText).should("not.exist");

    cy.visit(taskHistoryRoute);
    cy.contains(bannerText).should("not.exist");
  });
});

describe("Containers", () => {
  const destination = getContainersRoute("spruce");
  beforeEach(() => {
    cy.visit(destination);
    // Wait for page content to load.
    cy.contains("Container Configurations").should("exist");
  });
  it("shouldn't have any container configurations defined", () => {
    cy.dataCy("container-size-row").should("not.exist");
  });
  it("shouldn't be able to save anything if no changes were made", () => {
    saveButtonEnabled(false);
  });
  it("should be able to add a container configuration and save it", () => {
    cy.dataCy("add-button").should("be.visible");
    cy.dataCy("add-button").trigger("mouseover").click();
    cy.dataCy("container-size-row").should("exist");

    // Test validation for empty fields
    cy.getInputByLabel("Name").type("test container");
    cy.getInputByLabel("Memory (MB)").clear();
    cy.getInputByLabel("CPU").clear();
    saveButtonEnabled(false);

    cy.getInputByLabel("Memory (MB)").type("1024");
    cy.getInputByLabel("CPU").type("1024");
    saveButtonEnabled(true);
    cy.dataCy("save-settings-button").scrollIntoView();
    clickSave();
    cy.validateToast("success", "Successfully updated project");
  });
  it("should be able to delete a container configuration", () => {
    cy.dataCy("container-size-row").should("exist");
    cy.dataCy("delete-item-button").should("be.visible");
    cy.dataCy("delete-item-button").should("not.be.disabled");
    cy.dataCy("delete-item-button").trigger("mouseover").click();

    cy.dataCy("container-size-row").should("not.exist");
    cy.dataCy("save-settings-button").scrollIntoView();
    clickSave();
    cy.validateToast("success", "Successfully updated project");
  });
});
