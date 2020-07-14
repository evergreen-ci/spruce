// / <reference types="Cypress" />

import { testSharedSubscriptionModalFunctionality } from "../../utils/subscriptionModal";

describe("Task Subscription Modal", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });
  testSharedSubscriptionModalFunctionality(
    "/task/clone_evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/logs",
    "task-notification-modal",
    "notify-task"
  );
});
