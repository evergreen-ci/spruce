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

    it("shows pool mapping information based on container pool id", () => {
      cy.getInputByLabel("Container Pool ID").should(
        "contain.text",
        "test-pool-1"
      );
      cy.getInputByLabel("Pool Mapping Information")
        .should("have.attr", "placeholder")
        .and("match", /test-pool-1/);
      cy.selectLGOption("Container Pool ID", "test-pool-2");
      cy.getInputByLabel("Pool Mapping Information")
        .should("have.attr", "placeholder")
        .and("match", /test-pool-2/);
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

  describe("ec2 fleet", () => {
    beforeEach(() => {
      cy.visit("/distro/ubuntu1804-workstation/settings/provider");
    });

    it("shows and hides fields correctly", () => {
      // Fleet options.
      cy.getInputByLabel("Fleet Instance Type").contains("On-demand");
      cy.contains("Capacity optimization").should("not.exist");

      cy.selectLGOption("Fleet Instance Type", "Spot");
      cy.contains("Capacity optimization").should("be.visible");

      // VPC options.
      cy.dataCy("use-vpc").scrollIntoView();
      cy.dataCy("use-vpc").should("be.checked");
      cy.contains("Default VPC Subnet ID").should("be.visible");
      cy.contains("VPC Subnet Prefix").should("be.visible");

      cy.dataCy("use-vpc").uncheck({ force: true });
      cy.contains("Default VPC Subnet ID").should("not.exist");
      cy.contains("VPC Subnet Prefix").should("not.exist");
    });

    it("successfully updates ec2 fleet provider fields", () => {
      cy.dataCy("provider-select").contains("EC2 Fleet");

      // Correct section is displayed.
      cy.dataCy("ec2-fleet-provider-settings").should("be.visible");
      cy.dataCy("region-select").contains("us-east-1");

      // Change field values.
      cy.selectLGOption("Region", "us-west-1");
      cy.getInputByLabel("SSH Key Name").as("keyNameInput");
      cy.get("@keyNameInput").clear();
      cy.get("@keyNameInput").type("my ssh key");
      cy.selectLGOption("Fleet Instance Type", "Spot");
      cy.contains("button", "Add mount point").click();
      cy.getInputByLabel("Device Name").type("device name");
      cy.getInputByLabel("Size").type("200");
      save();
      cy.validateToast("success");

      // Revert fields to original values.
      cy.selectLGOption("Region", "us-east-1");
      cy.get("@keyNameInput").clear();
      cy.get("@keyNameInput").type("mci");
      cy.selectLGOption("Fleet Instance Type", "On-demand");
      cy.dataCy("mount-points").within(() => {
        cy.dataCy("delete-item-button").click();
      });
      save();
      cy.validateToast("success");
    });

    it("can add and delete region settings", () => {
      cy.dataCy("ec2-fleet-provider-settings").should("be.visible");

      // Add item for new region.
      cy.contains("button", "Add region settings").click();
      cy.contains("button", "Add region settings").should("not.exist");

      // Save new region.
      cy.selectLGOption("Region", "us-west-1");
      cy.getInputByLabel("EC2 AMI ID").type("ami-1234");
      cy.getInputByLabel("Instance Type").type("m5.xlarge");
      cy.contains("button", "Add security group").click();
      cy.getInputByLabel("Security Group ID").type("security-group-1234");
      save();
      cy.validateToast("success");

      // Revert to original state by deleting the new region.
      cy.dataCy("delete-item-button").first().click();
      save();
      cy.validateToast("success");

      cy.contains("button", "Add region settings").should("be.visible");
    });
  });
});
