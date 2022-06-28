// / <reference types="Cypress" />
import { mockErrorResponse } from "../utils/mockErrorResponse";
import { openSubscriptionModal } from "../utils/subscriptionModal";
import { selectAntdOption } from "../utils";

const testSharedSubscriptionModalFunctionality = (
  route: string,
  dataCyModal: string,
  dataCyToggleModalButton: string,
  description: string,
  type: string
) => {
  describe(description, () => {
    before(() => {
      cy.login();
      cy.preserveCookies();
    });
    beforeEach(() => {
      cy.preserveCookies();
    });
    it("Displays success toast after submitting a valid form and request succeeds", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.dataCy(dataCyModal).should("exist");

      selectAntdOption("event-trigger-select", `This ${type} finishes`);
      selectAntdOption("notification-method-select", "JIRA issue");

      cy.dataCy("jira-comment-input").type("EVG-2000");
      cy.dataCy("save-subscription-button").should("not.be.disabled");
      cy.dataCy("save-subscription-button").click();
      cy.dataCy(toastDataCy).contains(successText);
    });

    describe("Disables save button and displays an error message when populating form with invalid values", () => {
      before(() => {
        openSubscriptionModal(route, dataCyToggleModalButton);
        cy.dataCy(dataCyModal).should("be.visible");
      });

      it("has an invalid percentage", () => {
        selectAntdOption("event-trigger-select", "changes by some percentage");
        cy.dataCy("percent-change-input").clear().type("-100");
        cy.dataCy("jira-comment-input").type("EVG-2000");
        cy.contains(errorTextNegativePercent).should("exist");
        cy.dataCy("save-subscription-button").should("be.disabled");
        cy.dataCy("percent-change-input").clear().type("100");
        cy.dataCy("save-subscription-button").should("not.be.disabled");
        cy.dataCy("jira-comment-input").clear();
      });
      it("has an invalid duration value", () => {
        selectAntdOption("event-trigger-select", "exceeds some duration");
        cy.dataCy("duration-secs-input").clear().type("-100");
        cy.dataCy("jira-comment-input").type("EVG-2000");
        cy.contains(errorTextDuration).should("exist");
        cy.dataCy("save-subscription-button").should("be.disabled");
        cy.dataCy("duration-secs-input").clear().type("100");
        cy.dataCy("save-subscription-button").should("not.be.disabled");
        cy.dataCy("jira-comment-input").clear();
      });
      it("has an invalid jira ticket", () => {
        cy.dataCy("jira-comment-input").type("E");
        cy.dataCy("save-subscription-button").should("be.disabled");
        cy.dataCy("jira-comment-input").type("EVG-100");
        cy.dataCy("save-subscription-button").should("not.be.disabled");
        cy.dataCy("jira-comment-input").clear();
      });
      it("has an invalid email", () => {
        selectAntdOption("notification-method-select", "Email");
        cy.dataCy("email-input").clear();
        cy.dataCy("email-input").type("arst");
        cy.dataCy("save-subscription-button").should("be.disabled");
        cy.dataCy("email-input").type("rat@rast.com");
        cy.dataCy("save-subscription-button").should("not.be.disabled");
      });
      it("has an invalid slack username", () => {
        selectAntdOption("notification-method-select", "Slack");
        cy.dataCy("slack-input").clear();
        cy.dataCy("slack-input").type("sart");
        cy.dataCy("save-subscription-button").should("be.disabled");
        cy.dataCy("slack-input").clear();
        cy.dataCy("slack-input").type("@sart");
        cy.dataCy("save-subscription-button").should("not.be.disabled");
      });
    });

    it("Displays error toast when save subscription request fails", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.dataCy(dataCyModal).should("be.visible");
      selectAntdOption("event-trigger-select", `This ${type} finishes`);
      cy.dataCy("jira-comment-input").type("EVG-2000");
      mockErrorResponse({
        path: "SaveSubscription",
        errorMessage: "error",
      });
      cy.dataCy("save-subscription-button").click();
      cy.dataCy(toastDataCy).contains("error");
    });

    it("Hides the modal after clicking the cancel button", () => {
      cy.visit(route);
      cy.dataCy(dataCyToggleModalButton).click();
      cy.dataCy(dataCyModal).should("be.visible");
      cy.dataCy("cancel-subscription-button").click();
      cy.dataCy(dataCyModal).should("not.be.visible");
    });

    it("Pulls initial values from cookies", () => {
      const triggerCookie = `${type}-notification-trigger`;
      cy.setCookie(triggerCookie, `${type}-succeeds`);
      const subscriptionCookie = "subscription-method";
      cy.setCookie(subscriptionCookie, "slack");

      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.dataCy(dataCyModal).should("be.visible");
      cy.contains(`This ${type} succeeds`).should("be.visible");
      cy.contains("Slack").should("be.visible");

      cy.clearCookie(subscriptionCookie);
      cy.clearCookie(triggerCookie);
    });

    const toastDataCy = "toast";
    const successText = "Your subscription has been added";
    const errorTextDuration = "Value should be >= 0";
    const errorTextNegativePercent = "Value should be >= 0";
  });
};

testSharedSubscriptionModalFunctionality(
  "/task/clone_evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/logs",
  "task-notification-modal",
  "notify-task",
  "Task Subscription Modal",
  "task"
);

testSharedSubscriptionModalFunctionality(
  "/version/5e4ff3abe3c3317e352062e4/tasks",
  "patch-notification-modal",
  "notify-patch",
  "Version Subscription Modal",
  "version"
);
