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

    it("'Regex' input should be disabled when the 'Field name' is empty and enabled otherwise", () => {
      openModal();
      cy.dataTestId("trigger_5-option").click();
      cy.dataCy("0-regex-selector-input").should("be.disabled");
      cy.dataTestId("0-regex-selector-dropdown").click();
      cy.dataTestId("display-name-option").click();
      cy.dataCy("0-regex-selector-input").should("not.be.disabled");
    });

    it("Clicking on the trash glyph removes the regex selector", () => {
      cy.dataCy("0-regex-selector-container").should("exist");
      cy.dataCy("0-regex-selector-trash").click();
      cy.dataCy("0-regex-selector-container").should("not.exist");
    });

    it("Clicking on 'Add additional criteria' adds a regex selector row", () => {
      cy.contains("Add additional criteria").click();
      cy.dataCy("0-regex-selector-container").should("exist");
    });

    it("Selecting a regex selector type will disable that option in other regex selector type dropdowns", () => {
      cy.dataTestId("0-regex-selector-dropdown").click();
      cy.dataTestId("display-name-option").click();
      cy.contains("Add additional criteria").click();
      cy.dataTestId("1-regex-selector-dropdown").click();
      cy.dataTestId("display-name-option").should(
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
      cy.dataTestId("display-name-option").click();
      cy.dataCy("0-regex-selector-input").type("regex stuff");
      cy.dataCy("save-subscription-button").should("not.be.disabled");
    });

    it("'Add additional criteria' button is disabled when there are enough regex selectors rows to account for all available regex selector dropdown options", () => {});
  });
});
