import { mockErrorResponse } from "../utils/mockErrorResponse";
import { openSubscriptionModal } from "../utils/subscriptionModal";

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

      cy.selectLGOption("Event", `This ${type} finishes`);
      cy.selectLGOption("Notification Method", "JIRA issue");

      cy.dataCy("jira-comment-input").type("EVG-2000");
      cy.contains("button", "Save").should("not.be.disabled");
      cy.contains("button", "Save").click();
      cy.validateToast("success", successText);
    });

    describe("Disables save button and displays an error message when populating form with invalid values", () => {
      before(() => {
        openSubscriptionModal(route, dataCyToggleModalButton);
        cy.dataCy(dataCyModal).should("be.visible");
      });

      it("has an invalid percentage", () => {
        cy.selectLGOption("Event", "changes by some percentage");
        cy.dataCy("percent-change-input").clear().type("-100");
        cy.dataCy("jira-comment-input").type("EVG-2000");
        cy.contains(errorTextPercent).should("exist");
        cy.contains("button", "Save").should("be.disabled");
        cy.dataCy("percent-change-input").clear().type("100");
        cy.contains("button", "Save").should("not.be.disabled");
        cy.dataCy("jira-comment-input").clear();
      });
      it("has an invalid duration value", () => {
        cy.selectLGOption("Event", "exceeds some duration");
        cy.dataCy("duration-secs-input").clear().type("-100");
        cy.dataCy("jira-comment-input").type("EVG-2000");
        cy.contains(errorTextDuration).should("exist");
        cy.contains("button", "Save").should("be.disabled");
        cy.dataCy("duration-secs-input").clear().type("100");
        cy.contains("button", "Save").should("not.be.disabled");
        cy.dataCy("jira-comment-input").clear();
      });
      it("has an invalid jira ticket", () => {
        cy.dataCy("jira-comment-input").type("E");
        cy.contains("button", "Save").should("be.disabled");
        cy.dataCy("jira-comment-input").type("EVG-100");
        cy.contains("button", "Save").should("not.be.disabled");
        cy.dataCy("jira-comment-input").clear();
      });
      it("has an invalid email", () => {
        cy.selectLGOption("Notification Method", "Email");
        cy.dataCy("email-input").clear();
        cy.dataCy("email-input").type("arst");
        cy.contains("button", "Save").should("be.disabled");
        cy.dataCy("email-input").type("rat@rast.com");
        cy.contains("button", "Save").should("not.be.disabled");
      });
      it("has an invalid slack username", () => {
        cy.selectLGOption("Notification Method", "Slack message");
        cy.dataCy("slack-input").clear();
        cy.dataCy("slack-input").type("sa rt");
        cy.contains("button", "Save").should("be.disabled");
        cy.dataCy("slack-input").clear();
        cy.dataCy("slack-input").type("@sart");
        cy.contains("button", "Save").should("not.be.disabled");
      });
    });

    it("Displays error toast when save subscription request fails", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.dataCy(dataCyModal).should("be.visible");
      cy.selectLGOption("Event", `This ${type} finishes`);
      cy.dataCy("jira-comment-input").type("EVG-2000");
      mockErrorResponse({
        path: "SaveSubscription",
        errorMessage: "error",
      });
      cy.contains("button", "Save").click();
      cy.validateToast("error");
    });

    it("Hides the modal after clicking the cancel button", () => {
      cy.visit(route);
      cy.dataCy(dataCyToggleModalButton).click();
      cy.dataCy(dataCyModal).should("be.visible");
      cy.contains("button", "Cancel").click();
      cy.dataCy(dataCyModal).should("not.exist");
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

describe("Waterfall subscription modal", () => {
  const route = "/commits/spruce";
  const type = "project";
  const dataCyModal = "waterfall-notification-modal";
  const errorTextRegex = "Value should be a valid regex expression.";
  const successText = "Your subscription has been added";

  before(() => {
    cy.visit(route);
  });
  it("Displays success toast after submitting a valid form and request succeeds", () => {
    cy.dataCy("waterfall-menu").click();
    cy.dataCy("add-notification").click();
    cy.dataCy(dataCyModal).should("be.visible");

    selectAntdOption("event-trigger-select", "Any Version Finishes");
    selectAntdOption("notification-method-select", "JIRA issue");

    cy.dataCy("jira-comment-input").type("EVG-2000");
    cy.dataCy("save-subscription-button").should("not.be.disabled");
    cy.dataCy("save-subscription-button").click();
    cy.validateToast("success", successText);
  });

  it("Disables save button and displays an error message when populating form with invalid values", () => {
    cy.dataCy("waterfall-menu").click();
    cy.dataCy("add-notification").click();
    cy.dataCy(dataCyModal).should("be.visible");

    selectAntdOption("event-trigger-select", "Any Build Finishes");
    cy.dataCy("add-button").click();
    cy.dataCy("save-subscription-button").should("be.disabled");

    cy.dataCy("jira-comment-input").type("EVG-2000");
    cy.dataCy("regex-input").type("*.notValidRegex");
    cy.contains(errorTextRegex).should("exist");
    cy.dataCy("save-subscription-button").should("be.disabled");

    cy.dataCy("regex-input").clear().type("validRegex");
    cy.dataCy("save-subscription-button").should("not.be.disabled");
    cy.dataCy("save-subscription-button").click();
    cy.validateToast("success", successText);
  });

  it("Displays error toast when save subscription request fails", () => {
    cy.dataCy("waterfall-menu").click();
    cy.dataCy("add-notification").click();
    cy.dataCy(dataCyModal).should("be.visible");

    selectAntdOption("event-trigger-select", "Any Version Finishes");
    cy.dataCy("jira-comment-input").type("EVG-2000");
    mockErrorResponse({
      path: "SaveSubscription",
      errorMessage: "error",
    });
    cy.dataCy("save-subscription-button").click();
    cy.validateToast("error");
  });

  it("Hides the modal after clicking the cancel button", () => {
    cy.dataCy("waterfall-menu").click();
    cy.dataCy("add-notification").click();
    cy.dataCy(dataCyModal).should("be.visible");
    cy.dataCy("cancel-subscription-button").click();
    cy.dataCy(dataCyModal).should("not.be.visible");
  });

  it("Pulls initial values from cookies", () => {
    const triggerCookie = `${type}-notification-trigger`;
    cy.setCookie(triggerCookie, `any-build-fails`);
    const subscriptionCookie = "subscription-method";
    cy.setCookie(subscriptionCookie, "slack");

    cy.reload();
    cy.dataCy("waterfall-menu").click();
    cy.dataCy("add-notification").click();
    cy.dataCy(dataCyModal).should("be.visible");
    cy.contains("Any Build Fails").should("be.visible");
    cy.contains("Slack").should("be.visible");

    cy.clearCookie(subscriptionCookie);
    cy.clearCookie(triggerCookie);
  });
});
