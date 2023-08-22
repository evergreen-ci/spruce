import {
  CY_DISABLE_NEW_USER_WELCOME_MODAL,
  CY_DISABLE_COMMITS_WELCOME_MODAL,
} from "constants/cookies";

describe("Announcement overlays", () => {
  beforeEach(() => {
    cy.clearCookie(CY_DISABLE_NEW_USER_WELCOME_MODAL);
    cy.clearCookie(CY_DISABLE_COMMITS_WELCOME_MODAL);
    cy.clearCookie("This is an important notification");
  });

  it("Displays a welcome modal only when you first visit spruce", () => {
    cy.visit("/");
    cy.dataCy("welcome-modal").should("exist");
    cy.dataCy("close-welcome-modal").click();
    cy.visit("/");
    cy.dataCy("welcome-modal").should("not.exist");
  });

  it("Should not show a Sitewide banner after it has been dismissed", () => {
    cy.visit("/");
    cy.dataCy("sitewide-banner-success").should("exist");
    cy.closeBanner("sitewide-banner-success");
    cy.dataCy("sitewide-banner-success").should("not.exist");
    cy.visit("/");
    cy.dataCy("sitewide-banner-success").should("not.exist");
  });

  it("Should close the announcement toast if one exists", () => {
    cy.visit("/");
    cy.get("body").then(($body) => {
      if ($body.find("div[data-cy=toast]").length > 0) {
        cy.dataCy("toast").should("exist");
        cy.visit("/");
        cy.dataCy("toast").find("button").click();
        cy.visit("/");
        cy.dataCy("toast").should("not.exist");
      }
    });
  });

  it("visiting the commits page for the first time should show a welcome modal", () => {
    cy.visit("/commits/spruce");
    cy.dataCy("welcome-modal").should("be.visible");
    cy.dataCy("close-welcome-modal").click();
    cy.reload();
    cy.dataCy("welcome-modal").should("not.exist");
  });
});
