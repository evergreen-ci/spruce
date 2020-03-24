const patchId = "5e4ff3abe3c3317e352062e4";
const patchRoute = `/patch/${patchId}`;
const patch = {
  changes: { route: `${patchRoute}/changes`, btn: "button[id=changes-tab]" },
  tasks: { route: `${patchRoute}/tasks`, btn: "button[id=task-tab]" }
};
const taskId =
  "evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
const taskRoute = `/task/${taskId}`;
const task = {
  logs: { route: `${taskRoute}/logs`, btn: "button[id=task-logs-tab]" },
  tests: { route: `${taskRoute}/tests`, btn: "button[id=task-tests-tab]" },
  files: { route: `${taskRoute}/files`, btn: "button[id=task-files-tab]" }
};

const locationPathEquals = path =>
  cy.location().should(loc => expect(loc.pathname).to.eq(path));

describe("Tabs", () => {
  beforeEach(() => {
    cy.login();
  });
  describe("Patch page", () => {
    it("selects tasks tab by default", () => {
      cy.visit(patchRoute);
      cy.get(patch.tasks.btn)
        .should("have.attr", "aria-selected")
        .and("eq", "true");
    });

    it("includes selected tab name in url path", () => {
      cy.visit(patchRoute);
      locationPathEquals(patch.tasks.route);
    });

    it("updates the url patchRoute when another tab is selected", () => {
      cy.visit(patchRoute);
      cy.get(patch.changes.btn).click();
      locationPathEquals(patch.changes.route);
    });

    it("replaces invalid tab names in url patchRoute with default", () => {
      cy.visit(`${patchRoute}/chicken`);
      locationPathEquals(patch.tasks.route);
    });

    it("clicking away from each tab doesn't crash app", () => {
      cy.visit(patchRoute);
      cy.get(patch.changes.btn).click();
      cy.contains("I am the patch code changes");
      cy.get(patch.tasks.btn).click();
      cy.get("#task-count").should("exist");
    });
  });

  describe("Task page", () => {
    it("selects logs tab by default", () => {
      cy.visit(taskRoute);
      cy.get(task.logs.btn)
        .should("have.attr", "aria-selected")
        .and("eq", "true");
    });

    it("includes selected tab name in url path", () => {
      cy.visit(taskRoute);
      locationPathEquals(task.logs.route);
    });

    it("updates the url path when another tab is selected", () => {
      cy.visit(taskRoute);
      cy.get(task.tests.btn).click();
      locationPathEquals(task.tests.route);
    });

    it("replaces invalid tab names in url path with default", () => {
      cy.visit(`${taskRoute}/chicken`);
      locationPathEquals(task.logs.route);
    });

    it("clicking away from each tab doesn't crash app", () => {
      cy.visit(task.logs.route);
      cy.get(task.tests.btn).click();
      cy.get("#cy-test-status-select").should("exist");
      cy.get(task.files.btn).click();
      cy.contains("No files found");
      cy.get(task.logs.btn).click();
      cy.contains("No logs");
    });
  });
});
