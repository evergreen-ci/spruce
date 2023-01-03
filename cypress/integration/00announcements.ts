describe("Announcement overlays", () => {
  beforeEach(() => {
    cy.clearCookie("This is an important notification");
    cy.visit("/");
  });

  it("Displays a welcome modal only when you first visit spruce", () => {
    cy.dataCy("welcome-modal").should("exist");
    cy.dataCy("close-welcome-modal").click();
    cy.visit("/");
    cy.dataCy("welcome-modal").should("not.exist");
  });

  it("Should not show a Sitewide banner after it has been dismissed", () => {
    cy.dataCy("sitewide-banner-success").should("exist");
    cy.closeBanner("sitewide-banner-success");
    cy.dataCy("sitewide-banner-success").should("not.exist");
    cy.visit("/");
    cy.dataCy("sitewide-banner-success").should("not.exist");
  });

  it("Should close the announcement toast if one exists", () => {
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
});
