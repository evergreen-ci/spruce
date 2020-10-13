import get from "lodash/get";
import { elementExistenceCheck } from "../utils";

const patchId = "5e4ff3abe3c3317e352062e4";
const patchRoute = `/version/${patchId}`;
const patch = {
  changes: { route: `${patchRoute}/changes`, btn: "button[id=changes-tab]" },
  tasks: { route: `${patchRoute}/tasks`, btn: "button[id=task-tab]" },
};
const taskId =
  "evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
const taskRoute = `/task/${taskId}`;
const taskRouteNoFailedTests =
  "task/evergreen_ubuntu1604_test_auth_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";

const task = {
  logs: { route: `${taskRoute}/logs`, btn: "button[id=task-logs-tab]" },
  tests: { route: `${taskRoute}/tests`, btn: "button[id=task-tests-tab]" },
  files: { route: `${taskRoute}/files`, btn: "button[id=task-files-tab]" },
};

const locationPathEquals = (path) =>
  cy.location().should((loc) => expect(loc.pathname).to.eq(path));

describe("Tabs", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.listenGQL();
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

    it("updates the url path when another tab is selected", () => {
      cy.visit(patchRoute);
      cy.get(patch.changes.btn).click();
      locationPathEquals(patch.changes.route);
    });

    it("replaces invalid tab names in url path with default", () => {
      cy.visit(`${patchRoute}/chicken`);
      locationPathEquals(patch.tasks.route);
    });

    it("clicking away from each tab doesn't crash app", () => {
      cy.visit(patchRoute);
      cy.get(patch.changes.btn).click();
      cy.get("[data-cy=code-changes]").should("exist");
      cy.get(patch.tasks.btn).click();
      cy.dataCy("total-task-count").should("exist");
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
      locationPathEquals(task.tests.route);
    });

    it("updates the url path when another tab is selected", () => {
      cy.visit(taskRoute);
      cy.get(task.tests.btn).click();
      locationPathEquals(task.tests.route);
    });

    it("replaces invalid tab names in url path with default", () => {
      cy.visit(`${taskRoute}/chicken`);
      locationPathEquals(task.tests.route);
    });

    it("clicking away from each tab doesn't crash app", () => {
      cy.visit(task.logs.route);
      cy.get(task.tests.btn).click();
      cy.get("[data-cy=test-status-select]").should("exist");
      cy.get(task.files.btn).click();
      cy.contains("No files found");
      cy.get(task.logs.btn).click();
      cy.contains("No logs");
    });

    [taskRoute, taskRouteNoFailedTests].forEach((route, i) => {
      it(`Should display a badge with the number of failed tests in the Test tab if the failedTestCount field from the Task gql query is above 0 (${i +
        1})`, () => {
        cy.visit(route);
        const failedTestCountPath = "responseBody.data.task.failedTestCount";
        cy.waitForGQL("GetTask", {
          [failedTestCountPath]: valExists,
        }).then((xhr) => {
          const exists = elementExistenceCheck(
            xhr,
            failedTestCountPath,
            "test-tab-badge",
            "exist",
            "not.exist"
          );
          if (exists) {
            cy.dataCy("test-tab-badge").contains(get(xhr, failedTestCountPath));
          }
        });
      });
    });

    it("Should display a badge with the number of files in the Files tab", () => {
      cy.visit(taskRoute);
      const fileCountPath = "responseBody.data.taskFiles.fileCount";
      cy.waitForGQL("GetTask", {
        [fileCountPath]: valExists,
      });
      cy.dataCy("files-tab-badge").contains("0");
    });
  });
});

const valExists = (v) => v !== undefined;
