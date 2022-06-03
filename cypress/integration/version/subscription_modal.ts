// / <reference types="Cypress" />

import { openSubscriptionModal } from "../../utils/subscriptionModal";

describe("Version Subscription Modal", () => {
  const dataCyToggleModalButton = "notify-patch";
  const route = "/version/5e4ff3abe3c3317e352062e4/tasks";

  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  describe("Regex selector inputs", () => {
    it("Clicking on 'Add additional criteria' adds a regex selector row", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.getInputByLabel("Event").click({ force: true });
      cy.contains("A build-variant in this version finishes").click();
      cy.dataCy("regex-selector-input").should("have.length", 1);
      cy.contains("Add additional criteria").click();
      cy.dataCy("regex-selector-input").should("have.length", 2);
    });

    it("Clicking on the trash glyph removes the regex selector", () => {
      cy.dataCy("regex-selector-input").should("have.length", 2);

      cy.dataCy("regex-selector-trash").last().click();
      cy.dataCy("regex-selector-input").should("have.length", 1);
    });

    it("'Regex' input should be disabled when the 'Field name' is empty and enabled otherwise", () => {
      cy.dataCy("regex-selector-input").should("be.disabled");
      cy.dataCy("regex-selector-dropdown").click();
      cy.contains("Build Variant Name").click();
      cy.dataCy("regex-selector-input").should("not.be.disabled");
    });

    it("Selecting a regex selector type will disable that option in other regex selector type dropdowns", () => {
      cy.contains("Add additional criteria").click();
      cy.dataCy("regex-selector-dropdown").last().click();
      cy.contains("Build Variant Name").should("be.visible");
      cy.contains("Build Variant Name").should(
        "have.css",
        "user-select",
        "none"
      );
    });

    it("Regex selectors are optional for triggers that offer them", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.getInputByLabel("Event").click({ force: true });
      cy.contains("A build-variant in this version finishes").click();
      cy.dataCy("notify-by-select").click();
      cy.dataCy("jira-comment-option").click();
      cy.dataCy("jira-comment-input").type("EVG-2000");
      cy.dataCy("save-subscription-button").should("not.be.disabled");
      cy.dataCy("save-subscription-button").click();
      cy.validateToast("success", "Your subscription has been added");
    });

    it("Switching between Event types should either hide or reset regex selector inputs", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.getInputByLabel("Event").click({ force: true });
      cy.contains("A build-variant in this version finishes").click();
      cy.dataCy("regex-selector-dropdown").click();
      cy.contains("Build Variant Name").click();
      cy.dataCy("regex-selector-input")
        .type("stuff")
        .should("have.value", "stuff");
      cy.getInputByLabel("Event").click({ force: true });
      cy.contains("A build-variant in this version fails").click();
      cy.dataCy("regex-selector-input").should("have.value", "");
    });

    it("Changing the regex selector dropdown should reset the regex selector input", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.getInputByLabel("Event").click({ force: true });
      cy.contains("A build-variant in this version finishes").click();
      cy.dataCy("regex-selector-dropdown").click();
      cy.contains("Build Variant Name").click();
      cy.dataCy("regex-selector-input")
        .type("stuff")
        .should("have.value", "stuff");
      cy.dataCy("regex-selector-dropdown").click();
      cy.contains("Build Variant ID").click();
      cy.dataCy("regex-selector-input").should("have.value", "");
    });

    it("Display success toast after submitting a valid form with regex selectors inputs and request succeeds", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.getInputByLabel("Event").click({ force: true });
      cy.contains("A build-variant in this version finishes").click();
      cy.dataCy("regex-selector-dropdown").click();
      cy.contains("Build Variant Name").click();
      cy.dataCy("regex-selector-input").type("stuff");
      cy.dataCy("notify-by-select").click();
      cy.dataCy("jira-comment-option").click();
      cy.dataCy("jira-comment-input").type("EVG-2000");
      cy.dataCy("save-subscription-button").click();
      cy.validateToast("success", "Your subscription has been added");
    });

    it("'Add Additional Criteria' button should be disabled when there are enough 'Field name' dropdowns to represent all possible regex selector types for a trigger", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.getInputByLabel("Event").click({ force: true });
      cy.contains("A build-variant in this version finishes").click();
      cy.contains("Add additional criteria").should("not.be.disabled");
      cy.contains("Add additional criteria").click();
      cy.contains("Add additional criteria").should("be.disabled");
    });
  });
});
