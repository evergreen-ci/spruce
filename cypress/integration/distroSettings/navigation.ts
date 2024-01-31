describe("using the distro dropdown", () => {
  beforeEach(() => {
    cy.visit("/distro/localhost/settings");
  });

  it("navigates to distro when clicked", () => {
    cy.dataCy("distro-select").should("be.visible").click();
    cy.contains("Admin-only").should("exist");
    cy.get(".distro-select-options").within(() => {
      cy.get("li").last().contains("localhost2");
      cy.contains("rhel71-power8-large").click();
    });
    cy.location("pathname").should("not.contain", "localhost");
    cy.location("pathname").should("contain", "rhel71-power8-large");
  });

  describe("warning modal", () => {
    it("warns when navigating away from distro settings with unsaved changes and allows returning to distro settings", () => {
      cy.getInputByLabel("Notes").type("my note");
      cy.dataCy("save-settings-button").should(
        "not.have.attr",
        "aria-disabled",
        "true",
      );
      cy.dataCy("project-health-link").click();
      cy.dataCy("navigation-warning-modal").should("be.visible");
      cy.contains("button", "Cancel").click();
      cy.dataCy("navigation-warning-modal").should("not.exist");
      cy.location("pathname").should(
        "eq",
        "/distro/localhost/settings/general",
      );
    });

    describe("modifying the distro provider", () => {
      beforeEach(() => {
        cy.visit("/distro/ubuntu1604-container-test/settings/provider");
      });

      it("warns when navigating to another distro settings tab after the provider has changed and allows save", () => {
        cy.selectLGOption("Provider", "Static");
        cy.dataCy("save-settings-button").should(
          "not.have.attr",
          "aria-disabled",
          "true",
        );
        cy.contains("a", "Task Settings").click();
        cy.dataCy("save-modal").should("be.visible");
        cy.dataCy("provider-warning-banner").should("be.visible");
      });

      it("shows the standard save warning modal when non-provider fields have changed", () => {
        cy.getInputByLabel("User Data").type("test user data");
        cy.dataCy("save-settings-button").should(
          "not.have.attr",
          "aria-disabled",
          "true",
        );
        cy.dataCy("project-health-link").click();
        cy.dataCy("navigation-warning-modal").should("be.visible");
        cy.dataCy("provider-warning-banner").should("not.exist");
      });
    });
  });
});

describe("/distros redirect route", () => {
  it("should redirect to the first distro available", () => {
    cy.visit("/distros");
    cy.location("pathname").should("not.contain", "/distros");
    cy.location("pathname").should("eq", "/distro/localhost/settings/general");
  });
});
