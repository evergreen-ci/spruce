/// <reference types="Cypress" />
import {
  clickingCheckboxUpdatesUrlAndRendersFetchedResults,
  urlSearchParamsAreUpdated,
  resultsAreFetchedAndRendered,
} from "../../../utils";

const patch = {
  id: "5e4ff3abe3c3317e352062e4",
};
const path = `/patch/${patch.id}`;
const pathTasks = `${path}/tasks`;
const allStatuses = `all,all-failures,failed,test-timed-out,success,dispatched,started,scheduled,unstarted,undispatched,system-issues,system-failed,setup-failed,blocked`;
const gqlQuery = { name: "PatchTasks", responseName: "patchTasks.tasks" };

const parentStatuses = [
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
];

const singularStatuses = [
  {
    title: "Failed",
    paramValue: "failed",
  },
  {
    title: "Test Timed Out",
    paramValue: "test-timed-out",
  },
  {
    title: "Success",
    paramValue: "success",
  },
  {
    title: "Running",
    paramValue: "dispatched",
  },
  {
    title: "Started",
    paramValue: "started",
  },
  {
    title: "Unstarted",
    paramValue: "unstarted",
  },
  {
    title: "Undispatched",
    paramValue: "undispatched",
  },
  {
    title: "System Failed",
    paramValue: "system-failed",
  },
  {
    title: "Setup Failed",
    paramValue: "setup-failed",
  },
  {
    title: "Blocked",
    paramValue: "blocked",
  },
  {
    title: "Won't Run",
    paramValue: "inactive",
  },
];

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
    const urlParam = "variant";

    it("Updates url with input value and fetches tasks filtered by variant", () => {
      cy.get("[data-cy=variant-input]").type(variantInputValue);
      resultsAreFetchedAndRendered({
        queryName: "PatchTasks",
        responseName: "patchTasks.tasks",
      }).then(() =>
        urlSearchParamsAreUpdated({
          pathname: pathTasks,
          paramName: urlParam,
          search: variantInputValue,
        })
      );
      cy.get("[data-cy=variant-input]").clear();
      resultsAreFetchedAndRendered({
        queryName: "PatchTasks",
        responseName: "patchTasks.tasks",
      }).then(() =>
        urlSearchParamsAreUpdated({
          pathname: pathTasks,
          paramName: urlParam,
          search: null,
        })
      );
    });
  });

  describe("Task name input field", () => {
    const taskNameInputValue = "test-cloud";
    const urlParam = "taskName";

    it("Updates url with input value and fetches tasks filtered by task name", () => {
      cy.get("[data-cy=task-name-input]").type(taskNameInputValue);
      resultsAreFetchedAndRendered({
        queryName: "PatchTasks",
        responseName: "patchTasks.tasks",
      }).then(() =>
        urlSearchParamsAreUpdated({
          pathname: pathTasks,
          paramName: urlParam,
          search: taskNameInputValue,
        })
      );
      cy.get("[data-cy=task-name-input]").clear();
      resultsAreFetchedAndRendered({
        queryName: "PatchTasks",
        responseName: "patchTasks.tasks",
      }).then(() =>
        urlSearchParamsAreUpdated({
          pathname: pathTasks,
          paramName: urlParam,
          search: null,
        })
      );
    });
  });

  [
    {
      filterName: "Statuses",
      dataCy: "task-status-filter",
      paramName: "statuses",
    },
    {
      filterName: "Base Statuses",
      dataCy: "task-base-status-filter",
      paramName: "baseStatuses",
    },
  ].forEach(({ filterName, dataCy, paramName }) => {
    describe(`${filterName} select`, () => {
      beforeEach(() => {
        cy.get(`[data-cy=${dataCy}] > .cy-treeselect-bar`).click();
      });

      it("Clicking on 'All' checkbox adds all statuses to URL. Clicking again removes all statuses.", () => {
        clickingCheckboxUpdatesUrlAndRendersFetchedResults({
          checkboxDisplayName: "All",
          pathname: pathTasks,
          paramName,
          search: allStatuses,
          query: gqlQuery,
        });
      });

      parentStatuses.forEach(({ title, statuses }) => {
        it(`Clicking on a parent selector '${title}' updates url status param with it and all its children`, () => {
          clickingCheckboxUpdatesUrlAndRendersFetchedResults({
            checkboxDisplayName: title,
            pathname: pathTasks,
            paramName,
            search: statuses,
            query: gqlQuery,
          });
        });
      });

      singularStatuses.forEach(({ title, paramValue }) => {
        it(`Clicking on singular status '${title}' updates url status with '${paramValue}'`, () => {
          clickingCheckboxUpdatesUrlAndRendersFetchedResults({
            checkboxDisplayName: title,
            pathname: pathTasks,
            paramName,
            search: paramValue,
            query: gqlQuery,
          });
        });
      });
    });
  });
});
