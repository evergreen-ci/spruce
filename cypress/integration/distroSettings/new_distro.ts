const distroSettingPage = "/distro/rhel71-power8-large/settings/general";

// TODO EVG-19943: Add delete operation and enable test isolation.
describe("Creating a new distro", { testIsolation: false }, () => {
  beforeEach(() => {
    cy.visit(distroSettingPage);
  });

  it("Allows a user to create a new distro", () => {
    const newDistroId = "new-distro";

    cy.dataCy("new-distro-button").click();
    cy.dataCy("new-distro-menu").should("be.visible");
    cy.dataCy("create-distro-button").click();
    cy.dataCy("create-distro-modal").should("be.visible");
    cy.dataCy("distro-id-input").type(newDistroId);
    cy.contains("button", "Create").click();
    cy.validateToast("success");
    cy.location("pathname").should(
      "eq",
      `/distro/${newDistroId}/settings/general`
    );

    // TODO: Add delete operation here.
  });
});

// TODO EVG-19943: Add delete operation and enable test isolation.
describe("Copying a distro", { testIsolation: false }, () => {
  beforeEach(() => {
    cy.visit(distroSettingPage);
  });

  it("Allows a user to copy an existing distro", () => {
    const copyDistroId = "copy-distro";

    cy.dataCy("new-distro-button").click();
    cy.dataCy("new-distro-menu").should("be.visible");
    cy.dataCy("copy-distro-button").click();
    cy.dataCy("copy-distro-modal").should("be.visible");
    cy.dataCy("distro-id-input").type(copyDistroId);
    cy.contains("button", "Duplicate").click();
    cy.validateToast("success");
    cy.location("pathname").should(
      "eq",
      `/distro/${copyDistroId}/settings/general`
    );

    // TODO: Add delete operation here.
  });
});
