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
      cy.getInputByLabel("Security Group ID").type("sg-1234");
      cy.contains("button", "Add host").click();
      cy.getInputByLabel("Name").type("host-1234");
      save();
      cy.validateToast("success", "Updated distro.");

      // Revert fields to original values.
      cy.getInputByLabel("User Data").clear();
      cy.getInputByLabel("Merge with existing user data").uncheck({
        force: true,
      });
      cy.dataCy("delete-item-button").first().click();
      cy.dataCy("delete-item-button").first().click();
      save();
      cy.validateToast("success", "Updated distro.");
    });
  });

  describe("docker", () => {
    beforeEach(() => {
      cy.visit("/distro/ubuntu1604-container-test/settings/provider");
    });

    it("shows pool mapping information based on container pool id", () => {
      cy.getInputByLabel("Container Pool ID").should(
        "contain.text",
        "test-pool-1",
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
      cy.validateToast("success", "Updated distro.");

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
      cy.validateToast("success", "Updated distro.");
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
      cy.contains("Capacity optimization").should("exist");

      // VPC options.
      cy.dataCy("use-vpc").should("be.checked");
      cy.contains("Default VPC Subnet ID").should("exist");
      cy.contains("VPC Subnet Prefix").should("exist");

      cy.dataCy("use-vpc").uncheck({ force: true });
      cy.contains("Default VPC Subnet ID").should("not.exist");
      cy.contains("VPC Subnet Prefix").should("not.exist");
    });

    it("successfully updates ec2 fleet provider fields", () => {
      cy.openExpandableCard("us-east-1");
      cy.dataCy("provider-select").contains("EC2 Fleet");

      // Correct section is displayed.
      cy.dataCy("ec2-fleet-provider-settings").should("be.visible");
      cy.dataCy("region-select").contains("us-east-1").should("be.visible");

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
      cy.validateToast("success", "Updated distro.");

      // Revert fields to original values.
      cy.selectLGOption("Region", "us-east-1");
      cy.get("@keyNameInput").clear();
      cy.get("@keyNameInput").type("mci");
      cy.selectLGOption("Fleet Instance Type", "On-demand");
      cy.dataCy("mount-points").within(() => {
        cy.dataCy("delete-item-button").click();
      });
      save();
      cy.validateToast("success", "Updated distro.");
    });

    it("can add and delete region settings", () => {
      cy.openExpandableCard("us-east-1");
      cy.dataCy("ec2-fleet-provider-settings").should("exist");

      // Add item for new region.
      cy.contains("button", "Add region settings").click();
      cy.contains("button", "Add region settings").should("not.exist");
      cy.openExpandableCard("New AWS Region");

      // Save new region.
      cy.selectLGOption("Region", "us-west-1");
      cy.getInputByLabel("EC2 AMI ID").type("ami-1234");
      cy.getInputByLabel("Instance Type").type("m5.xlarge");
      cy.contains("button", "Add security group").click();
      cy.getInputByLabel("Security Group ID").type("sg-5678");
      save();
      cy.validateToast("success", "Updated distro.");

      // Revert to original state by deleting the new region.
      cy.dataCy("delete-item-button").first().click();
      save();
      cy.validateToast("success", "Updated distro.");

      cy.contains("button", "Add region settings").should("exist");
    });
  });

  describe("ec2 on-demand", () => {
    beforeEach(() => {
      cy.visit("/distro/ubuntu1604-parent/settings/provider");
    });

    it("shows and hides fields correctly", () => {
      // VPC options.
      cy.dataCy("use-vpc").should("be.checked");
      cy.contains("Default VPC Subnet ID").should("exist");
      cy.contains("VPC Subnet Prefix").should("exist");

      cy.dataCy("use-vpc").uncheck({ force: true });
      cy.contains("Default VPC Subnet ID").should("not.exist");
      cy.contains("VPC Subnet Prefix").should("not.exist");
    });
    it("successfully updates ec2 on-demand provider fields", () => {
      cy.openExpandableCard("us-east-1");
      cy.dataCy("provider-select").contains("EC2 On-Demand");
      // Correct section is displayed.
      cy.dataCy("ec2-on-demand-provider-settings").should("exist");
      cy.dataCy("region-select").contains("us-east-1");

      // Change field values.
      cy.selectLGOption("Region", "us-west-1");
      cy.getInputByLabel("EC2 AMI ID").as("amiInput");
      cy.get("@amiInput").clear();
      cy.get("@amiInput").type("ami-1234560");
      cy.getInputByLabel("SSH Key Name").as("keyNameInput");
      cy.get("@keyNameInput").clear();
      cy.get("@keyNameInput").type("my ssh key");
      cy.getInputByLabel("User Data").type("<powershell></powershell>");
      cy.getInputByLabel("Merge with existing user data").check({
        force: true,
      });
      save();
      cy.validateToast("success", "Updated distro.");

      // Revert fields to original values.
      cy.selectLGOption("Region", "us-east-1");
      cy.get("@amiInput").clear();
      cy.get("@amiInput").type("ami-0000");
      cy.get("@keyNameInput").clear();
      cy.get("@keyNameInput").type("mci");
      cy.getInputByLabel("User Data").clear();
      cy.getInputByLabel("Merge with existing user data").uncheck({
        force: true,
      });
      save();
      cy.validateToast("success", "Updated distro.");
    });

    it("can add and delete region settings", () => {
      cy.dataCy("ec2-on-demand-provider-settings").should("exist");

      // Add item for new region.
      cy.contains("button", "Add region settings").click();
      cy.contains("button", "Add region settings").should("not.exist");
      cy.openExpandableCard("New AWS Region");

      // Save new region.
      cy.selectLGOption("Region", "us-west-1");
      cy.getInputByLabel("EC2 AMI ID").type("ami-1234");
      cy.getInputByLabel("Instance Type").type("m5.xlarge");
      cy.contains("button", "Add security group").click();
      cy.getInputByLabel("Security Group ID").type("sg-0000");
      save();
      cy.validateToast("success", "Updated distro.");

      // Revert to original state by deleting the new region.
      cy.dataCy("delete-item-button").first().click();
      save();
      cy.validateToast("success", "Updated distro.");

      cy.contains("button", "Add region settings").should("exist");
    });
  });
});
