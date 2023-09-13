import { save } from "./utils";

describe("provider section", () => {
  describe("static", () => {
    beforeEach(() => {
      cy.visit("/distro/localhost/settings/provider");
    });

    it("successfully updates static provider fields", () => {
      cy.dataCy("provider-select").contains("Static IP/VM");

      // Correct section is displayed.
      cy.dataCy("static-provider-settings").should("exist");

      // Change field values.
      cy.getInputByLabel("User Data").type("my user data");
      cy.getInputByLabel("Merge with existing user data").check({
        force: true,
      });
      cy.contains("button", "Add security group").click();
      cy.getInputByLabel("Security Group ID").type("group-1234");
      save();
      cy.validateToast("success");

      // Revert fields to original values.
      cy.getInputByLabel("User Data").clear();
      cy.getInputByLabel("Merge with existing user data").uncheck({
        force: true,
      });
      cy.dataCy("delete-item-button").click();
      save();
      cy.validateToast("success");
    });
  });

  describe("docker", () => {
    beforeEach(() => {
      cy.visit("/distro/ubuntu1604-container-test/settings/provider");
    });

    it("successfully updates docker provider fields", () => {
      cy.dataCy("provider-select").contains("Docker");

      // Correct section is displayed.
      cy.dataCy("docker-provider-settings").should("exist");

      // Change field values.
      cy.selectLGOption("Image Build Method", "Pull");
      cy.selectLGOption("Container Pool ID", "test-pool-2");
      cy.getInputByLabel("Username for Registries").type("username");
      cy.getInputByLabel("Password for Registries").type("password");
      cy.getInputByLabel("User Data").type("my user data");
      cy.getInputByLabel("Merge with existing user data").check({
        force: true,
      });
      save();
      cy.validateToast("success");

      // Revert fields to original values.
      cy.selectLGOption("Image Build Method", "Import");
      cy.selectLGOption("Container Pool ID", "test-pool-1");
      cy.getInputByLabel("Username for Registries").clear();
      cy.getInputByLabel("Password for Registries").clear();
      cy.getInputByLabel("User Data").clear();
      cy.getInputByLabel("Merge with existing user data").uncheck({
        force: true,
      });
      save();
      cy.validateToast("success");
    });
  });
});
