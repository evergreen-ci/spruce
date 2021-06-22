// / <reference types="Cypress" />
import { urlSearchParamsAreUpdated } from "../../utils";

const patch = {
  id: "5e4ff3abe3c3317e352062e4",
};
const path = `/version/${patch.id}`;
const pathTasks = `${path}/tasks`;
const pathURLWithFilters = `${pathTasks}?page=0&sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC&statuses=all,failed,known-issue,success,dispatched,started,undispatched&taskName=test-thirdparty`;

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
      cy.dataCy("clear-all-filters");
      cy.get(`[data-cy=task-status-filter] > .cy-treeselect-bar`).click();
      cy.dataCy("tree-select-options").should("be.visible");
    });
    afterEach(() => {
      cy.get(`[data-cy=task-status-filter] > .cy-treeselect-bar`).click();
      cy.dataCy("tree-select-options").should("not.be.visible");
    });

    it("Clicking on a status filter filters the tasks to only those statuses", () => {
      const preFilterCount = cy.dataCy("current-task-count").invoke("text");

      cy.getInputByLabel("Failed").check({ force: true });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "failed",
      });
      const postFilterCount = cy.dataCy("current-task-count").invoke("text");
      expect(preFilterCount).to.not.eq(postFilterCount);
      cy.getInputByLabel("Success").check({ force: true });
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
        "Known Issue",
        "Success",
        "Unscheduled",
        "Aborted",
      ];
      cy.getInputByLabel("All").check({ force: true });

      taskStatuses.forEach((status) => {
        cy.getInputByLabel(status).should("be.checked");
      });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "all,failed,known-issue,success,unscheduled,aborted",
      });

      cy.getInputByLabel("All").uncheck({ force: true });

      taskStatuses.forEach((status) => {
        cy.getInputByLabel(status).should("not.be.checked");
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
      cy.dataCy("clear-all-filters");
      cy.get(`[data-cy=task-base-status-filter] > .cy-treeselect-bar`).click();
      cy.dataCy("tree-select-options").should("be.visible");
    });
    afterEach(() => {
      cy.get(`[data-cy=task-base-status-filter] > .cy-treeselect-bar`).click();
      cy.dataCy("tree-select-options").should("not.be.visible");
    });

    it("Clicking on a base status filter filters the tasks to only those base statuses", () => {
      const preFilterCount = cy.dataCy("current-task-count").invoke("text");
      cy.getInputByLabel("Running").check({ force: true });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "started",
      });
      const postFilterCount = cy.dataCy("current-task-count").invoke("text");
      expect(preFilterCount).to.not.eq(postFilterCount);
      cy.getInputByLabel("Success").check({ force: true });
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
        "Known Issue",
        "Success",
        "Dispatched",
        "Running",
        "Unscheduled",
      ];
      cy.getInputByLabel("All").check({ force: true });

      taskStatuses.forEach((status) => {
        cy.getInputByLabel(status).should("be.checked");
      });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "all,failed,known-issue,success,dispatched,started,unscheduled",
      });

      cy.getInputByLabel("All").uncheck({ force: true });

      taskStatuses.forEach((status) => {
        cy.getInputByLabel(status).should("not.be.checked");
      });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "",
      });
    });
  });
});
