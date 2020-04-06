/// <reference types="Cypress" />
import { waitForGQL } from "../../../utils/networking";

const patch = {
  id: "5e4ff3abe3c3317e352062e4",
};
const path = `/patch/${patch.id}`;
const pathTasks = `${path}/tasks`;
const allStatuses = `all,all-failures,failed,test-timed-out,success,dispatched,started,scheduled,unstarted,undispatched,system-issues,system-failed,setup-failed,blocked`;

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
  beforeEach(() => {
    cy.login();
    cy.server();
    cy.route("POST", "/graphql/query").as("gqlQuery");
    cy.visit(pathTasks);
  });

  describe("Variant input field", () => {
    const variantInputValue = "lint";
    const urlParam = "variant";

    it("Updates url with input value and fetches tasks filtered by variant", () => {
      cy.get("[data-cy=variant-input]").type(variantInputValue);
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: variantInputValue,
      });
      filteredTasksAreFetchedAndRendered(urlParam, variantInputValue);
      cy.get("[data-cy=variant-input]").clear();
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: null,
      });
    });
  });

  describe("Task name input field", () => {
    const taskNameInputValue = "test-cloud";
    const urlParam = "taskName";

    it("Updates url with input value and fetches tasks filtered by task name", () => {
      cy.get("[data-cy=task-name-input]").type(taskNameInputValue);
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: taskNameInputValue,
      });
      filteredTasksAreFetchedAndRendered(urlParam, taskNameInputValue);
      cy.get("[data-cy=task-name-input]").clear();
      urlSearchParamsAreUpdated({
        pathname: pathTasks,
        paramName: urlParam,
        search: null,
      });
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
        clickCheckboxGetTasksUpdateUrl({
          checkboxDisplayName: "All",
          pathname: pathTasks,
          paramName,
          search: allStatuses,
        });
      });

      parentStatuses.forEach(({ title, statuses }) => {
        it(`Clicking on a parent selector '${title}' updates url status param with it and all its children`, () => {
          clickCheckboxGetTasksUpdateUrl({
            checkboxDisplayName: title,
            pathname: pathTasks,
            paramName,
            search: statuses,
          });
        });
      });

      singularStatuses.forEach(({ title, paramValue }) => {
        it(`Clicking on singular status '${title}' updates url status with '${paramValue}'`, () => {
          clickCheckboxGetTasksUpdateUrl({
            checkboxDisplayName: title,
            pathname: pathTasks,
            paramName,
            search: paramValue,
          });
        });
      });
    });
  });
});

const clickCheckboxGetTasksUpdateUrl = ({
  selector = ".cy-checkbox",
  checkboxDisplayName,
  pathname,
  paramName,
  search,
}) => {
  cy.get(selector)
    .contains(checkboxDisplayName)
    .as("target")
    .click();
  filteredTasksAreFetchedAndRendered().then(() =>
    urlSearchParamsAreUpdated({ pathname, paramName, search })
  );
  cy.get("@target").click({ force: true });
  filteredTasksAreFetchedAndRendered().then(() =>
    urlSearchParamsAreUpdated({ pathname, paramName, search: null })
  );
};

const filteredTasksAreFetchedAndRendered = ({
  reqBodyVariable,
  value,
} = {}) => {
  const options = {};
  if (reqBodyVariable && value) {
    options[`request.body.variables[${reqBodyVariable}]`] = value;
  }
  waitForGQL("@gqlQuery", "PatchTasks", options);
  return cy.get("@gqlQuery").then(({ response }) => {
    const numberOfResults = response.body.data.patchTasks.length;
    if (numberOfResults === 0) {
      cy.get(".ant-table-row").should("not.exist");
    } else {
      cy.get(".ant-table-row")
        .invoke("toArray")
        .then((filteredResults) => {
          expect(numberOfResults).eq(filteredResults.length);
        });
    }
  });
};

const urlSearchParamsAreUpdated = ({ pathname, paramName, search }) => {
  cy.location().should((loc) => {
    expect(loc.pathname).to.equal(pathname);
    if (search === null) {
      expect(loc.search).to.not.include(paramName);
    } else {
      expect(loc.search).to.include(search);
    }
  });
};
