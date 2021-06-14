// / <reference types="Cypress" />
import { urlSearchParamsAreUpdated } from "../../utils";

const patch = {
  id: "5e4ff3abe3c3317e352062e4",
};
const path = `/version/${patch.id}`;
const pathTasks = `${path}/tasks`;
const pathURLWithFilters = `${pathTasks}?page=0&sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC&statuses=all,failed,success,dispatched,started,undispatched&taskName=test-thirdparty`;

describe("Tasks filters", () => {
  before(() => {
    cy.login();
    cy.visit(pathTasks);
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  afterEach(() => {
    cy.dataCy("clear-all-filters").click();
  });

  it("Should clear any filters with the Clear All Filters button and reset the table to its default state", () => {
    cy.visit(pathURLWithFilters);
    cy.location().should((loc) => {
      expect(loc.href).to.equal(loc.origin + pathURLWithFilters);
    });
    cy.dataCy("clear-all-filters").click();
    cy.location().should((loc) => {
      expect(loc.href).to.equal(loc.origin + pathTasks);
    });
  });

  describe("Variant input field", () => {
    const variantInputValue = "lint";
    const urlParam = "variant";
    it("Updates url with input value and fetches tasks filtered by variant", () => {
      cy.dataCy("variant-input").type(variantInputValue);

      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: variantInputValue,
      });
      cy.dataCy("current-task-count").should("contain.text", 2);
      cy.dataCy("variant-input").clear();
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: null,
      });
      cy.dataCy("current-task-count").should("contain.text", 50);
    });
  });

  describe("Task name input field", () => {
    before(() => {
      cy.login();
    });

    beforeEach(() => {
      cy.preserveCookies();
    });

    const taskNameInputValue = "test-cloud";
    const urlParam = "taskName";

    it("Updates url with input value and fetches tasks filtered by task name", () => {
      cy.dataCy("task-name-input").type(taskNameInputValue);

      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: taskNameInputValue,
      });
      cy.dataCy("task-name-input").clear();
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: null,
      });
    });
  });

  describe(`Task Statuses select`, () => {
    const urlParam = "statuses";
    beforeEach(() => {
      cy.get(`[data-cy=task-status-filter] > .cy-treeselect-bar`).click();
    });
    afterEach(() => {
      cy.get(`[data-cy=task-status-filter] > .cy-treeselect-bar`).click();
    });

    it("Clicking on a status filter filters the tasks to only those statuses", () => {
      const preFilterCount = cy.dataCy("current-task-count").invoke("text");

      cy.get("label").contains("Failed").click({ force: true });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "failed",
      });
      const postFilterCount = cy.dataCy("current-task-count").invoke("text");
      expect(preFilterCount).to.not.eq(postFilterCount);
      cy.get("label").contains("Success").click({ force: true });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "failed,success",
      });
      const multiFilterCount = cy.dataCy("current-task-count").invoke("text");

      expect(postFilterCount).to.not.eq(multiFilterCount);
    });
    it("Clicking on 'All' checkbox adds all the statuses and clicking again removes them", () => {
      const taskStatuses = [
        "All",
        "Failed",
        "Success",
        "Unscheduled",
        "Setup Failed",
        "Aborted",
      ];
      cy.get("label").contains("All").click({ force: true });

      taskStatuses.forEach((status) => {
        cy.get(".cy-checkbox")
          .should("contain.text", status)
          .as("checkbox-label");
        cy.get("@checkbox-label").within(() =>
          cy.dataCy("checkbox").should("have.attr", "aria-checked", "true")
        );
      });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search:
          "all,failed,success,dispatched,started,unscheduled,will-run,setup-failed,aborted",
      });

      cy.get("label").contains("All").click({ force: true });

      taskStatuses.forEach((status) => {
        cy.get(".cy-checkbox")
          .should("contain.text", status)
          .as("checkbox-label");
        cy.get("@checkbox-label").within(() =>
          cy.dataCy("checkbox").should("have.attr", "aria-checked", "false")
        );
      });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "",
      });
    });
  });

  describe(`Task Base Statuses select`, () => {
    const urlParam = "baseStatuses";
    beforeEach(() => {
      cy.get(`[data-cy=task-base-status-filter] > .cy-treeselect-bar`).click();
    });
    afterEach(() => {
      cy.get(`[data-cy=task-base-status-filter] > .cy-treeselect-bar`).click();
    });

    it("Clicking on a base status filter filters the tasks to only those base statuses", () => {
      const preFilterCount = cy.dataCy("current-task-count").invoke("text");
      cy.get("label").contains("Running").click({ force: true });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "started",
      });
      const postFilterCount = cy.dataCy("current-task-count").invoke("text");
      expect(preFilterCount).to.not.eq(postFilterCount);
      cy.get("label").contains("Success").click({ force: true });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "started,success",
      });
      const multiFilterCount = cy.dataCy("current-task-count").invoke("text");

      expect(postFilterCount).to.not.eq(multiFilterCount);
    });
    it("Clicking on 'All' checkbox adds all the base statuses and clicking again removes them", () => {
      const taskStatuses = [
        "All",
        "Failed",
        "Success",
        "Dispatched",
        "Running",
        "Unscheduled",
      ];
      cy.get("label").contains("All").click({ force: true });

      taskStatuses.forEach((status) => {
        cy.get(".cy-checkbox")
          .should("contain.text", status)
          .as("checkbox-label");
        cy.get("@checkbox-label").within(() =>
          cy.dataCy("checkbox").should("have.attr", "aria-checked", "true")
        );
      });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "all,failed,success,dispatched,started,unscheduled",
      });

      cy.get("label").contains("All").click({ force: true });

      taskStatuses.forEach((status) => {
        cy.get(".cy-checkbox")
          .should("contain.text", status)
          .as("checkbox-label");
        cy.get("@checkbox-label").within(() =>
          cy.dataCy("checkbox").should("have.attr", "aria-checked", "false")
        );
      });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "",
      });
    });
  });
});
