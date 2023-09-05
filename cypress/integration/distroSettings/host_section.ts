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
    });

    it("errors when selecting an incompatible host communication method", () => {
      cy.selectLGOption("Host Communication Method", "RPC");
      save();
      cy.validateToast(
        "error",
        "validating changes for distro 'localhost': 'ERROR: bootstrapping hosts using legacy SSH is incompatible with non-legacy host communication'"
      );
      cy.selectLGOption("Host Communication Method", "Legacy SSH");
    });

    it("updates host fields", () => {
      cy.selectLGOption("Agent Architecture", "Linux ARM 64-bit");
      cy.getInputByLabel("Working Directory").clear();
      cy.getInputByLabel("Working Directory").type("/usr/local/bin");
      cy.getInputByLabel("SSH User").clear();
      cy.getInputByLabel("SSH User").type("sudo");
      cy.contains("button", "Add SSH option").click();
      cy.getInputByLabel("SSH Option").type("BatchMode=yes");
      cy.selectLGOption("Host Allocator Rounding Rule", "Round down");
      cy.selectLGOption("Host Allocator Feedback Rule", "No feedback");
      cy.selectLGOption(
        "Host Overallocation Rule",
        "Terminate hosts when overallocated"
      );

      save();
      cy.validateToast("success");

      // Reset fields
      cy.selectLGOption("Agent Architecture", "Linux 64-bit");
      cy.getInputByLabel("Working Directory").clear();
      cy.getInputByLabel("Working Directory").type("/home/ubuntu/smoke");
      cy.getInputByLabel("SSH User").clear();
      cy.getInputByLabel("SSH User").type("ubuntu");
      cy.dataCy("delete-item-button").click();
      cy.selectLGOption("Host Allocator Rounding Rule", "Default");
      cy.selectLGOption("Host Allocator Feedback Rule", "Default");
      cy.selectLGOption("Host Overallocation Rule", "Default");

      save();
      cy.validateToast("success");
    });
  });
});
