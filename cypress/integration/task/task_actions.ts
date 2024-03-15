describe("Task Action Buttons", () => {
  describe("Based on the state of the task, some buttons should be disabled and others should be clickable. Clicking on buttons produces banners messaging if the action succeeded or failed.", () => {
    it("Schedule button should be disabled on a completed task", () => {
      cy.visit(tasks[1]);
      cy.dataCy("schedule-task").should("have.attr", "aria-disabled", "true");
    });

    it("Clicking Restart button should restart a task and display a success toast", () => {
      cy.visit(tasks[3]);
      cy.dataCy("restart-task").click();
      cy.validateToast("success", restartSuccessBannerText);
    });

    it("Clicking Unschedule button should unschedule a task and display a success toast", () => {
      cy.visit(tasks[5]);
      cy.dataCy("ellipsis-btn").click();
      cy.dataCy("card-dropdown").should("be.visible");
      cy.dataCy("unschedule-task").click();
      cy.validateToast("success", unscheduleSuccessBannerText);
    });

    it("Abort button should be disabled on completed tasks", () => {
      cy.visit(tasks[3]);
      cy.dataCy("ellipsis-btn").click();
      cy.dataCy("card-dropdown").should("be.visible");
      cy.dataCy("abort-task").should("have.attr", "disabled");
    });

    it("Clicking on set priority, entering a priority value and submitting should result in a success toast.", () => {
      cy.visit(tasks[5]);
      cy.dataCy("ellipsis-btn").click();
      cy.dataCy("card-dropdown").should("be.visible");
      cy.dataCy("prioritize-task").click();
      cy.dataCy("task-priority-input").type("99").type("{enter}");
      cy.validateToast("success", prioritySuccessBannerText);
    });

    it("Should be able to abort an incomplete task", () => {
      cy.visit(tasks[2]);
      cy.dataCy("ellipsis-btn").click();
      cy.dataCy("card-dropdown").should("be.visible");
      cy.dataCy("abort-task").click();
      cy.validateToast("success", "Task aborted");
    });

    it("Should correctly disable/enable the task when clicked", () => {
      cy.visit(tasks[5]);
      cy.dataCy("ellipsis-btn").click();
      cy.dataCy("card-dropdown").should("be.visible");
      cy.dataCy("disable-enable").click();
      cy.validateToast("success", "Task was successfully disabled");

      cy.dataCy("ellipsis-btn").click();
      cy.dataCy("card-dropdown").should("be.visible");
      cy.dataCy("disable-enable").click();
      cy.validateToast("success", "Priority for task updated to 0");
    });
  });

  describe("restarting a display task", () => {
    it("does not allow restarting only failed execution tasks when all execution tasks were successful", () => {
      cy.visit(tasks[4]);
      cy.dataCy("restart-task").click();
      cy.validateToast("success", restartSuccessBannerText);
    });
  });
});

const prioritySuccessBannerText = "Priority for task updated to 99";
const restartSuccessBannerText = "Task scheduled to restart";
const unscheduleSuccessBannerText = "Task marked as unscheduled";
const tasks = {
  1: "/task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
  2: "/task/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
  3: "/task/evergreen_ubuntu1604_dist_patch_33016573166a36bd5f46b4111151899d5c4e95b1_5ecedafb562343215a7ff297_20_05_27_21_39_46",
  4: "/task/mci_ubuntu1604_display_asdf_patch_a1d2c8f70bf5c543de8b9641ac1ec08def1ddb26_5f74d99ab2373627c047c5e5_20_09_30_19_16_47/execution-tasks?execution=0",
  5: "/task/evergreen_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
};
