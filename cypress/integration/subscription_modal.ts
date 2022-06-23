// / <reference types="Cypress" />
import { mockErrorResponse } from "../utils/mockErrorResponse";
import { openSubscriptionModal } from "../utils/subscriptionModal";

const testSharedSubscriptionModalFunctionality = (
  route: string,
  dataCyModal: string,
  dataCyToggleModalButton: string,
  description: string
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
      cy.dataCy(dataCyModal).should("be.visible");
      cy.dataCy(dataCyModal).within(() => {
        cy.getInputByLabel("Event").click({ force: true });
      });
      cy.contains("succeeds").should("be.visible");
      cy.contains("succeeds").click();
      cy.dataCy(dataCyModal).within(() => {
        cy.getInputByLabel("Notification Method").click({ force: true });
      });
      cy.contains("Comment on a JIRA Issue").click();
      cy.dataCy("jira-comment-input").type("EVG-2000");
      cy.dataCy("save-subscription-button").click();
      cy.dataCy(toastDataCy).contains(successText);
    });

    describe("Disables save button and displays an error message when populating form with invalid values", () => {
      before(() => {
        openSubscriptionModal(route, dataCyToggleModalButton);
        cy.dataCy(dataCyModal).should("be.visible");
      });
      beforeEach(() => {
        cy.dataCy(dataCyModal).within(() => {
          cy.getInputByLabel("Event").click({ force: true });
        });
      });

      it("has an invalid percentage", () => {
        cy.contains("changes by some percentage").click();
        cy.dataCy("percent-change-input").clear().type("-100");
        cy.dataCy("jira-comment-input").type("EVG-2000");
        cy.contains(errorTextNegativePercent).should("exist");
        cy.dataCy("save-subscription-button").should("be.disabled");
        cy.dataCy("percent-change-input").clear().type("100");
        cy.dataCy("save-subscription-button").should("not.be.disabled");
        cy.dataCy("jira-comment-input").clear();
      });
      it("has an invalid duration value", () => {
        cy.contains("exceeds some duration").click();
        cy.dataCy("duration-secs-input").clear().type("-100");
        cy.dataCy("jira-comment-input").type("EVG-2000");
        cy.contains(errorTextDuration).should("exist");
        cy.dataCy("save-subscription-button").should("be.disabled");
        cy.dataCy("duration-secs-input").clear().type("100");
        cy.dataCy("save-subscription-button").should("not.be.disabled");
        cy.dataCy("duration-secs-input").clear().type(".33");
        cy.contains(errorTextDuration).should("exist");
        cy.dataCy("save-subscription-button").should("be.disabled");
        cy.dataCy("duration-secs-input").clear().type("33");
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
        cy.dataCy(dataCyModal).within(() => {
          cy.getInputByLabel("Notification Method").click({ force: true });
        });
        cy.contains("Email").click();
        cy.dataCy("email-input").clear();
        cy.dataCy("email-input").type("arst");
        cy.dataCy("save-subscription-button").should("be.disabled");
        cy.dataCy("email-input").type("rat@rast.com");
        cy.dataCy("save-subscription-button").should("not.be.disabled");
      });
      it("has an invalid slack username", () => {
        cy.dataCy(dataCyModal).within(() => {
          cy.getInputByLabel("Notification Method").click({ force: true });
        });
        cy.contains("Slack").click();
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
      cy.dataCy(dataCyModal).within(() => {
        cy.getInputByLabel("Event").click({ force: true });
      });
      cy.contains("succeeds").should("be.visible");
      cy.contains("succeeds").click();
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

    const toastDataCy = "toast";
    const successText = "Your subscription has been added";
    const errorTextDuration = "Duration must be positive integer";
    const errorTextNegativePercent = "Percentage must be positive";
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
