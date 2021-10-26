// / <reference types="Cypress" />
import { urlSearchParamsAreUpdated } from "../../utils";

const patch = {
  id: "5e4ff3abe3c3317e352062e4",
};
const path = `/version/${patch.id}`;
const pathTasks = `${path}/tasks`;
const pathURLWithFilters = `${pathTasks}?page=0&sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC&statuses=failed,success,running-umbrella,dispatched,started&taskName=test-thirdparty&variant=ubuntu`;
const defaultPath = `${pathTasks}?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC`;

describe("Tasks filters", () => {
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    cy.preserveCookies();
  });
  afterEach(() => {
    cy.dataCy("tasks-table").should("exist");
  });

  it("Should clear any filters with the Clear All Filters button and reset the table to its default state", () => {
    cy.visit(pathURLWithFilters);
    cy.dataCy("dismiss-sitewide-banner-button").click();

    cy.dataCy("tasks-table").should("exist");
    cy.dataCy("clear-all-filters").click();
    cy.location().should((loc) => {
      expect(loc.href).to.equal(loc.origin + defaultPath);
    });
    cy.toggleTableFilter(1);
    cy.dataCy("taskname-input-wrapper")
      .find("input")
      .invoke("val")
      .should("be.empty");
    cy.toggleTableFilter(2);
    cy.dataCy("status-treeselect")
      .get('input[type="checkbox"]')
      .should("not.be.checked");
    cy.toggleTableFilter(3);
    cy.dataCy("base-status-treeselect")
      .get('input[type="checkbox"]')
      .should("not.be.checked");
    cy.toggleTableFilter(4);
    cy.dataCy("variant-input-wrapper")
      .find("input")
      .invoke("val")
      .should("be.empty");
  });

  describe("Variant input field", () => {
    const variantInputValue = "lint";
    const urlParam = "variant";
    it("Updates url with input value and fetches tasks filtered by variant", () => {
      cy.dataCy("variant-input-wrapper")
        .find("input")
        .focus()
        .type(`${variantInputValue}{enter}`);
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: variantInputValue,
      });
      cy.toggleTableFilter(4);
      cy.dataCy("current-task-count").should("contain.text", 2);
      cy.dataCy("variant-input-wrapper")
        .find("input")
        .focus()
        .clear()
        .type(`{enter}`);
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
      cy.toggleTableFilter(1);
      cy.dataCy("taskname-input-wrapper")
        .find("input")
        .focus()
        .type(`${taskNameInputValue}{enter}`);
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: taskNameInputValue,
      });
      cy.toggleTableFilter(1);
      cy.dataCy("taskname-input-wrapper")
        .find("input")
        .focus()
        .clear()
        .type(`{enter}`);
      cy.toggleTableFilter(1);
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: null,
      });
    });
  });

  describe("Task Statuses select", () => {
    const urlParam = "statuses";
    before(() => {
      cy.contains("Clear All Filters").click();
      cy.toggleTableFilter(2);
    });

    it("Clicking on a status filter filters the tasks to only those statuses", () => {
      const preFilterCount = cy.dataCy("current-task-count").invoke("text");

      cy.getInputByLabel("Failed").check({ force: true });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "failed",
      });
      cy.toggleTableFilter(2);
      const postFilterCount = cy.dataCy("current-task-count").invoke("text");
      expect(preFilterCount).to.not.eq(postFilterCount);
      cy.toggleTableFilter(2);
      cy.getInputByLabel("Succeeded").check({ force: true });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "failed-umbrella,failed,known-issue,success",
      });
      const multiFilterCount = cy.dataCy("current-task-count").invoke("text");

      expect(postFilterCount).to.not.eq(multiFilterCount);
    });

    it("Clicking on 'All' checkbox adds all the statuses and clicking again removes them", () => {
      const taskStatuses = [
        "All",
        "Failed",
        "Known Issue",
        "Succeeded",
        "Running",
        "Will Run",
        "Aborted",
        "Blocked",
      ];
      cy.toggleTableFilter(2);
      cy.getInputByLabel("All").check({ force: true });
      taskStatuses.forEach((status) => {
        cy.getInputByLabel(status).should("be.checked");
      });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "all",
      });
      cy.toggleTableFilter(2);
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

  describe("Task Base Statuses select", () => {
    const urlParam = "baseStatuses";
    before(() => {
      cy.visit(pathTasks);
      cy.toggleTableFilter(3);
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
      cy.getInputByLabel("Succeeded").check({ force: true });
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "started,success",
      });
      const multiFilterCount = cy.dataCy("current-task-count").invoke("text");

      expect(postFilterCount).to.not.eq(multiFilterCount);
    });

    it("Clicking on 'All' checkbox adds all the base statuses and clicking again removes them", () => {
      cy.toggleTableFilter(3);
      const taskStatuses = [
        "All",
        "Failed",
        "Known Issue",
        "Succeeded",
        "Running",
        "Will Run",
        "Undispatched",
        "Aborted",
        "Blocked",
      ];
      cy.getInputByLabel("All").check({ force: true });
      taskStatuses.forEach((status) => {
        cy.getInputByLabel(status).should("be.checked");
      });

      cy.toggleTableFilter(3);
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search:
          "all,failed-umbrella,failed,known-issue,success,started,will-run,undispatched-umbrella,aborted,blocked",
      });

      cy.getInputByLabel("All").uncheck({ force: true });
      taskStatuses.forEach((status) => {
        cy.getInputByLabel(status).should("not.be.checked");
      });
      cy.toggleTableFilter(3);

      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "",
      });
    });
  });
});
