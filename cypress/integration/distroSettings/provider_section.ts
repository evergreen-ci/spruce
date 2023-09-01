import { save } from "./utils";

describe("provider section", () => {
  describe("static", () => {
    beforeEach(() => {
      cy.visit("/distro/localhost/settings/provider");
    });

    it("successfully updates static provider fields", () => {
      cy.dataCy("provider-select").contains("Static IP/VM");

      // Correct fields are displayed
      cy.dataCy("provider-settings").within(() => {
        cy.get("button").should("have.length", 1);
        cy.get("textarea").should("have.length", 1);
        cy.get("input[type=checkbox]").should("have.length", 1);
        cy.get("input[type=text]").should("have.length", 0);
      });

      cy.getInputByLabel("User Data").type("my user data");
      cy.getInputByLabel("Merge with existing user data").check({
        force: true,
      });
      cy.contains("button", "Add security group").click();
      cy.getInputByLabel("Security Group ID").type("group-1234");

      save();
      cy.validateToast("success");

      cy.getInputByLabel("User Data").clear();
      cy.getInputByLabel("Merge with existing user data").uncheck({
        force: true,
      });
      cy.dataCy("delete-item-button").click();

      save();
      cy.validateToast("success");
    });
  });

  describe.only("docker", () => {
    beforeEach(() => {
      cy.visit("/distro/ubuntu1604-container-test/settings/provider");
    });

    it("successfully updates docker provider fields", () => {
      cy.dataCy("provider-select").contains("Docker");

      // Correct fields are displayed
      cy.dataCy("provider-settings").within(() => {
        cy.getInputByLabel("Docker Image URL").should("exist");
        cy.getInputByLabel("Image Build Method").should("exist");
        cy.getInputByLabel("Username for Registries").should("exist");
        cy.getInputByLabel("Password for Registries").should("exist");
        cy.getInputByLabel("Container Pool ID").should("exist");
        cy.getInputByLabel("Pool Mapping Information").should("exist");
        cy.getInputByLabel("User Data").should("exist");
        cy.getInputByLabel("Merge with existing user data").should("exist");
        cy.contains("button", "Add security group").should("exist");
      });

      // Change field values.
      cy.selectLGOption("Image Build Method", "Pull");
      cy.selectLGOption("Container Pool ID", /^test-pool$/);
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
      cy.selectLGOption("Container Pool ID", "ubuntu-test-pool");
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
