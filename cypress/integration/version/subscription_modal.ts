// / <reference types="Cypress" />

import { openSubscriptionModal } from "../../utils/subscriptionModal";
import { selectAntdOption } from "../../utils";

const regexSelectorRow = "regex-selector-row";

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
    it("Clicking on 'Add Additional Criteria' adds a regex selector row", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      selectAntdOption(
        "event-trigger-select",
        "A build-variant in this version finishes"
      );
      cy.dataCy(regexSelectorRow).should("have.length", 0);
      cy.contains("Add Additional Criteria").click();
      cy.dataCy(regexSelectorRow).should("have.length", 1);
    });

    it("Clicking on the trash glyph removes the regex selector", () => {
      cy.dataCy(regexSelectorRow).should("have.length", 1);
      cy.dataCy("delete-item-button").first().click();
      cy.dataCy(regexSelectorRow).should("have.length", 0);
    });

    // Skip because of complications with SpruceForm
    it.skip("'Regex' input should be disabled when the 'Field name' is empty and enabled otherwise", () => {
      cy.contains("Add Additional Criteria").click();
      cy.dataCy(regexSelectorRow).should("be.disabled");
      selectAntdOption("regex-select", "Build Variant Name");
      cy.dataCy(regexSelectorRow).should("not.be.disabled");
    });

    it("Selecting a regex selector type will disable that option in other regex selector type dropdowns", () => {
      cy.contains("Add Additional Criteria").click();
      cy.contains("Build Variant ID").should("be.visible");
      cy.contains("Add Additional Criteria").click();
      cy.contains("Build Variant Name").should("be.visible");
      cy.dataCy("regex-select").last().click();
      cy.contains("Build Variant ID").should("have.css", "user-select", "none");
    });

    it("Regex selectors are optional for triggers that offer them", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      selectAntdOption(
        "event-trigger-select",
        "A build-variant in this version finishes"
      );
      cy.dataCy("jira-comment-input").type("EVG-2000");
      cy.dataCy("save-subscription-button").should("not.be.disabled");
      cy.dataCy("save-subscription-button").click();
      cy.validateToast("success", "Your subscription has been added");
    });

    // Skip because of complications with SpruceForm
    it.skip("Switching between Event types should either hide or reset regex selector inputs", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      selectAntdOption(
        "event-trigger-select",
        "A build-variant in this version finishes"
      );
      cy.contains("Add Additional Criteria").click();
      cy.dataCy("regex-select").click();
      cy.contains("Build Variant Name").click();
      cy.dataCy("regex-input").type("stuff").should("have.value", "stuff");
      selectAntdOption(
        "event-trigger-select",
        "A build-variant in this version fails"
      );
      cy.dataCy("regex-input").should("have.value", "");
    });

    // Skip because of complications with SpruceForm
    it.skip("Changing the regex selector dropdown should reset the regex selector input", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      selectAntdOption(
        "event-trigger-select",
        "A build-variant in this version finishes"
      );
      cy.contains("Add Additional Criteria").click();
      cy.dataCy("regex-select").click();
      cy.contains("Build Variant Name").click();
      cy.dataCy("regex-input").type("stuff").should("have.value", "stuff");
      cy.dataCy("regex-select").click();
      cy.contains("Build Variant ID").click();
      cy.dataCy("regex-input").should("have.value", "");
    });

    it("Display success toast after submitting a valid form with regex selectors inputs and request succeeds", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      selectAntdOption(
        "event-trigger-select",
        "A build-variant in this version finishes"
      );
      cy.contains("Add Additional Criteria").click();
      selectAntdOption("regex-select", "Build Variant Name");
      cy.dataCy("regex-input").type("stuff");
      cy.dataCy("jira-comment-input").type("EVG-2000");
      cy.dataCy("save-subscription-button").click();
      cy.validateToast("success", "Your subscription has been added");
    });

    it("'Add Additional Criteria' button should not appear when there are enough 'Field name' dropdowns to represent all possible regex selector types for a trigger", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      selectAntdOption(
        "event-trigger-select",
        "A build-variant in this version finishes"
      );
      cy.contains("Add Additional Criteria").should("not.be.disabled");
      cy.contains("Add Additional Criteria").click();
      cy.contains("Add Additional Criteria").should("not.be.disabled");
      cy.contains("Add Additional Criteria").click();
      cy.contains("Add Additional Criteria").should("not.exist");
    });
  });
});
