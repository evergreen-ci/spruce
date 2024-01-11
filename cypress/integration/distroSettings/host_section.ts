import { save } from "./utils";

describe("host section", () => {
  describe("using legacy ssh", () => {
    beforeEach(() => {
      cy.visit("/distro/localhost/settings/host");
    });

    it("shows the correct fields when distro has static provider", () => {
      cy.dataCy("authorized-keys-input").should("exist");
      cy.dataCy("minimum-hosts-input").should("not.exist");
      cy.dataCy("maximum-hosts-input").should("not.exist");
      cy.dataCy("idle-time-input").should("not.exist");
      cy.dataCy("future-fraction-input").should("not.exist");
      cy.dataCy("rounding-rule-select").should("not.exist");
      cy.dataCy("feedback-rule-select").should("not.exist");
    });

    it("shows an error when selecting an incompatible host communication method", () => {
      cy.selectLGOption("Host Communication Method", "RPC");
      cy.contains(
        "Legacy and non-legacy bootstrapping and communication are incompatible."
      );
    });

    it("updates host fields", () => {
      cy.selectLGOption("Agent Architecture", "Linux ARM 64-bit");
      cy.getInputByLabel("Working Directory").clear();
      cy.getInputByLabel("Working Directory").type("/usr/local/bin");
      cy.getInputByLabel("SSH User").clear();
      cy.getInputByLabel("SSH User").type("sudo");
      cy.contains("button", "Add SSH option").click();
      cy.getInputByLabel("SSH Option").type("BatchMode=yes");
      cy.selectLGOption(
        "Host Overallocation Rule",
        "Terminate hosts when overallocated"
      );

      save();
      cy.validateToast("success", "Updated distro.");

      // Reset fields
      cy.selectLGOption("Agent Architecture", "Linux 64-bit");
      cy.getInputByLabel("Working Directory").clear();
      cy.getInputByLabel("Working Directory").type("/home/ubuntu/smoke");
      cy.getInputByLabel("SSH User").clear();
      cy.getInputByLabel("SSH User").type("ubuntu");
      cy.dataCy("delete-item-button").click();
      cy.selectLGOption("Host Overallocation Rule", "Default");

      save();
      cy.validateToast("success", "Updated distro.");
    });

    it("updates mountpoints", () => {
      cy.contains("button", "Add Mountpoint").click();
      cy.getInputByLabel("Mountpoint").type("/data");

      save();
      cy.validateToast("success", "Updated distro.");

      // Reset fields
      cy.dataCy("delete-item-button").click();

      save();
      cy.validateToast("success", "Updated distro.");
    });
  });

  describe("using User Data bootstrap method", () => {
    beforeEach(() => {
      cy.visit("/distro/ubuntu1604-parent/settings/host");
      cy.selectLGOption("Host Bootstrap Method", "User Data");
      cy.selectLGOption("Host Communication Method", "RPC");
    });

    it("shows Windows-only fields when the architecture is updated", () => {
      cy.contains("label", "Root Directory").should("not.exist");
      cy.contains("label", "Service User").should("not.exist");

      cy.selectLGOption("Agent Architecture", "Windows 64-bit");

      cy.getInputByLabel("Root Directory").should("exist");
      cy.getInputByLabel("Service User").should("exist");
    });

    it("hides resource limit fields when the architecture is not Linux", () => {
      cy.contains("Resource Limits").should("exist");
      cy.selectLGOption("Agent Architecture", "Windows 64-bit");
      cy.contains("Resource Limits").should("not.exist");
    });

    it("saves bootstrap settings", () => {
      cy.getInputByLabel("Jasper Binary Directory").type("/jasper/binary");
      cy.getInputByLabel("Jasper Credentials Path").type("/jasper/credentials");
      cy.getInputByLabel("Client Directory").type("/client/dir");
      cy.getInputByLabel("Shell Path").type("/shell/path");
      cy.getInputByLabel("Home Volume Format Command").type(
        "echo 'Hello World'"
      );
      cy.getInputByLabel("Number of Files").type("10");
      cy.getInputByLabel("Number of CGroup Tasks").type("20");
      cy.getInputByLabel("Number of Processes").type("30");
      cy.getInputByLabel("Locked Memory").type("128");
      cy.getInputByLabel("Virtual Memory").type("256");

      cy.contains("button", "Add variable").click();
      cy.getInputByLabel("Key").type("my-key");
      cy.getInputByLabel("Value").type("my-value");

      cy.contains("button", "Add script").click();
      cy.getInputByLabel(/^Path$/).type("/path/to/precondition/script");
      cy.getInputByLabel(/^Script$/).type("script contents here");

      cy.dataCy("save-settings-button").scrollIntoView();
      save();
      cy.validateToast("success");
    });
  });
});
