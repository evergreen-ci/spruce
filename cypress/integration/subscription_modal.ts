// / <reference types="Cypress" />
import { mockErrorResponse } from "../utils/mockErrorResponse";
import { openSubscriptionModal } from "../utils/subscriptionModal";

describe("Subscription Modals - Shared functionality", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  const testSharedSubscriptionModalFunctionality = (
    route: string,
    dataCyModal: string,
    dataCyToggleModalButton: string,
    description: string
  ) => {
    describe(description, () => {
      it("Display success toast after submitting a valid form and request succeeds", () => {
        openSubscriptionModal(route, dataCyToggleModalButton);
        cy.contains("finishes").click();
        cy.dataTestId("notify-by-select").click();
        cy.dataTestId("jira-comment-option").click();
        cy.dataTestId("jira-comment-input").type("EVG-2000");
        cy.dataCy("save-subscription-button").click();
        cy.dataCy(bannerDataCy).contains(successText);
      });

      it("Disable save button and display error message when populating form with negative percent value", () => {
        openSubscriptionModal(route, dataCyToggleModalButton);
        cy.contains("changes by some percentage").click();
        cy.dataCy("percent-change-input").clear().type("-100");
        cy.dataTestId("notify-by-select").click();
        cy.dataTestId("jira-comment-option").click();
        cy.dataTestId("jira-comment-input").type("EVG-2000");
        cy.dataCy("error-message").contains(errorTextNegativePercent);
        cy.dataCy("save-subscription-button").should("be.disabled");
        cy.dataCy("percent-change-input").clear().type("100");
        cy.dataCy("save-subscription-button").should("not.be.disabled");
      });

      it("Disable save button and display error message in modal when populating form with negative duration value", () => {
        openSubscriptionModal(route, dataCyToggleModalButton);
        cy.contains("exceeds some duration").click();
        cy.dataCy("duration-secs-input").clear().type("-100");
        cy.dataTestId("notify-by-select").click();
        cy.dataTestId("jira-comment-option").click();
        cy.dataTestId("jira-comment-input").type("EVG-2000");
        cy.dataCy("error-message").contains(errorTextNegativeDuration);
        cy.dataCy("save-subscription-button").should("be.disabled");
        cy.dataCy("duration-secs-input").clear().type("100");
        cy.dataCy("save-subscription-button").should("not.be.disabled");
      });

      it("Disable save button and display error message in modal when populating form with decimal duration value", () => {
        openSubscriptionModal(route, dataCyToggleModalButton);
        cy.contains("exceeds some duration").click();
        cy.dataCy("duration-secs-input").clear().type(".33");
        cy.dataTestId("notify-by-select").click();
        cy.dataTestId("jira-comment-option").click();
        cy.dataTestId("jira-comment-input").type("EVG-2000");
        cy.dataCy("error-message").contains(errorTextDecimalDuration);
        cy.dataCy("save-subscription-button").should("be.disabled");
        cy.dataCy("duration-secs-input").clear().type("33");
        cy.dataCy("save-subscription-button").should("not.be.disabled");
      });

      it("Display error toast when save subscription request fails", () => {
        openSubscriptionModal(route, dataCyToggleModalButton);
        cy.contains("finishes").click();
        cy.dataTestId("notify-by-select").click();
        cy.dataTestId("jira-comment-option").click();
        cy.dataTestId("jira-comment-input").type("EVG-2000");
        mockErrorResponse({
          path: "SaveSubscription",
          errorMessage: "error",
        });
        cy.dataCy("save-subscription-button").click();
        cy.dataCy(bannerDataCy).contains("error");
      });

      it("Hide the modal after clicking the cancel button", () => {
        cy.visit(route);
        cy.dataCy(dataCyToggleModalButton).click();
        cy.dataCy("cancel-subscription-button").click();
        cy.dataCy(dataCyModal).should("have.css", "display", "none");
      });

      it("Disable save button when jira ticket is not formatted properly", () => {
        openSubscriptionModal(route, dataCyToggleModalButton);
        cy.dataTestId("trigger_0-option").click();
        cy.dataTestId("notify-by-select").click();
        cy.dataTestId("jira-comment-option").click();
        cy.dataTestId("jira-comment-input").type("E");
        cy.dataCy("save-subscription-button").should("be.disabled");
        cy.dataTestId("jira-comment-input").type("EVG-100");
        cy.dataCy("save-subscription-button").should("not.be.disabled");
      });

      it("Disable save button when email is not formatted properly", () => {
        openSubscriptionModal(route, dataCyToggleModalButton);
        cy.dataTestId("trigger_0-option").click();
        cy.dataTestId("notify-by-select").click();
        cy.dataTestId("email-option").click();
        cy.dataTestId("email-input").clear();
        cy.dataTestId("email-input").type("arst");
        cy.dataCy("save-subscription-button").should("be.disabled");
        cy.dataTestId("email-input").type("rat@rast.com");
        cy.dataCy("save-subscription-button").should("not.be.disabled");
      });

      it("Disable save button when slack username or channel is not formatted properly", () => {
        openSubscriptionModal(route, dataCyToggleModalButton);
        cy.dataTestId("trigger_0-option").click();
        cy.dataTestId("notify-by-select").click();
        cy.dataTestId("slack-option").click();
        cy.dataTestId("slack-input").clear();
        cy.dataTestId("slack-input").type("sart");
        cy.dataCy("save-subscription-button").should("be.disabled");
        cy.dataTestId("slack-input").type("@sart");
        cy.dataCy("save-subscription-button").should("not.be.disabled");
      });

      const bannerDataCy = "toast";
      const successText = "Your subscription has been added";
      const errorTextNegativeDuration = "Duration cannot be negative";
      const errorTextNegativePercent = "Percent must be a positive number";
      const errorTextDecimalDuration = "Duration must be an integer";
    });
  };

  testSharedSubscriptionModalFunctionality(
    "/task/clone_evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/logs",
    "task-notification-modal",
    "notify-task",
    "Task Subscription Modal"
  );

  testSharedSubscriptionModalFunctionality(
    "/version/5e4ff3abe3c3317e352062e4/tasks",
    "patch-notification-modal",
    "notify-patch",
    "Version Subscription Modal"
  );
});
