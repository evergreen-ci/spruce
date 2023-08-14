import { clickSave } from "./utils";

describe("project section", () => {
  beforeEach(() => {
    cy.visit("/distro/localhost/settings/project");
  });

  it("can update fields and those changes will persist", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true"
    );

    // Update fields.
    cy.dataCy("clone-method-select").contains("Legacy SSH");
    cy.dataCy("clone-method-select").click();
    cy.contains("OAuth").click();
    cy.contains("button", "Add expansion").click();
    cy.getInputByLabel("Key").type("key-name");
    cy.getInputByLabel("Value").type("my-value");
    cy.contains("button", "Add project").click();
    cy.getInputByLabel("Project Name").type("spruce");

    clickSave();
    cy.validateToast("success");

    // Changes should persist.
    cy.reload();
    cy.dataCy("clone-method-select").contains("OAuth");
    cy.getInputByLabel("Key").should("have.value", "key-name");
    cy.getInputByLabel("Value").should("have.value", "my-value");
    cy.getInputByLabel("Project Name").should("have.value", "spruce");

    // Undo changes.
    cy.dataCy("clone-method-select").click();
    cy.contains("Legacy SSH").click();
    cy.dataCy("delete-item-button").first().click();
    cy.dataCy("delete-item-button").first().click();
    clickSave();
    cy.validateToast("success");
  });
});
