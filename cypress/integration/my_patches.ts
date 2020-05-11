/// <reference types="Cypress" />
import get from "lodash/get";
import { urlSearchParamsAreUpdated, assertQueryVariables } from "../utils";

const tableRow = "[data-cy=patch-card]";
const MY_PATCHES_ROUTE = "/my-patches";
describe("My Patches Page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.listenGQL();
    cy.visit(MY_PATCHES_ROUTE);
  });

  it("Typing in patch description input updates the url, requests patches and renders patches", () => {
    const inputVal = "testtest";
    cy.dataCy("patch-description-input").type(inputVal);
    urlSearchParamsAreUpdated({
      pathname: MY_PATCHES_ROUTE,
      paramName: "patchName",
      search: inputVal,
    });
    resultsAreFetchedAndRendered({
      queryName: "UserPatches",
      responseName: "userPatches.patches",
      requestVariables: { patchName: inputVal },
      tableRow: "[data-cy=patch-card]",
    });
  });

  it("Searching for a nonexistent patch shows 'No patches found'", () => {
    cy.dataCy("patch-description-input").type("satenarstharienht");
    cy.dataCy("no-patches-found").contains("No patches found");
  });

  // TODO: flakes becuase the gql query is not always tracked
  xit("Clicking the commit queue checkbox updates the URL, requests patches and renders patches", () => {
    cy.dataCy("commit-queue-checkbox").click({ force: true });
    urlSearchParamsAreUpdated({
      pathname: MY_PATCHES_ROUTE,
      paramName: "commitQueue",
      search: "false",
    });
    resultsAreFetchedAndRendered({
      queryName: "UserPatches",
      responseName: "userPatches.patches",
      requestVariables: { includeCommitQueue: (v) => v === false },
      tableRow: "[data-cy=patch-card]",
    });
    cy.dataCy("commit-queue-checkbox").click({ force: true });
    urlSearchParamsAreUpdated({
      pathname: MY_PATCHES_ROUTE,
      paramName: "commitQueue",
      search: "true",
    });
    resultsAreFetchedAndRendered({
      queryName: "UserPatches",
      responseName: "userPatches.patches",
      requestVariables: { includeCommitQueue: (v) => v === true },
      tableRow: "[data-cy=patch-card]",
    });
  });

  describe("Pagination", () => {
    it(`Clicking on page number requests and renders patches for that page`, () => {
      cy.wrap([2, 3]).each((pageNum) => {
        cy.get(`.ant-pagination-item-${pageNum}`).click({ force: true });
        resultsAreFetchedAndRendered({
          queryName: "UserPatches",
          responseName: "userPatches.patches",
          requestVariables: { page: (v) => v === pageNum - 1 },
          tableRow: "[data-cy=patch-card]",
        });
      });
    });
  });

  describe("Clicking on status checkbox requests and renders patches for that status", () => {
    beforeEach(() => {
      cy.preserveCookies();
      cy.listenGQL();
      cy.get("[data-cy=my-patch-status-select] > .cy-treeselect-bar").click();
    });

    const statuses = [
      { display: "Created", key: "created" },
      { display: "Running", key: "started" },
      { display: "Succeeded", key: "succeeded" },
      { display: "Failed", key: "failed" },
    ];

    statuses.forEach(({ display, key }) => {
      it(`Clicking on ${display} status checkbox applies ${key} status and clicking again removes it`, () => {
        clickingCheckboxUpdatesUrlAndRendersFetchedResults({
          checkboxDisplayName: display,
          pathname: MY_PATCHES_ROUTE,
          paramName: "statuses",
          search: key,
          tableRow,
          query: {
            name: "UserPatches",
            responseName: "userPatches.patches",
            checkedRequestVariables: {
              statuses: [key],
            },
            uncheckedRequestVariables: {
              statuses: (v) => Array.isArray(v) && v.length === 0,
            },
          },
        });
      });
    });

    it("Clicking on All status checkbox applies all of the statuses and clicking again removes them", () => {
      clickingCheckboxUpdatesUrlAndRendersFetchedResults({
        checkboxDisplayName: "All",
        pathname: MY_PATCHES_ROUTE,
        paramName: "statuses",
        search: "all,created,started,succeeded,failed",
        tableRow,
        query: {
          name: "UserPatches",
          responseName: "userPatches.patches",
          requestVariables: {
            statuses: statuses.map((s) => s.key),
          },
        },
      });
    });
  });

  describe("Show commit queue checkbox", () => {
    beforeEach(() => {
      cy.preserveCookies();
    });

    it("Should render with Show Commit Queue box checked when commitQueue not indicated in URL query param", () => {
      cy.visit(MY_PATCHES_ROUTE);
      cy.dataCy("commit-queue-checkbox").should("be.checked");
    });

    it("Should render with Show Commit Queue box unchecked when commitQueue is false in URL query param", () => {
      cy.visit(`${MY_PATCHES_ROUTE}?commitQueue=false`);
      cy.dataCy("commit-queue-checkbox").should("not.be.checked");
    });

    it("Should render with Show Commit Queue box checked when commitQueue is true in URL query param", () => {
      cy.visit(`${MY_PATCHES_ROUTE}?commitQueue=true`);
      cy.dataCy("commit-queue-checkbox").should("be.checked");
    });
  });
});

// TODO: These functions were adopted from cypress/utils/index and fixes two issues
// which caused the incorrect query to be tracked. The functions in the util folder
// should be updated as well as any tests that rely on them

const clickingCheckboxUpdatesUrlAndRendersFetchedResults = ({
  selector = ".cy-checkbox",
  checkboxDisplayName,
  pathname,
  paramName,
  search,
  tableRow,
  query: {
    name,
    responseName,
    checkedRequestVariables,
    uncheckedRequestVariables,
  },
}) => {
  cy.get(selector)
    .contains(checkboxDisplayName)
    .as("target")
    .click({ force: true });
  resultsAreFetchedAndRendered({
    queryName: name,
    responseName,
    requestVariables: checkedRequestVariables,
    tableRow,
  }).then(() => urlSearchParamsAreUpdated({ pathname, paramName, search }));
  cy.get("@target").click({ force: true });
  resultsAreFetchedAndRendered({
    queryName: name,
    responseName,
    requestVariables: uncheckedRequestVariables,
    tableRow,
  }).then(() => {
    urlSearchParamsAreUpdated({ pathname, paramName, search: null });
  });
};

const resultsAreFetchedAndRendered = ({
  queryName,
  responseName,
  requestVariables,
  tableRow,
} = {}) => {
  return assertQueryVariables(queryName, requestVariables).then((xhr) => {
    const { response } = xhr;
    const numberOfResults = get(response, `body.data.${responseName}`, [])
      .length;
    if (numberOfResults === 0) {
      cy.get(tableRow).should("not.exist");
    } else {
      cy.get(tableRow)
        .invoke("toArray")
        .then((filteredResults) => {
          expect(filteredResults.length >= numberOfResults).eq(true);
        });
    }
  });
};
