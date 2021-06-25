import { popconfirmYesClassName } from "../../../utils/popconfirm";

const patchDescriptionCanReconfigure = "test meee";
const patchDescriptionReconfigureDisabled =
  "'evergreen-ci/evergreen' pull request #3186 by bsamek: EVG-7425 Don't send ShouldExit to unprovisioned hosts (https://github.com/evergreen-ci/evergreen/pull/3186)";

const getPatchCardByDescription = (description: string) =>
  cy.dataCy("patch-card").filter(`:contains(${description})`);

describe("Dropdown Menu of Patch Actions", () => {
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    cy.preserveCookies();
    cy.visit("/");
  });

  it("'Reconfigure' link takes user to patch configure page", () => {
    getPatchCardByDescription(patchDescriptionCanReconfigure).within(() => {
      cy.dataCy("patch-card-dropdown").click();
    });
    cy.dataCy("card-dropdown").should("be.visible");
    cy.dataCy("reconfigure-link").should("be.visible");
    cy.dataCy("reconfigure-link").click({ force: true });
    cy.location("pathname").should("include", `/configure`);
  });

  it("Reconfigure link is disabled for patches on commit queue", () => {
    getPatchCardByDescription(patchDescriptionReconfigureDisabled).within(
      () => {
        cy.dataCy("patch-card-dropdown").click();
      }
    );
    cy.dataCy("reconfigure-link").click({ force: true });
    cy.location("pathname").should("eq", `/user/admin/patches`);
  });

  it("'Schedule' link opens popconfirm and schedules patch", () => {
    getPatchCardByDescription(patchDescriptionCanReconfigure).within(() => {
      cy.dataCy("patch-card-dropdown").click();
    });
    cy.dataCy("schedule-patch").click({ force: true });
    cy.get(popconfirmYesClassName).contains("Yes").click({ force: true });
    cy.dataCy("toast").should("exist");
  });

  it("'Unschedule' link opens popconfirm and schedules patch", () => {
    getPatchCardByDescription(patchDescriptionCanReconfigure).within(() => {
      cy.dataCy("patch-card-dropdown").click();
    });
    cy.dataCy("unschedule-patch").click({ force: true });

    cy.dataCy("abort-checkbox").check({ force: true });
    cy.get(popconfirmYesClassName).contains("Yes").click({ force: true });
    cy.dataCy("toast").should("exist");
  });

  it("'Restart' link shows restart patch modal", () => {
    getPatchCardByDescription(patchDescriptionReconfigureDisabled).within(
      () => {
        cy.dataCy("patch-card-dropdown").click();
      }
    );
    cy.dataCy("restart-patch").click({ force: true });

    cy.dataCy("accordion-toggle").first().click();
    cy.dataCy("patch-status-selector-container")
      .children()
      .first()
      .click({ force: true });
    cy.contains("generate-lint").click();
    cy.dataCy("restart-patch-button").click();
    cy.dataCy("toast").should("exist");
  });

  it("'Add to commit queue' shows enqueue modal", () => {
    getPatchCardByDescription(patchDescriptionReconfigureDisabled).within(
      () => {
        cy.dataCy("patch-card-dropdown").click();
      }
    );
    cy.dataCy("enqueue-patch").should("exist");
  });
});
