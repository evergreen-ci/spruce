/// <reference types="Cypress" />
import { waitForGQL } from "../../../utils/networking";

const patch = {
  id: "5e4ff3abe3c3317e352062e4",
};
const path = `/patch/${patch.id}`;
const pathTasks = `${path}/tasks`;
const allStatuses = `all,all-failures,failed,test-timed-out,success,dispatched,started,scheduled,unstarted,undispatched,system-issues,system-failed,setup-failed,blocked`;

describe("Tasks filters", function() {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.listenGQL();
    cy.preserveCookies();
    cy.visit(pathTasks);
  });

  describe("Variant input field", () => {
    const variantInputValue = "lint";
    it("Updates url with input value and fetches tasks filtered by variant", () => {
      cy.get("[data-cy=variant-input]").type(variantInputValue);
      locationHasUpdatedFilterParam(variantInputValue, "variant");
      filteredTasksAreFetched("variant", variantInputValue);
      cy.get("[data-cy=variant-input]").clear();
      locationHasUpdatedFilterParam(null);
    });
  });

  describe("Task name input field", () => {
    const taskNameInputValue = "test-cloud";
    it("Updates url with input value and fetches tasks filtered by task name", () => {
      cy.get("[data-cy=task-name-input]").type(taskNameInputValue);
      locationHasUpdatedFilterParam(taskNameInputValue, "taskName");
      filteredTasksAreFetched("taskName", taskNameInputValue);
      cy.get("[data-cy=variant-input]").clear();
      locationHasUpdatedFilterParam(null);
    });
  });

  describe("Statuses select", () => {
    beforeEach(() => {
      cy.get("[data-cy=task-status-filter] > .cy-treeselect-bar").click();
    });

    it("Clicking on 'All' checkbox adds all statuses to URL. Clicking again removes all statuses.", () => {
      cy.get(".cy-checkbox")
        .contains("All")
        .then(($all) => {
          $all.click();
          locationHasUpdatedFilterParam(allStatuses, "statuses");
          $all.click();
          locationHasUpdatedFilterParam(null);
        });
    });

    [
      {
        title: "Failures",
        statuses: "all-failures,failed,test-timed-out",
      },
      {
        title: "Scheduled",
        statuses: "scheduled,unstarted,undispatched",
      },
      {
        title: "System Issues",
        statuses: "system-issues,system-failed",
      },
    ].forEach(({ title, statuses }) => {
      it(`Clicking on a parent selector '${title}' updates url status param with it and all its children`, () => {
        clickCheckboxesAndAssertCorrectUrlParams(title, statuses);
      });
    });

    [
      {
        title: "Failed",
        key: "failed",
      },
      {
        title: "Test Timed Out",
        key: "test-timed-out",
      },
      {
        title: "Success",
        key: "success",
      },
      {
        title: "Running",
        key: "dispatched",
      },
      {
        title: "Started",
        key: "started",
      },
      {
        title: "Unstarted",
        key: "unstarted",
      },
      {
        title: "Undispatched",
        key: "undispatched",
      },
      {
        title: "System Failed",
        key: "system-failed",
      },
      {
        title: "Setup Failed",
        key: "setup-failed",
      },
      {
        title: "Blocked",
        key: "blocked",
      },
    ].forEach(({ title, key }) => {
      it(`Clicking on singular statuses '${title}' updates url status with '${key}'`, () => {
        clickCheckboxesAndAssertCorrectUrlParams(title, key);
      });
    });
  });
});

const clickCheckboxesAndAssertCorrectUrlParams = (checkboxTitle, urlStatus) => {
  cy.get(".cy-checkbox")
    .contains(checkboxTitle)
    .then(($status) => {
      $status.click();
      locationHasUpdatedFilterParam(urlStatus, "statuses");
      $status.click();
      locationHasUpdatedFilterParam(null);
    });
};

const filteredTasksAreFetched = (variable, value) => {
  cy.waitForGQL("PatchTasks", {
    [`request.body.variables[${variable}`]: value,
  });
  cy.get("@gqlQuery").then(({ response }) => {
    cy.get(".ant-table-row")
      .invoke("toArray")
      .then((filteredResults) => {
        expect(response.body.data.patchTasks.length).eq(filteredResults.length);
      });
  });
};

const locationHasUpdatedFilterParam = (paramValue, filterName) => {
  cy.location().should((loc) => {
    expect(loc.pathname).to.equal(pathTasks);
    if (!paramValue) {
      expect(loc.search).to.not.include(filterName);
    } else {
      expect(loc.search).to.include(`${filterName}=${paramValue}`);
    }
  });
};
