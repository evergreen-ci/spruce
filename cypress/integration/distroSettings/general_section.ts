import { save } from "./utils";

describe("general section", () => {
  beforeEach(() => {
    cy.visit("/distro/localhost/settings/general");
  });

  it("can update fields and those changes will persist", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Update fields.
    cy.contains("button", "Add alias").click();
    cy.getInputByLabel("Alias").type("localhost-alias");
    cy.getInputByLabel("Notes").type("this is a note");
    cy.getInputByLabel("Disable shallow clone for this distro").check({
      force: true,
    });
    save();
    cy.validateToast("success");

    // Changes should persist.
    cy.reload();
    cy.getInputByLabel("Alias").should("have.value", "localhost-alias");
    cy.getInputByLabel("Notes").should("have.value", "this is a note");
    cy.getInputByLabel("Disable shallow clone for this distro").should(
      "be.checked",
    );

    // Undo changes.
    cy.dataCy("delete-item-button").click();
    cy.getInputByLabel("Notes").clear();
    cy.getInputByLabel("Disable shallow clone for this distro").uncheck({
      force: true,
    });
    save();
    cy.validateToast("success");
  });

  describe("container pool distro", () => {
    beforeEach(() => {
      cy.visit("/distro/ubuntu1604-parent/settings/general");
    });

    it("warns users that the distro will not be spawned for tasks", () => {
      cy.contains(
        "Distro is a container pool, so it cannot be spawned for tasks.",
      ).should("be.visible");
    });
  });
});
