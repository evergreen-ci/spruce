import { getNotificationsRoute, saveButtonEnabled } from "./constants";
import { clickSave } from "../../utils";

describe("Notifications", () => {
  const origin = getNotificationsRoute("evergreen");
  beforeEach(() => {
    cy.visit(origin);
  });
  it("shows correct intitial state", () => {
    cy.dataCy("default-to-repo-button").should("not.exist");
    cy.contains("No subscriptions are defined.").should("be.visible");
    saveButtonEnabled(false);
  });
  it("should be able to add a subscription, save it and delete it", () => {
    cy.dataCy("expandable-card").should("not.exist");
    cy.dataCy("add-button").contains("Add Subscription").should("be.visible");
    cy.dataCy("add-button").click();
    cy.dataCy("expandable-card").should("contain.text", "New Subscription");
    cy.selectLGOption("Event", "Any version finishes");
    cy.selectLGOption("Notification Method", "Email");
    cy.getInputByLabel("Email").type("mohamed.khelif@mongodb.com");
    cy.dataCy("save-settings-button").scrollIntoView();
    clickSave();
    cy.validateToast("success", "Successfully updated project");

    saveButtonEnabled(false);
    cy.dataCy("expandable-card").as("subscriptionItem").scrollIntoView();
    cy.get("@subscriptionItem")
      .should("be.visible")
      .should("contain.text", "Version outcome  - mohamed.khelif@mongodb.com");
    cy.dataCy("delete-item-button").should("not.be.disabled").click();
    cy.get("@subscriptionItem").should("not.exist");
    cy.dataCy("save-settings-button").scrollIntoView();
    clickSave();
    cy.validateToast("success", "Successfully updated project");
  });

  it("should not be able to combine a jira comment subscription with a task event", () => {
    cy.dataCy("expandable-card").should("not.exist");
    cy.dataCy("add-button").contains("Add Subscription").should("be.visible");
    cy.dataCy("add-button").click();
    cy.dataCy("expandable-card").should("exist").scrollIntoView();
    cy.dataCy("expandable-card")
      .should("be.visible")
      .should("contain.text", "New Subscription");
    cy.selectLGOption("Event", "Any task finishes");
    cy.selectLGOption("Notification Method", "Comment on a JIRA issue");
    cy.getInputByLabel("JIRA Issue").type("JIRA-123");
    cy.contains("Subscription type not allowed for tasks in a project.").should(
      "be.visible"
    );
    cy.dataCy("save-settings-button").scrollIntoView();
    saveButtonEnabled(false);
  });
  it("should not be able to save a subscription if an input is invalid", () => {
    cy.dataCy("add-button").click();
    cy.dataCy("expandable-card").scrollIntoView();
    cy.dataCy("expandable-card")
      .should("be.visible")
      .should("contain.text", "New Subscription");
    cy.selectLGOption("Event", "Any version finishes");
    cy.selectLGOption("Notification Method", "Email");
    cy.getInputByLabel("Email").type("Not a real email");
    cy.contains("Value should be a valid email.").should("be.visible");
    cy.dataCy("save-settings-button").scrollIntoView();
    saveButtonEnabled(false);
  });
  it("Setting a project banner displays the banner on the correct pages and unsetting is removes it", () => {
    const bannerText = "This is a project banner!";

    // set banner
    cy.dataCy("banner-text").clear();
    cy.dataCy("banner-text").type(bannerText);
    clickSave();
    cy.validateToast("success", "Successfully updated project");

    // ensure banner is displayed
    cy.contains(bannerText).should("be.visible");

    const taskRoute =
      "task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
    cy.visit(taskRoute);
    cy.contains(bannerText).should("be.visible");

    const configureRoute = "patch/5e6bb9e23066155a993e0f1b/configure/tasks";
    cy.visit(configureRoute);
    cy.contains(bannerText).should("be.visible");

    const versionRoute = "version/5e4ff3abe3c3317e352062e4";
    cy.visit(versionRoute);
    cy.contains(bannerText).should("be.visible");

    const projectHealthRoute = "commits/evergreen";
    cy.visit(projectHealthRoute);
    cy.contains(bannerText).should("be.visible");

    const variantHistoryRoute = "/variant-history/evergreen/ubuntu1604";
    cy.visit(variantHistoryRoute);
    cy.contains(bannerText).should("be.visible");

    const taskHistoryRoute = "task-history/evergreen/test-cloud";
    cy.visit(taskHistoryRoute);
    cy.contains(bannerText).should("be.visible");

    // clear banner
    cy.visit(origin);
    cy.dataCy("banner-text").clear();
    clickSave();

    // ensure banner is not displayed
    cy.contains(bannerText).should("not.exist");

    cy.visit(taskRoute);
    cy.contains(bannerText).should("not.exist");

    cy.visit(configureRoute);
    cy.contains(bannerText).should("not.exist");

    cy.visit(versionRoute);
    cy.contains(bannerText).should("not.exist");

    cy.visit(projectHealthRoute);
    cy.contains(bannerText).should("not.exist");

    cy.visit(variantHistoryRoute);
    cy.contains(bannerText).should("not.exist");

    cy.visit(taskHistoryRoute);
    cy.contains(bannerText).should("not.exist");
  });
});
