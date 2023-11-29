describe("Task Page Route", () => {
  it("shouldn't get stuck in a redirect loop when visiting the task page and trying to navigate to a previous page", () => {
    cy.visit("/user/admin/patches");
    cy.visit(`/task/${tasks[1]}`);
    cy.go("back");
    cy.location("pathname").should("eq", "/user/admin/patches");
  });

  it("should not be redirected if they land on a task page with a tab supplied", () => {
    cy.visit(`/task/${tasks[1]}/files`);
    cy.location("pathname").should("eq", `/task/${tasks[1]}/files`);
  });

  it("should display an appropriate status badge when visiting task pages", () => {
    cy.visit(`/task/${tasks[1]}`);
    cy.dataCy("task-status-badge").contains("Dispatched");
    cy.visit(`/task/${tasks[2]}`);
    cy.dataCy("task-status-badge").contains("Running");
    cy.visit(`/task/${tasks[3]}`);
    cy.dataCy("task-status-badge").contains("Succeeded");
  });

  const tasks = {
    1: "evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
    2: "evergreen_ubuntu1604_89",
    3: "patch-2-evergreen_ubuntu1604_dist_patch_33016573166a36bd5f46b4111151899d5c4e95b1_6ecedafb562343215a7ff297_20_05_27_21_39_46",
  };
});
