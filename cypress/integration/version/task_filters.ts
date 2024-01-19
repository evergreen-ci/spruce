import { urlSearchParamsAreUpdated, waitForTaskTable } from "../../utils";

const patch = {
  id: "5e4ff3abe3c3317e352062e4",
};
const pathTasks = `/version/${patch.id}/tasks`;
const pathURLWithFilters = `${pathTasks}?page=0&sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC&statuses=failed,success,running-umbrella,dispatched,started&taskName=test-thirdparty&variant=ubuntu`;
const defaultPath = `${pathTasks}?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC`;

describe("Tasks filters", () => {
  it("Should clear any filters with the Clear All Filters button and reset the table to its default state", () => {
    cy.visit(pathURLWithFilters);
    waitForTaskTable();
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
      cy.visit(defaultPath);
      waitForTaskTable();
      cy.toggleTableFilter(4);
      cy.dataCy("variant-input-wrapper")
        .find("input")
        .focus()
        .type(variantInputValue)
        .type("{enter}", { scrollBehavior: false });
      cy.dataCy("variant-input-wrapper").should("not.be.visible");
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: variantInputValue,
      });
      waitForTaskTable();
      cy.dataCy("filtered-count").should("contain.text", 2);

      cy.toggleTableFilter(4);
      cy.dataCy("variant-input-wrapper")
        .find("input")
        .focus()
        .clear()
        .type("{enter}", { scrollBehavior: false });
      cy.dataCy("variant-input-wrapper").should("not.be.visible");
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: null,
      });
      waitForTaskTable();
      cy.dataCy("filtered-count").should("contain.text", 46);
    });
  });

  describe("Task name input field", () => {
    const taskNameInputValue = "test-cloud";
    const urlParam = "taskName";
    it("Updates url with input value and fetches tasks filtered by task name", () => {
      cy.visit(defaultPath);
      waitForTaskTable();
      cy.toggleTableFilter(1);
      cy.dataCy("taskname-input-wrapper")
        .find("input")
        .focus()
        .type(taskNameInputValue)
        .type("{enter}", { scrollBehavior: false });
      cy.dataCy("taskname-input-wrapper").should("not.be.visible");
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: taskNameInputValue,
      });
      waitForTaskTable();
      cy.dataCy("filtered-count").should("contain.text", 1);

      cy.toggleTableFilter(1);
      cy.dataCy("taskname-input-wrapper")
        .find("input")
        .focus()
        .clear()
        .type("{enter}", { scrollBehavior: false });
      cy.dataCy("taskname-input-wrapper").should("not.be.visible");
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: null,
      });
      waitForTaskTable();
      cy.dataCy("filtered-count").should("contain.text", 46);
    });
  });

  describe("Task Statuses select", () => {
    const urlParam = "statuses";
    beforeEach(() => {
      cy.visit(defaultPath);
      waitForTaskTable();
      cy.toggleTableFilter(2);
    });

    it("Clicking on a status filter filters the tasks to only those statuses", () => {
      cy.dataCy("filtered-count")
        .invoke("text")
        .then((preFilterCount) => {
          selectCheckboxOption("Failed", true);
          urlSearchParamsAreUpdated({
            pathname: pathTasks,
            paramName: urlParam,
            search: "failed",
          });
          waitForTaskTable();
          cy.dataCy("filtered-count").should("have.text", 2);

          cy.dataCy("filtered-count")
            .invoke("text")
            .then((postFilterCount) => {
              cy.dataCy("filtered-count").should(
                "not.have.text",
                preFilterCount,
              );
              selectCheckboxOption("Succeeded", true);
              urlSearchParamsAreUpdated({
                pathname: pathTasks,
                paramName: urlParam,
                search: "failed-umbrella,failed,known-issue,success",
              });
              waitForTaskTable();
              cy.dataCy("filtered-count").should(
                "not.have.text",
                postFilterCount,
              );
            });
        });
    });

    it("Clicking on 'All' checkbox adds all the statuses and clicking again removes them", () => {
      const taskStatuses = [
        "All",
        "Failed / Timed Out",
        "Failed",
        "Known Issue",
        "Succeeded",
        "Running",
        "Will Run",
        "Dispatched",
        "Undispatched",
        "Aborted",
        "Blocked",
      ];
      selectCheckboxOption("All", true);
      assertChecked(taskStatuses, true);
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "all",
      });
      waitForTaskTable();

      selectCheckboxOption("All", false);
      assertChecked(taskStatuses, false);
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: null,
      });
    });
  });

  describe("Task Base Statuses select", () => {
    const urlParam = "baseStatuses";
    beforeEach(() => {
      cy.visit(defaultPath);
      waitForTaskTable();
      cy.toggleTableFilter(3);
    });

    it("Clicking on a base status filter filters the tasks to only those base statuses", () => {
      // All tasks have a base status of succeeded for this version.
      cy.dataCy("filtered-count")
        .invoke("text")
        .then((preFilterCount) => {
          selectCheckboxOption("Succeeded", true);
          urlSearchParamsAreUpdated({
            pathname: pathTasks,
            paramName: urlParam,
            search: "success",
          });
          waitForTaskTable();

          cy.dataCy("filtered-count").should("have.text", 44);
          selectCheckboxOption("Succeeded", false);
          urlSearchParamsAreUpdated({
            pathname: pathTasks,
            paramName: urlParam,
            search: null,
          });
          waitForTaskTable();
          cy.dataCy("filtered-count").should("have.text", preFilterCount);
        });
    });

    it("Clicking on 'All' checkbox adds all the base statuses and clicking again removes them", () => {
      const taskStatuses = ["All", "Succeeded", "Running"];
      selectCheckboxOption("All", true);
      assertChecked(taskStatuses, true);
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: "all",
      });
      waitForTaskTable();

      selectCheckboxOption("All", false);
      assertChecked(taskStatuses, false);
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: null,
      });
    });
  });
});

/**
 * Function used to assert if checkboxes with certain labels are checked or unchecked.
 * @param statuses list of labels to assert on
 * @param checked true if should be checked, false if should be unchecked
 */
const assertChecked = (statuses: string[], checked: boolean) => {
  cy.get(":not(.ant-dropdown-hidden) > .ant-table-filter-dropdown")
    .find(".cy-checkbox")
    .each((el) => {
      expect(statuses).to.include(el.text());
      if (checked) {
        cy.wrap(el).find('input[type="checkbox"]').should("be.checked");
      } else {
        cy.wrap(el).find('input[type="checkbox"]').should("not.be.checked");
      }
    });
};

/**
 * Function used to select a checkbox option from the table filter dropdown.
 * Only the first checkbox whose label is a match (i.e. the umbrella group name) will be checked.
 * @param label label of the checkbox option to click on
 * @param checked true if should be checked, false if should be unchecked
 */
const selectCheckboxOption = (label: string, checked: boolean) => {
  cy.get(":not(.ant-dropdown-hidden) > .ant-table-filter-dropdown")
    .find(".cy-checkbox")
    .should("not.be.disabled")
    .each((el) => {
      if (el.text() === label) {
        if (checked) {
          cy.wrap(el)
            .find('input[type="checkbox"]')
            .check({ force: true, scrollBehavior: false });
        } else {
          cy.wrap(el)
            .find('input[type="checkbox"]')
            .uncheck({ force: true, scrollBehavior: false });
        }
        return false;
      }
    });
};
