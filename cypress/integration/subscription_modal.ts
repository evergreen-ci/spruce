import { mockErrorResponse } from "../utils/mockErrorResponse";
import { openSubscriptionModal } from "../utils/subscriptionModal";
import { selectDropdown } from "../utils";

const testSharedSubscriptionModalFunctionality = (
  route: string,
  dataCyModal: string,
  dataCyToggleModalButton: string,
  description: string,
  type: string
) => {
  describe(description, () => {
    it("Displays success toast after submitting a valid form and request succeeds", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.dataCy(dataCyModal).should("be.visible");

      selectDropdown("Event", `This ${type} finishes`);
      selectDropdown("Notification Method", "JIRA issue");

      cy.dataCy("jira-comment-input").type("EVG-2000");
      cy.contains("Save").should("not.be.disabled");
      cy.contains("Save").click();
      cy.validateToast("success", successText);
    });

    describe("Disables save button and displays an error message when populating form with invalid values", () => {
      before(() => {
        openSubscriptionModal(route, dataCyToggleModalButton);
        cy.dataCy(dataCyModal).should("be.visible");
      });

      it("has an invalid percentage", () => {
        selectDropdown("Event", "changes by some percentage");
        cy.dataCy("percent-change-input").clear().type("-100");
        cy.dataCy("jira-comment-input").type("EVG-2000");
        cy.contains(errorTextPercent).should("exist");
        cy.contains("Save").should("be.disabled");
        cy.dataCy("percent-change-input").clear().type("100");
        cy.contains("Save").should("not.be.disabled");
        cy.dataCy("jira-comment-input").clear();
      });
      it("has an invalid duration value", () => {
        selectDropdown("Event", "exceeds some duration");
        cy.dataCy("duration-secs-input").clear().type("-100");
        cy.dataCy("jira-comment-input").type("EVG-2000");
        cy.contains(errorTextDuration).should("exist");
        cy.contains("Save").should("be.disabled");
        cy.dataCy("duration-secs-input").clear().type("100");
        cy.contains("Save").should("not.be.disabled");
        cy.dataCy("jira-comment-input").clear();
      });
      it("has an invalid jira ticket", () => {
        cy.dataCy("jira-comment-input").type("E");
        cy.contains("Save").should("be.disabled");
        cy.dataCy("jira-comment-input").type("EVG-100");
        cy.contains("Save").should("not.be.disabled");
        cy.dataCy("jira-comment-input").clear();
      });
      it("has an invalid email", () => {
        selectDropdown("Notification Method", "Email");
        cy.dataCy("email-input").clear();
        cy.dataCy("email-input").type("arst");
        cy.contains("Save").should("be.disabled");
        cy.dataCy("email-input").type("rat@rast.com");
        cy.contains("Save").should("not.be.disabled");
      });
      it("has an invalid slack username", () => {
        selectDropdown("Notification Method", "Slack message");
        cy.dataCy("slack-input").clear();
        cy.dataCy("slack-input").type("sa rt");
        cy.contains("Save").should("be.disabled");
        cy.dataCy("slack-input").clear();
        cy.dataCy("slack-input").type("@sart");
        cy.contains("Save").should("not.be.disabled");
      });
    });

    it("Displays error toast when save subscription request fails", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.dataCy(dataCyModal).should("be.visible");
      selectDropdown("Event", `This ${type} finishes`);
      cy.dataCy("jira-comment-input").type("EVG-2000");
      mockErrorResponse({
        path: "SaveSubscription",
        errorMessage: "error",
      });
      cy.contains("Save").click();
      cy.validateToast("error");
    });

    it("Hides the modal after clicking the cancel button", () => {
      cy.visit(route);
      cy.dataCy(dataCyToggleModalButton).click();
      cy.dataCy(dataCyModal).should("be.visible");
      cy.contains("Cancel").click();
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

    const successText = "Your subscription has been added";
    const errorTextPercent = "Value should be >= 0";
    const errorTextDuration = "Value should be >= 0";
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
