describe("with various permission levels", () => {
  it("hides the new distro button when a user cannot create distros", () => {
    const userData = {
      data: {
        user: {
          userId: "admin",
          permissions: {
            canCreateDistro: false,
            distroPermissions: {
              admin: true,
              edit: true,
            },
          },
        },
      },
    };
    cy.overwriteGQL("UserDistroSettingsPermissions", userData);
    cy.visit("/distro/rhel71-power8-large/settings/general");
    cy.dataCy("new-distro-button").should("not.exist");
    cy.dataCy("delete-distro-button").should(
      "not.have.attr",
      "aria-disabled",
      "true",
    );
    cy.get("textarea").should("not.be.disabled");
  });

  it("disables the delete button when user lacks admin permissions", () => {
    const userData = {
      data: {
        user: {
          userId: "admin",
          permissions: {
            canCreateDistro: false,
            distroPermissions: {
              admin: false,
              edit: true,
            },
          },
        },
      },
    };
    cy.overwriteGQL("UserDistroSettingsPermissions", userData);
    cy.visit("/distro/rhel71-power8-large/settings/general");
    cy.dataCy("new-distro-button").should("not.exist");
    cy.dataCy("delete-distro-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );
    cy.get("textarea").should("not.be.disabled");
  });

  it("disables fields when user lacks edit permissions", () => {
    const userData = {
      data: {
        user: {
          userId: "admin",
          permissions: {
            canCreateDistro: false,
            distroPermissions: {
              admin: false,
              edit: false,
            },
          },
        },
      },
    };
    cy.overwriteGQL("UserDistroSettingsPermissions", userData);
    cy.visit("/distro/rhel71-power8-large/settings/general");
    cy.dataCy("new-distro-button").should("not.exist");
    cy.dataCy("delete-distro-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );
    cy.dataCy("distro-settings-page").within(() => {
      cy.get("input").should("be.disabled");
      cy.get("textarea").should("be.disabled");
      cy.get("button").should("have.attr", "aria-disabled", "true");
    });
  });
});
