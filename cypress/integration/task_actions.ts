// / <reference types="Cypress" />

describe("Task Action Buttons", () => {
  before(() => {
    cy.login();
  });

  describe("Based on the state of the task, some buttons should be disabled and others should be clickable. Clicking on buttons produces banners messaging if the action succeeded or failed.", () => {
    beforeEach(() => {
      cy.preserveCookies();
    });

    it("Schedule button should be disabled", () => {
      cy.visit(taskRoute1);
      cy.dataCy("schedule-task").should("have.css", "pointer-events", "none");
    });

    it("Clicking Restart button should produce success banner", () => {
      cy.visit(taskRoute3);
      cy.dataCy("restart-task").click();
      cy.wait(200);
      cy.dataCy(bannerDataCy).contains(restartSuccessBannerText);
    });

    it("Clicking Unschedule button should produce success banner", () => {
      cy.dataCy("ellipsis-btn").click();
      cy.dataCy("unschedule-task").click();
      cy.wait(200);
      cy.dataCy(bannerDataCy).contains(unscheduleSuccessBannerText);
    });

    it("Abort button should be disabled", () => {
      cy.dataCy("ellipsis-btn").click();
      cy.dataCy("abort-task").should("have.css", "pointer-events", "none");
    });

    it("Clicking on set priority, entering a priority value and submitting should result in a success banner.", () => {
      cy.dataCy("prioritize-task").click();
      cy.get(".ant-input-number-input")
        .clear()
        .type("99");
      cy.get(".ant-btn.ant-btn-primary.ant-btn-sm")
        .contains("Set")
        .click({ force: true });
      cy.wait(200);
      cy.dataCy(bannerDataCy).contains(prioritySuccessBannerText);
    });

    it("There should be three visible banners from the previous actions", () => {
      cy.dataCy(bannerDataCy).should("have.length", 3);
    });

    it("Visiting a different task page should clear all banners", () => {
      cy.visit(taskRoute2);
      cy.dataCy(bannerDataCy).should("have.length", 0);
    });

    it("Clicking on Abort should produce a success banner", () => {
      cy.dataCy("ellipsis-btn").click();
      cy.dataCy("abort-task").click();
      cy.wait(200);
      cy.dataCy(bannerDataCy).contains("Task aborted");
    });
  });
});

const prioritySuccessBannerText = "Priority for task updated to 99";
const restartSuccessBannerText = "Task scheduled to restart";
const unscheduleSuccessBannerText = "Task marked as unscheduled";
const taskRoute1 =
  "/task/clone_evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/logs";
const taskRoute3 =
  "/task/evergreen_ubuntu1604_test_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
const taskRoute2 =
  "task/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
const bannerDataCy = "banner";
