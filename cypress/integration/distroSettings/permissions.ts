describe("distro permissions", () => {
  beforeEach(() => {
    cy.logout();
    cy.login({ isAdmin: false });
  });

  it("hides the new distro button when a user cannot create distros", () => {
    cy.visit("/distro/rhel71-power8-large/settings/general");
    cy.dataCy("new-distro-button").should("not.exist");
  });

  it("disables the delete button when user lacks admin permissions", () => {
    cy.visit("/distro/rhel71-power8-large/settings/general");
    cy.dataCy("delete-distro-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );
  });

  it("disables fields when user lacks edit permissions", () => {
    cy.visit("/distro/rhel71-power8-large/settings/general");
    cy.dataCy("distro-settings-page").within(() => {
      cy.get('input[type="checkbox"]').should(
        "have.attr",
        "aria-disabled",
        "true",
      );
      cy.get("textarea").should("be.disabled");
    });
  });

  it("enables fields if user has edit permissions for a particular distro", () => {
    cy.visit("/distro/localhost/settings/general");
    cy.dataCy("distro-settings-page").within(() => {
      cy.get('input[type="checkbox"]').should(
        "have.attr",
        "aria-disabled",
        "false",
      );
      cy.get("textarea").should("not.be.disabled");
    });
  });
});
