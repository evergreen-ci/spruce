const getSettingsRoute = (identifier: string) =>
  `project/${identifier}/settings`;
const getGeneralRoute = (identifier: string) =>
  `${getSettingsRoute(identifier)}/general`;
const getGithubCommitQueueRoute = (identifier: string) =>
  `${getSettingsRoute(identifier)}/github-commitqueue`;
const getNotificationsRoute = (identifier: string) =>
  `${getSettingsRoute(identifier)}/notifications`;
const getAccessRoute = (identifier: string) =>
  `${getSettingsRoute(identifier)}/access`;

const project = "spruce";
const projectUseRepoEnabled = "evergreen";
const repo = "602d70a2b2373672ee493184";

describe("Access page", () => {
  const destination = getAccessRoute(projectUseRepoEnabled);
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.visit(destination);
  });

  it("Save button should be disabled on initial load", () => {
    cy.dataCy("save-settings-button").should("be.disabled");
  });

  it("Shows a 'Default to Repo on Page' button on page", () => {
    cy.dataCy("default-to-repo-button").should("exist").should("be.enabled");
  });

  it("Should enable the save button when the General Access value changes", () => {
    cy.get("label").contains("Private").click();
    cy.dataCy("save-settings-button").should("be.enabled");
  });

  it("Should enable the save button when the General Access value changes", () => {
    cy.get("label").contains("Private").click();
    cy.dataCy("save-settings-button").should("be.enabled");
  });

  it("Should enable the save button when the Internal Access value changes", () => {
    cy.get("label").contains("Unrestricted").click();
    cy.dataCy("save-settings-button").should("be.enabled");
  });

  it("Changing settings and clicking the save button produces a success toast and the changes are persisted", () => {
    cy.get("label").contains("Private").click();
    cy.get("label").contains("Unrestricted").click();
    cy.contains("Add Username").click();
    cy.get("[aria-label='Username'")
      .should("have.length", 1)
      .first()
      .type("admin");
    cy.dataCy("save-settings-button").should("be.enabled").click();
    cy.visit(destination);
    cy.get("label")
      .contains("Private")
      .closest("label")
      .should("have.attr", "checked", "checked");
    cy.get("label")
      .contains("Unrestricted")
      .closest("label")
      .get("input")
      .should("have.attr", "checked", "checked");
    cy.get("[aria-label='Username'").contains("admin").should("exist");
  });

  it("Deleting a username results in a success toast and the changes are persisted", () => {
    cy.get("[aria-label='Username'").should("have.length", 1);
    cy.dataCy("delete-item-button").click();
    cy.get("[aria-label='Username'").should("have.length", 1).contains("admin").should("exist");;
    cy.reload()
    cy.get("[aria-label='Username'").should("have.length", 0);
  })
  
  it("Submitting a username produces an error toast", () => {
    cy.visit(getAccessRoute(project));
    cy.contains("Add Username").click();
    cy.get("[aria-label='Username'")
      .should("have.length", 4)
      .first()
      .type("mongodb_user");
    cy.dataCy("save-settings-button").should("be.enabled").click();
    cy.validateToast(
      "error",
      "There was an error saving the project: error updating project admin roles: no admin role for project 'spruce' found"
    );
  });
});

describe("Clicking on The Project Select Dropdown ", () => {
  const destination = getGeneralRoute(project);

  before(() => {
    cy.login();
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
    cy.location().should((loc) => expect(loc.pathname).to.not.eq(destination));
  });
});

describe("Repo Settings", () => {
  const destination = getGeneralRoute(repo);

  before(() => {
    cy.login();
    cy.visit(destination);
  });

  it("Should not have the save button enabled on load", () => {
    cy.dataCy("save-settings-button").should("be.disabled");
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

  it("Sets a display name", () => {
    cy.dataCy("display-name-input").type("evg");
  });

  it("Clicking on save button should show a success toast", () => {
    cy.dataCy("save-settings-button").click();
    cy.validateToast("success", "Successfully updated repo");
  });

  describe("GitHub/Commit Queue page", () => {
    before(() => {
      cy.dataCy("navitem-github-commitqueue").click();
    });

    it("Should not have the save button enabled on load", () => {
      cy.dataCy("save-settings-button").should("be.disabled");
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
      cy.dataCy("cq-card").children().eq(1).should("be.empty");
      cy.dataCy("cq-enabled-radio-box").children().first().click();
      countCQFields(5);

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
      cy.dataCy("save-settings-button").should("be.disabled");
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
      cy.dataCy("save-settings-button").click();
      cy.validateToast("success", "Successfully updated repo");
    });
  });

  describe("Patch Aliases page", () => {
    before(() => {
      cy.dataCy("navitem-patch-aliases").click();
    });

    it("Should not have the save button enabled on load", () => {
      cy.dataCy("save-settings-button").should("be.disabled");
    });

    it("Does not show override buttons for patch aliases", () => {
      cy.dataCy("patch-aliases-override-radio-box").should("not.exist");
    });

    it("Prevents saving an incomplete patch alias", () => {
      cy.dataCy("add-button").contains("Add Patch Alias").parent().click();
      cy.dataCy("expandable-card-title").contains("New Patch Alias");

      cy.dataCy("alias-input").type("my alias name");
      cy.dataCy("save-settings-button").should("be.disabled");
    });

    it("Successfully saves a complete alias", () => {
      cy.dataCy("variant-tags-input").first().type("alias variant tag");

      cy.dataCy("task-tags-input").first().type("alias task tag");

      cy.dataCy("save-settings-button").click();
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
      cy.get("button").contains("Variant/Task").click();
      cy.dataCy("variant-regex-input").type(".*");
      cy.dataCy("task-regex-input").type(".*");
      cy.dataCy("github-trigger-alias-checkbox").check({ force: true });

      cy.dataCy("save-settings-button").click();
      cy.validateToast("success", "Successfully updated repo");

      cy.dataCy("save-settings-button").should("be.disabled");
    });
  });

  describe("Virtual Workstation page", () => {
    before(() => {
      cy.dataCy("navitem-virtual-workstation").click();
    });

    it("Adds two commands", () => {
      cy.dataCy("save-settings-button").should("be.disabled");

      cy.dataCy("add-button").click({ force: true });
      cy.dataCy("command-input").type("command 1");
      cy.dataCy("directory-input").type("mongodb.user.directory");

      cy.dataCy("add-button").click({ force: true });
      cy.dataCy("command-input").eq(1).type("command 2");

      cy.dataCy("save-settings-button").click();
      cy.validateToast("success", "Successfully updated repo");
    });

    it("Reorders the commands", () => {
      cy.dataCy("array-down-button").click();

      cy.dataCy("save-settings-button").scrollIntoView().click();
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
      cy.dataCy("pta-item").should("have.length", 1);
    });

    it("Hovering over the alias name shows its details", () => {
      cy.dataCy("pta-item").scrollIntoView();
      cy.dataCy("pta-item").trigger("mouseover");
      cy.dataCy("pta-tooltip").should("be.visible");
      cy.dataCy("pta-tooltip").contains("spruce");
      cy.dataCy("pta-tooltip").contains("module_name");
      cy.dataCy("pta-tooltip").contains("Variant/Task Regex Pairs");
    });
  });
});

describe("Project Settings when not defaulting to repo", () => {
  const destination = getGeneralRoute(project);

  before(() => {
    cy.login();
    cy.visit(destination);
  });

  it("Should not have the save button enabled on load", () => {
    cy.dataCy("save-settings-button").should("be.disabled");
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
      cy.dataCy("save-settings-button").should("be.disabled");
    });

    it("Should not enable save when the value field is empty", () => {
      cy.dataCy("add-button").click();
      cy.dataCy("var-name-input").type("sample_name");
      cy.dataCy("save-settings-button").should("be.disabled");
    });

    it("Should correctly save a private variable", () => {
      cy.dataCy("var-value-input").type("sample_value");
      cy.dataCy("var-private-input").check({ force: true });
      cy.dataCy("save-settings-button").click();
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
      cy.dataCy("save-settings-button").should("be.disabled");
    });

    it("Should remove the error and enable save when the value changes", () => {
      cy.dataCy("var-name-input").first().type("_2");
      cy.dataCy("save-settings-button").should("not.be.disabled");
      cy.contains("Value already appears in project variables.").should(
        "not.exist"
      );
    });

    it("Should correctly save an admin only variable", () => {
      cy.dataCy("add-button").click();
      cy.dataCy("var-name-input").first().type("admin_var");
      cy.dataCy("var-value-input").first().type("admin_value");
      cy.dataCy("var-admin-input").first().check({ force: true });
      cy.dataCy("save-settings-button").click();
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
      cy.dataCy("save-settings-button").click();
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

      cy.dataCy("save-settings-button").click();
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
      cy.dataCy("save-settings-button").should("be.disabled");
      cy.contains("Value should be a number.");
    });

    it("Does not allow saving when interval is below minimum", () => {
      cy.dataCy("interval-input").clear().type("0");
      cy.dataCy("save-settings-button").should("be.disabled");
    });

    it("Saves when a number is entered", () => {
      cy.dataCy("interval-input").clear().type("12");
      cy.dataCy("save-settings-button").click();
      cy.validateToast("success", "Successfully updated project");
    });
  });

  describe("Project Triggers page", () => {
    before(() => {
      cy.dataCy("navitem-project-triggers").click({ force: true });
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
  const destination = getGeneralRoute(projectUseRepoEnabled);

  before(() => {
    cy.login();
    cy.visit(destination);
  });

  describe("General Settings page", () => {
    it("Should not have the save button enabled on load", () => {
      cy.dataCy("save-settings-button").should("be.disabled");
    });

    it("Preserves edits to the form when navigating between settings tabs and does not show a warning modal", () => {
      cy.dataCy("spawn-host-input").should("have.value", "/path");
      cy.dataCy("spawn-host-input").type("/test");
      cy.dataCy("save-settings-button").should("not.be.disabled");
      cy.dataCy("navitem-access").click();
      cy.dataCy("navigation-warning-modal").should("not.exist");
      cy.dataCy("navitem-general").click();
      cy.dataCy("spawn-host-input").should("have.value", "/path/test");
    });

    it("Enables the save button", () => {
      cy.dataCy("save-settings-button").should("not.be.disabled");
    });

    it("Shows a 'Default to Repo' button on page", () => {
      cy.dataCy("default-to-repo-button").should("exist");
    });

    it("Shows a third radio box when rendering a project that inherits from repo", () => {
      cy.dataCy("enabled-radio-box").children().should("have.length", 3);
    });

    it("Does not default to repo value for display name", () => {
      cy.dataCy("display-name-input").should("not.have.attr", "placeholder");
    });

    it.skip("Shows a navigation warning modal when navigating away from project settings", () => {
      cy.contains("My Patches").click();
      cy.dataCy("navigation-warning-modal").should("be.visible");
      cy.get("body").type("{esc}");
    });

    it("Shows the repo value for Batch Time", () => {
      cy.dataCy("batch-time-input").should("have.attr", "placeholder");
    });

    it("Clicking on save button should show a success toast", () => {
      cy.dataCy("save-settings-button").click();
      cy.validateToast("success", "Successfully updated project");
    });

    it("Saves when batch time is updated", () => {
      cy.dataCy("batch-time-input").type("12");
      cy.dataCy("save-settings-button").click();
      cy.validateToast("success", "Successfully updated project");
    });
  });

  describe("GitHub/Commit Queue page", () => {
    before(() => {
      cy.dataCy("navitem-github-commitqueue").click();
    });

    it("Should not have the save button enabled on load", () => {
      cy.dataCy("save-settings-button").should("be.disabled");
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
      cy.dataCy("add-button").contains("Add Patch Definition").parent().click();
      cy.dataCy("variant-input-control")
        .find("button")
        .contains("Regex")
        .click();
      cy.dataCy("variant-input").first().type(".*");
    });

    it("Disables save when the task field is empty", () => {
      cy.dataCy("save-settings-button").should("be.disabled");
    });

    it("Does not clear tag/regex fields when toggling between them", () => {
      cy.get("button").contains("Tags").first().click();
      cy.get("button").contains("Regex").first().click();

      cy.dataCy("variant-input").should("have.value", ".*");
    });

    it("Should enable save when the task and variant fields are filled in", () => {
      cy.dataCy("task-input-control").find("button").contains("Regex").click();
      cy.dataCy("task-input").first().type(".*");
      cy.dataCy("save-settings-button").should("not.be.disabled");
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
      cy.dataCy("save-settings-button").click();
      cy.validateToast("error");
    });

    it("Disabling commit checks saves successfully", () => {
      cy.dataCy("github-checks-enabled-radio-box").within(($el) => {
        cy.wrap($el).getInputByLabel("Disabled").parent().click();
      });

      cy.dataCy("save-settings-button").click();
      cy.validateToast("success", "Successfully updated project");
    });

    it("Defaults to repo", () => {
      cy.dataCy("default-to-repo-button").click();
      cy.dataCy("default-to-repo-modal").should("be.visible");
      cy.dataCy("default-to-repo-modal")
        .find("button")
        .contains("Confirm")
        .parent()
        .click();
      cy.validateToast("success");
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
      cy.dataCy("save-settings-button").should("be.disabled");
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
      cy.dataCy("save-settings-button").should("be.disabled");

      cy.dataCy("add-button")
        .contains("Add Patch Alias")
        .parent()
        .click({ force: true });
      cy.dataCy("save-settings-button").should("be.disabled");

      cy.dataCy("alias-input").type("my overriden alias name");

      cy.dataCy("variant-tags-input").first().type("alias variant tag 2");

      cy.dataCy("task-tags-input").first().type("alias task tag 2");
      cy.dataCy("add-button").contains("Add Task Tag").parent().click();
      cy.dataCy("task-tags-input").first().type("alias task tag 3");

      cy.dataCy("save-settings-button").click();
      cy.validateToast("success", "Successfully updated project");
    });

    it("Allows defaulting to repo patch aliases", () => {
      cy.getInputByLabel("Default to Repo Patch Aliases").click({
        force: true,
      });

      cy.dataCy("save-settings-button").click();
      cy.validateToast("success", "Successfully updated project");

      cy.dataCy("save-settings-button").should("be.disabled");
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

      cy.dataCy("save-settings-button").click();
      cy.validateToast("success", "Successfully updated project");

      cy.getInputByLabel("Override Repo Commands").should("be.checked");
    });
  });
});

describe("Attaching Spruce to a repo", () => {
  const destination = getGeneralRoute(project);

  before(() => {
    cy.login();
    cy.visit(destination);
  });

  it("Saves a new repo", () => {
    cy.dataCy("repo-input").clear().type("evergreen");

    // TODO: Re-add test when EVG-16604 is completed.
    // cy.dataCy("attach-repo-button").should("be.disabled");

    cy.dataCy("save-settings-button").click();
    cy.validateToast("success", "Successfully updated project");
  });

  it("Attaches to new repo", () => {
    cy.dataCy("attach-repo-button").click();
    cy.dataCy("attach-repo-modal")
      .find("button")
      .contains("Attach")
      .parent()
      .click();
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

describe("Renaming the identifier", () => {
  const destination = getGeneralRoute(project);

  before(() => {
    cy.login();
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
    cy.dataCy("save-settings-button").click();
    cy.validateToast("success");
  });

  it("Redirects to a new URL", () => {
    cy.url().should("include", "new-identifier");
  });
});

describe("Duplicating a project with errors", () => {
  const destination = getGeneralRoute(project);

  before(() => {
    cy.login();
    cy.visit(destination);
  });

  it("Shows the copy modal when the button and dropdown menu are clicked", () => {
    cy.dataCy("new-project-button").click();
    cy.dataCy("new-project-menu").should("be.visible");
    cy.dataCy("copy-project-button").click();
    cy.dataCy("copy-project-modal").should("be.visible");
  });

  it("Successfully copies the project and shows a warning toast", () => {
    cy.dataCy("project-name-input").type("copied-project");
    cy.get("button").contains("Duplicate").parent().click();
    cy.validateToast("warning");
  });

  it("Redirects to a new URL", () => {
    cy.url().should("include", "copied-project");
  });
});

describe("A project that has GitHub webhooks disabled", () => {
  const destination = getGithubCommitQueueRoute("logkeeper");

  before(() => {
    cy.login();
    cy.visit(destination);
  });

  it("Disables all interactive elements on the page", () => {
    cy.get("button").should("be.disabled");
    cy.get("input").should("be.disabled");
  });
});

describe("Notifications", () => {
  const destination = getNotificationsRoute("evergreen");
  before(() => {
    cy.login();
    cy.visit(destination);
  });
  it("shouldn't have any subscriptions defined", () => {
    cy.contains("No subscriptions are defined.").should("exist");
  });
  it("shouldn't be able to save anything if no changes were made", () => {
    cy.dataCy("save-settings-button").should("be.disabled");
  });
  it("should be able to add a subscription and save it", () => {
    cy.dataCy("expandable-card").should("not.exist");
    cy.dataCy("add-button").contains("Add Subscription").should("be.visible");
    cy.dataCy("add-button").contains("Add Subscription").click({ force: true });
    cy.dataCy("expandable-card").should("contain.text", "New Subscription");
    selectAntdDropdown("Event", "Any Version Finishes");
    selectAntdDropdown("Notification Method", "Email");
    cy.getInputByLabel("Email").type("mohamed.khelif@mongodb.com");
    cy.dataCy("save-settings-button").scrollIntoView();
    cy.dataCy("save-settings-button").should("not.be.disabled");
    cy.dataCy("save-settings-button").click();
    cy.dataCy("save-settings-button").should("be.disabled");
    cy.dataCy("expandable-card").should("exist");
    cy.dataCy("expandable-card").scrollIntoView();
    cy.dataCy("expandable-card").should(
      "contain.text",
      "Version outcome  - mohamed.khelif@mongodb.com"
    );
    cy.validateToast("success", undefined, true);
  });
  it("should be able to delete a subscription", () => {
    cy.dataCy("expandable-card").should("exist");
    cy.dataCy("expandable-card").scrollIntoView();
    cy.dataCy("delete-item-button").click({ force: true });
    cy.dataCy("expandable-card").should("not.exist");
    cy.dataCy("save-settings-button").scrollIntoView();
    cy.dataCy("save-settings-button").should("not.be.disabled");
    cy.dataCy("save-settings-button").click();
    cy.validateToast("success", undefined, true);
  });
  it("should not be able to combine a jira comment subscription with a task event", () => {
    cy.dataCy("expandable-card").should("not.exist");
    cy.dataCy("add-button").contains("Add Subscription").should("be.visible");
    cy.dataCy("add-button").contains("Add Subscription").click({ force: true });
    cy.dataCy("expandable-card").should("exist").scrollIntoView();
    cy.dataCy("expandable-card").should("contain.text", "New Subscription");
    selectAntdDropdown("Event", "Any Task Finishes");
    selectAntdDropdown("Notification Method", "Comment on a JIRA issue");
    cy.getInputByLabel("JIRA Issue").type("JIRA-123");
    cy.contains(
      "JIRA comment subscription not allowed for tasks in a project"
    ).should("exist");
    cy.dataCy("save-settings-button").scrollIntoView();
    cy.dataCy("save-settings-button").should("be.disabled");
  });
  it("should not be able to save a subscription if an input is invalid", () => {
    selectAntdDropdown("Event", "Any Version Finishes");
    selectAntdDropdown("Notification Method", "Email");
    cy.getInputByLabel("Email").type("Not a real email");
    cy.contains("Value should be a valid email.").should("exist");
    cy.dataCy("save-settings-button").scrollIntoView();
    cy.dataCy("save-settings-button").should("be.disabled");
  });
});

function selectAntdDropdown(label: string, optionText: string) {
  // open select
  cy.getInputByLabel(label).click({ force: true });

  return cy
    .get(".ant-select-dropdown :not(.ant-select-dropdown-hidden)")
    .find(".ant-select-item-option")
    .each((el) => {
      if (el.text() === optionText) {
        cy.wrap(el).click({ force: true });
      }
    });
}
