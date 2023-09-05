import { save } from "./utils";

describe("provider section", () => {
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
