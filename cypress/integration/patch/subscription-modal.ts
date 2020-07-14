// / <reference types="Cypress" />

import { testSharedSubscriptionModalFunctionality } from "../../utils/subscriptionModal";

describe("Version Subscription Modal", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  testSharedSubscriptionModalFunctionality(
    "/version/5e4ff3abe3c3317e352062e4/tasks",
    "patch-notification-modal",
    "notify-patch"
  );
});
