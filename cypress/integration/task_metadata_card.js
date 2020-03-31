/// <reference types="Cypress" />
import { waitForGQL } from "../utils/networking";
import get from "lodash/get";
const taskId =
  "evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
const taskRoute = `/task/${taskId}`;
const taskRouteWithoutDependsOn = `/task/evergreen_ubuntu1604_test_migrations_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48`;

describe("Task Metadata Card", function() {
  beforeEach(() => {
    cy.server();
    cy.login();
    cy.route("POST", "/graphql/query").as("gqlQuery");
  });

  it("Should show an error message when navigating to a nonexistent task id", () => {
    cy.visit("task/not-real");
    cy.get("[data-cy=metadata-card-error]").should("exist");
  });

  it("Base commit link should have href", () => {
    cy.visit(taskRoute);
    cy.get("[data-cy=base-task-link]").should("have.attr", "href");
  });

  it("Host link should have href", () => {
    cy.visit(taskRoute);
    cy.get("[data-cy=task-host-link]").should("have.attr", "href");
  });

  it("Depends on task should have href", () => {
    cy.visit(taskRoute);
    cy.get("[data-cy=depends-on-link]").should("have.attr", "href");
  });

  [taskRoute, taskRouteWithoutDependsOn].forEach(route => {
    it("Depends on section should be displayed when reliesOn field has length greater than 0 and nonexistent otherwise", () => {
      cy.visit(route);
      const reliesOnPath = "responseBody.data.task.reliesOn";
      waitForGQL("@gqlQuery", "GetTask", {
        [reliesOnPath]: v => v
      }).then(xhr => {
        const dependsOnContainer = cy.get("[data-cy=depends-on-container]");
        if (get(xhr, reliesOnPath, []).length > 0) {
          dependsOnContainer.should("exist");
        } else {
          dependsOnContainer.should("not.exist");
        }
      });
    });
  });
});
