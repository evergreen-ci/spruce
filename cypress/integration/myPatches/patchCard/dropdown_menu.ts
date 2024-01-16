import { INCLUDE_HIDDEN_PATCHES } from "constants/cookies";

const patchWithoutVersion = "test meee";
const patchWithVersion = "main: EVG-7823 add a commit queue message (#4048)";
const patchWithVersionOnCommitQueue =
  "'evergreen-ci/evergreen' pull request #3186 by bsamek: EVG-7425 Don't send ShouldExit to unprovisioned hosts (https://github.com/evergreen-ci/evergreen/pull/3186)";

const getPatchCardByDescription = (description: string) =>
  cy.dataCy("patch-card").filter(`:contains(${description})`);

describe("Dropdown Menu of Patch Actions", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.getInputByLabel("Include Commit Queue").check({ force: true });
  });

  it("'Reconfigure' link takes user to patch configure page", () => {
    getPatchCardByDescription(patchWithoutVersion).within(() => {
      cy.dataCy("patch-card-dropdown").click();
    });
    cy.dataCy("card-dropdown").should("be.visible");
    cy.dataCy("reconfigure-link").should("be.visible");
    cy.dataCy("reconfigure-link").click({ force: true });
    cy.location("pathname").should("include", `/configure`);
  });

  it("'Reconfigure' link is disabled for patches on commit queue", () => {
    getPatchCardByDescription(patchWithVersionOnCommitQueue).within(() => {
      cy.dataCy("patch-card-dropdown").click();
    });
    cy.dataCy("reconfigure-link").should("be.disabled");
  });

  it("'Schedule' link opens modal and clicking on 'Cancel' closes it.", () => {
    getPatchCardByDescription(patchWithVersion).within(() => {
      cy.dataCy("patch-card-dropdown").click();
    });
    cy.dataCy("schedule-patch").click();
    cy.dataCy("schedule-tasks-modal").should("be.visible");
    cy.contains("Cancel").click();
    cy.dataCy("schedule-tasks-modal").should("not.exist");
  });

  it("'Schedule' link is disabled for unfinalized patch", () => {
    getPatchCardByDescription(patchWithoutVersion).within(() => {
      cy.dataCy("patch-card-dropdown").click();
    });
    cy.dataCy("schedule-patch").should("be.disabled");
  });

  // We shouldn't actually unschedule patchWithVersion because patchWithVersionOnCommitQueue is a downstream project
  // and other integration tests will be affected.
  it("'Unschedule' link opens popconfirm and unschedules patch", () => {
    getPatchCardByDescription(patchWithVersion).within(() => {
      cy.dataCy("patch-card-dropdown").click();
    });
    cy.dataCy("unschedule-patch").click({ force: true });
    cy.dataCy("unschedule-patch-popconfirm").should("be.visible");
    cy.contains("button", "Cancel").click();
    cy.dataCy("unschedule-patch-popconfirm").should("not.exist");
  });

  it("'Unschedule' link is disabled for unfinalized patch", () => {
    getPatchCardByDescription(patchWithoutVersion).within(() => {
      cy.dataCy("patch-card-dropdown").click();
    });
    cy.dataCy("unschedule-patch").should("be.disabled");
  });

  // This will generate a 'Will Run' status that is used in version/task_filters.ts
  it("'Restart' link shows restart patch modal", () => {
    getPatchCardByDescription(patchWithVersionOnCommitQueue).within(() => {
      cy.dataCy("patch-card-dropdown").click();
    });
    cy.dataCy("restart-version").click({ force: true });

    cy.dataCy("variant-accordion").first().click();
    cy.dataCy("task-status-checkbox").should("exist");
    cy.contains("generate-lint").click();
    cy.dataCy("version-restart-modal").within(() => {
      cy.contains("Restart").click();
    });
    cy.validateToast("success");
  });

  it("'Restart' link is disabled for unfinalized patch", () => {
    getPatchCardByDescription(patchWithoutVersion).within(() => {
      cy.dataCy("patch-card-dropdown").click();
    });
    cy.dataCy("restart-version").should("be.disabled");
  });

  it("'Add to commit queue' shows enqueue modal", () => {
    getPatchCardByDescription(patchWithVersionOnCommitQueue).within(() => {
      cy.dataCy("patch-card-dropdown").click();
    });
    cy.dataCy("enqueue-patch").should("exist");
  });

  it("'Add to commit queue' is disabled for unfinalized patch", () => {
    getPatchCardByDescription(patchWithoutVersion).within(() => {
      cy.dataCy("patch-card-dropdown").click();
    });
    cy.dataCy("enqueue-patch").should("be.disabled");
  });

  it("Toggle patch visibility", () => {
    // "Include hidden" checkbox is not checked and patch is visible
    cy.getInputByLabel("Include hidden").should("not.be.checked");
    cy.location("search").should("not.contain", "hidden=true");
    getPatchCardByDescription("testtest")
      .as("targetPatchCard")
      .should("be.visible");
    // Hide patch card
    cy.get("@targetPatchCard").within(() => {
      cy.dataCy("hidden-badge").should("not.exist");
      cy.dataCy("patch-card-dropdown").click();
    });
    cy.contains("Hide patch").should("be.visible").click();
    cy.validateToast("success", "This patch was successfully hidden.");
    cy.get("@targetPatchCard").should("not.exist");
    // Check "Include hidden" checkbox and unhide patch card
    cy.dataCy("include-hidden-checkbox").check({ force: true });
    cy.getCookie(INCLUDE_HIDDEN_PATCHES).should(
      "have.property",
      "value",
      "true",
    );
    cy.location("search").should("contain", "hidden=true");
    cy.get("@targetPatchCard")
      .should("be.visible")
      .within(() => {
        cy.dataCy("hidden-badge").should("be.visible");
        cy.dataCy("patch-card-dropdown").click();
      });
    // Test initial state derived from cookie
    cy.visit("/");
    cy.getCookie(INCLUDE_HIDDEN_PATCHES).should(
      "have.property",
      "value",
      "true",
    );
    cy.location("search").should("not.contain", "hidden=true");
    cy.get("@targetPatchCard")
      .should("be.visible")
      .within(() => {
        cy.dataCy("hidden-badge").should("be.visible");
        cy.dataCy("patch-card-dropdown").click();
      });
    // Test unhide button
    cy.contains("Unhide patch").should("be.visible").click();
    cy.validateToast("success", "This patch was successfully unhidden.");
    cy.get("@targetPatchCard")
      .should("be.visible")
      .within(() => {
        cy.dataCy("hidden-badge").should("not.exist");
      });
    // Uncheck "Include hidden" and verify patch card is visible
    cy.dataCy("include-hidden-checkbox").uncheck({ force: true });
    cy.getCookie(INCLUDE_HIDDEN_PATCHES).should(
      "have.property",
      "value",
      "false",
    );
    cy.location("search").should("contain", "hidden=false");
    cy.get("@targetPatchCard").should("be.visible");
  });
});
