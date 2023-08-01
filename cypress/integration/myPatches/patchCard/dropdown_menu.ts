const patchWithoutVersion = "test meee";
const patchWithVersion = "main: EVG-7823 add a commit queue message (#4048)";
const patchWithVersionOnCommitQueue =
  "'evergreen-ci/evergreen' pull request #3186 by bsamek: EVG-7425 Don't send ShouldExit to unprovisioned hosts (https://github.com/evergreen-ci/evergreen/pull/3186)";

const getPatchCardByDescription = (description: string) =>
  cy.dataCy("patch-card").filter(`:contains(${description})`);

describe("Dropdown Menu of Patch Actions", { testIsolation: false }, () => {
  beforeEach(() => {
    cy.visit("/");
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
  it("hiding a patch should remove it from the page", () => {
    cy.dataCy("patch-card").should("exist");
    cy.dataCy("patch-card").contains("testtest").should("exist");
    cy.dataCy("patch-card").eq(6).should("contain.text", "testtest");
    getPatchCardByDescription("testtest").within(() => {
      cy.dataCy("patch-card-dropdown").click();
    });
    cy.contains("Hide patch").should("exist");
    cy.contains("Hide patch").click();
    cy.contains("button", "Yes").click({ force: true });
    cy.validateToast("success");
    cy.dataCy("patch-card").contains("testtest").should("not.exist");
  });
});
