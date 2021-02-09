// / <reference types="Cypress" />
// / <reference path="../support/index.d.ts" />

import get from "lodash/get";
import { elementExistenceCheck } from "../utils";

const taskId =
  "evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
const taskRoute = `/task/${taskId}`;
const taskRouteWithoutDependsOn = `/task/evergreen_ubuntu1604_test_migrations_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48`;

describe("Task Metadata Card", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.listenGQL();
    cy.preserveCookies();
  });

  it("Should show an error message when navigating to a nonexistent task id", () => {
    cy.visit("task/not-real");
    cy.dataCy("toast").should("exist");
  });

  it("Base commit link should have href", () => {
    cy.visit(taskRoute);
    cy.get("[data-cy=base-task-link]").should("have.attr", "href");
  });

  it("Host link should have href", () => {
    cy.visit(taskRoute);
    cy.get("[data-cy=task-host-link]").should("have.attr", "href");
  });

  it("Duration and Base commit duration labels have correct values", () => {
    cy.visit(taskRoute);
    cy.dataCy("task-metadata-base-commit-duration").contains("1m 31s");
    cy.dataCy("task-metadata-duration").contains("1m 6s");
  });

  it("Depends on task should have href", () => {
    cy.visit(taskRoute);
    cy.get("[data-cy=depends-on-link]")
      .should("have.attr", "href")
      .and("include", "/task");
  });

  [taskRoute, taskRouteWithoutDependsOn].forEach((route) => {
    it("Depends On section should be displayed when reliesOn field has length greater than 0 and nonexistent otherwise", () => {
      cy.visit(route);
      const reliesOnPath = "responseBody.data.task.reliesOn";
      cy.waitForGQL("GetTask", {
        [reliesOnPath]: (v) => !!v,
      }).then((xhr) => {
        const dependsOnContainer = cy.get("[data-cy=depends-on-container]");
        if (get(xhr, reliesOnPath, []).length > 0) {
          dependsOnContainer.should("exist");
        } else {
          dependsOnContainer.should("not.exist");
        }
      });
    });
  });

  [taskRoute, taskRouteWithoutDependsOn].forEach((route, i) => {
    it(`Date labels in the Depends On sections have text if their data in the GetTask GQL response exists, otherwise the date labels are empty (route ${
      i + 1
    })`, () => {
      cy.visit(route);
      const ingestTimePath = "responseBody.data.task.ingestTime";
      const startTimePath = "responseBody.data.task.startTime";
      const finishTimePath = "responseBody.data.task.finishTime";

      const valExists = (v) => v !== undefined;
      // wait for gql query where the 3 time fields were requested
      cy.waitForGQL("GetTask", {
        [ingestTimePath]: valExists,
        [startTimePath]: valExists,
        [finishTimePath]: valExists,
      }).then((xhr) => {
        elementExistenceCheck(
          xhr,
          ingestTimePath,
          "task-metadata-submitted-at"
        );
        elementExistenceCheck(xhr, startTimePath, "task-metadata-started");
        elementExistenceCheck(xhr, finishTimePath, "task-metadata-finished");
      });
    });
  });

  [taskRoute, taskRouteWithoutDependsOn].forEach((route, i) => {
    it(`Then "Spawn host" link is shown with href when the spawnHostLink field in the GetTask GQL response exists, otherwise the "Spawn host" link is not shown (route ${
      i + 1
    })`, () => {
      cy.visit(route);
      const spawnHostLinkPath = "responseBody.data.task.spawnHostLink";
      const valExists = (v) => v !== undefined;
      cy.waitForGQL("GetTask", {
        [spawnHostLinkPath]: valExists,
      }).then((xhr) => {
        const exists = elementExistenceCheck(
          xhr,
          spawnHostLinkPath,
          "task-spawn-host-link",
          "exist",
          "not.exist"
        );
        if (exists) {
          cy.dataCy("task-spawn-host-link").should("have.attr", "href");
        }
      });
    });
  });
});
