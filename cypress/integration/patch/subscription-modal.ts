// / <reference types="Cypress" />

import {
  testSharedSubscriptionModalFunctionality,
  openSubscriptionModal,
} from "../../utils/subscriptionModal";

describe("Version Subscription Modal", () => {
  const dataCyToggleModalButton = "notify-patch";
  const dataCyModal = "patch-notification-modal";
  const route = "/version/5e4ff3abe3c3317e352062e4/tasks";

  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  testSharedSubscriptionModalFunctionality(
    route,
    dataCyModal,
    dataCyToggleModalButton
  );

  describe("Regex selector inputs", () => {
    const openModal = () =>
      openSubscriptionModal(route, dataCyToggleModalButton);

    it("Clicking on 'Add additional criteria' adds a regex selector row", () => {
      openModal();
      cy.dataTestId("trigger_5-option").click();
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
      cy.dataTestId("0-regex-selector-dropdown").click();
      cy.dataTestId("0-display-name-option").click();
      cy.dataCy("0-regex-selector-input").should("not.be.disabled");
    });

    it("Selecting a regex selector type will disable that option in other regex selector type dropdowns", () => {
      cy.contains("Add additional criteria").click();
      cy.dataTestId("1-regex-selector-dropdown").click();
      cy.dataTestId("1-display-name-option").should(
        "have.css",
        "user-select",
        "none"
      );
    });

    it("At least one regex selector row needs to be filled to enable the save button", () => {
      openModal();
      cy.dataTestId("trigger_5-option").click();
      cy.dataTestId("notify-by-select").click();
      cy.dataTestId("jira-comment-option").click();
      cy.dataTestId("jira-comment-input").type("EVG-2000");
      cy.dataCy("save-subscription-button").should("be.disabled");
      cy.dataTestId("0-regex-selector-dropdown").click();
      cy.dataTestId("0-display-name-option").click();
      cy.dataCy("0-regex-selector-input").type("regex stuff");
      cy.dataCy("save-subscription-button").should("not.be.disabled");
    });

    it("First regex selector input should never have a delete button", () => {
      cy.dataCy("0-regex-selector-trash-container").should(
        "have.css",
        "display",
        "none"
      );
      cy.dataTestId("when-select").click();
      cy.dataTestId("trigger_5-option").click();
      cy.dataCy("0-regex-selector-trash-container").should(
        "have.css",
        "display",
        "none"
      );
    });

    it("Switching between Event types should either hide or reset regex selector inputs", () => {
      openModal();
      cy.dataTestId("trigger_5-option").click();
      cy.dataTestId("0-regex-selector-dropdown").click();
      cy.dataTestId("0-display-name-option").click();
      cy.dataCy("0-regex-selector-input")
        .type("stuff")
        .should("have.value", "stuff");
      cy.contains("Add additional criteria").click();
      cy.dataTestId("1-regex-selector-dropdown").click();
      cy.dataTestId("1-build-variant-option").click();
      cy.dataCy("1-regex-selector-input")
        .type("more stuff")
        .should("have.value", "more stuff");
      cy.dataTestId("when-select").click();
      cy.dataTestId("trigger_6-option").click();
      cy.dataCy("0-regex-selector-input").should("have.value", "");
      cy.dataCy("1-regex-selector-input").should("not.exist");
      cy.dataTestId("when-select").click();
      cy.dataTestId("trigger_2-option").click();
      cy.dataCy("0-regex-selector-container").should("not.exist");
    });

    it("Changing the regex selector dropdown should reset the regex selector input", () => {
      openModal();
      cy.dataTestId("trigger_5-option").click();
      cy.dataTestId("0-regex-selector-dropdown").click();
      cy.dataTestId("0-display-name-option").click();
      cy.dataCy("0-regex-selector-input")
        .type("stuff")
        .should("have.value", "stuff");
      cy.dataTestId("0-regex-selector-dropdown").click();
      cy.dataTestId("0-build-variant-option").click();
      cy.dataCy("0-regex-selector-input").should("have.value", "");
    });
  });
});
