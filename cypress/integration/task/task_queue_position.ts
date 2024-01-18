describe("Task Queue Position", () => {
  const taskOnQueue =
    "/task/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
  const taskNotOnQueue =
    "/task/evergreen_ubuntu1604_dist_patch_33016573166a36bd5f46b4111151899d5c4e95b1_5ecedafb562343215a7ff297_20_05_27_21_39_46";

  it("Shows link to task queue if task is on queue", () => {
    cy.visit(taskOnQueue);
    cy.dataCy("task-queue-position")
      .should("have.attr", "href")
      .and(
        "eq",
        "/task-queue/archlinux-test/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
      );
  });

  it("Does not show link to task queue if task is not on queue", () => {
    cy.visit(taskNotOnQueue);
    cy.dataCy("task-queue-position").should("not.exist");
  });
});
