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
      cy.dataCy("trigger_5-option").click();
      cy.dataCy("1-regex-selector-container").should("not.exist");
      cy.contains("Add additional criteria").click();
      cy.dataCy("1-regex-selector-container").should("exist");
    });

    it("Clicking on the trash glyph removes the regex selector", () => {
      cy.dataCy("1-regex-selector-container").should("exist");
      cy.dataCy("1-regex-selector-trash").click();
      cy.dataCy("1-regex-selector-container").should("not.exist");
    });

    it("'Regex' input should be disabled when the 'Field name' is empty and enabled otherwise", () => {
      cy.dataCy("0-regex-selector-input").should("be.disabled");
      cy.dataCy("0-regex-selector-dropdown").click();
      cy.dataCy("0-display-name-option").click();
      cy.dataCy("0-regex-selector-input").should("not.be.disabled");
    });

    it("Selecting a regex selector type will disable that option in other regex selector type dropdowns", () => {
      cy.contains("Add additional criteria").click();
      cy.dataCy("1-regex-selector-dropdown").click();
      cy.dataCy("1-display-name-option").should(
        "have.css",
        "user-select",
        "auto"
      );
    });

    it("Regex selectors are optional for triggers that offer them", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.dataCy("trigger_5-option").click();
      cy.dataCy("notify-by-select").click();
      cy.dataCy("jira-comment-option").click();
      cy.dataCy("jira-comment-input").type("EVG-2000");
      cy.dataCy("save-subscription-button").should("not.be.disabled");
      cy.dataCy("toast").should("not.exist");
      cy.dataCy("save-subscription-button").click();
      cy.dataCy("toast").contains("Your subscription has been added");
    });

    it("Switching between Event types should either hide or reset regex selector inputs", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.dataCy("trigger_5-option").click();
      cy.dataCy("0-regex-selector-dropdown").click();
      cy.dataCy("0-display-name-option").click();
      cy.dataCy("0-regex-selector-input")
        .type("stuff")
        .should("have.value", "stuff");
      cy.contains("Add additional criteria").click();
      cy.dataCy("1-regex-selector-dropdown").click();
      cy.dataCy("1-build-variant-option").click();
      cy.dataCy("1-regex-selector-input")
        .type("more stuff")
        .should("have.value", "more stuff");
      cy.dataCy("when-select").click();
      cy.dataCy("trigger_6-option").click();
      cy.dataCy("0-regex-selector-input").should("have.value", "");
      cy.dataCy("1-regex-selector-input").should("not.exist");
      cy.dataCy("when-select").click();
      cy.dataCy("trigger_2-option").click();
      cy.dataCy("0-regex-selector-container").should("not.exist");
    });

    it("Changing the regex selector dropdown should reset the regex selector input", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.dataCy("trigger_5-option").click();
      cy.dataCy("0-regex-selector-dropdown").click();
      cy.dataCy("0-display-name-option").click();
      cy.dataCy("0-regex-selector-input")
        .type("stuff")
        .should("have.value", "stuff");
      cy.dataCy("0-regex-selector-dropdown").click();
      cy.dataCy("0-build-variant-option").click();
      cy.dataCy("0-regex-selector-input").should("have.value", "");
    });

    it("Display success toast after submitting a valid form with regex selectors inputs and request succeeds", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.dataCy("trigger_5-option").click();
      cy.dataCy("0-regex-selector-dropdown").click();
      cy.dataCy("0-display-name-option").click();
      cy.dataCy("0-regex-selector-input").type("stuff");
      cy.dataCy("notify-by-select").click();
      cy.dataCy("jira-comment-option").click();
      cy.dataCy("jira-comment-input").type("EVG-2000");
      cy.dataCy("toast").should("not.exist");
      cy.dataCy("save-subscription-button").click();
      cy.dataCy("toast").contains("Your subscription has been added");
    });

    it("'Add Additional Criteria' button should be disabled when there are enough 'Field name' dropdowns to represent all possible regex selector types for a trigger", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.dataCy("trigger_5-option").click();
      cy.contains("Add additional criteria").should("not.be.disabled");
      cy.contains("Add additional criteria").click();
      cy.contains("Add additional criteria").should("be.disabled");
    });
  });
});
