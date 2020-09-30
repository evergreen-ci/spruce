// / <reference types="Cypress" />
import get from "lodash/get";
import {
  urlSearchParamsAreUpdated,
  assertQueryVariables,
  clickOnPageBtnAndAssertURLandTableResults,
  clickOnPageSizeBtnAndAssertURLandTableSize,
} from "../utils";

const tableRow = "[data-cy=patch-card]";
const MY_PATCHES_ROUTE = "/user/admin/patches";
const BOB_HICKS_PATCHES_ROUTE = "/user/bob.hicks/patches";
const REGULAR_USER_PATCHES_ROUTE = "/user/regular/patches";

describe("My Patches Page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.listenGQL();
  });

  it("Redirects user to user patches route from `/user/:id`", () => {
    cy.visit("user/chicken");
    cy.location().should((loc) =>
      expect(loc.pathname).to.eq("/user/chicken/patches")
    );
  });

  it("The page title should be 'My Patches' when viewing the logged in users' patches page", () => {
    cy.visit(MY_PATCHES_ROUTE);
    cy.contains("My Patches").should("exist");
  });

  it("The page title should be 'Bob Hicks' Patches' when viewing Bob Hicks' patches page", () => {
    cy.visit(BOB_HICKS_PATCHES_ROUTE);
    cy.contains("Bob Hicks' Patches").should("exist");
  });

  it("The page title should be 'Regular User's Patches' when viewing Regular Users's patches page", () => {
    cy.visit(REGULAR_USER_PATCHES_ROUTE);
    cy.contains("Regular User's Patches").should("exist");
  });

  it("Typing in patch description input updates the url, requests patches and renders patches", () => {
    cy.visit(MY_PATCHES_ROUTE);
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
    cy.visit(MY_PATCHES_ROUTE);
    cy.dataCy("patch-description-input").type("satenarstharienht");
    cy.dataCy("no-patches-found").contains("No patches found");
  });

  it("Build status icon should link to version page with appropiate filters", () => {
    cy.visit(MY_PATCHES_ROUTE);
    cy.dataCy("build-status-icon-link")
      .first()
      .should("have.attr", "href")
      .and(
        "equals",
        "/version/5ecedafb562343215a7ff297/tasks?variant=ubuntu1604"
      );
  });

  it("Clicking the commit queue checkbox updates the URL, requests patches and renders patches", () => {
    cy.visit(MY_PATCHES_ROUTE);
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

  describe("Changing page number and page size", () => {
    it("Displays the next page of results and updates URL when right arrow is clicked and next page exists", () => {
      cy.login();
      cy.visit(MY_PATCHES_ROUTE);
      clickOnPageBtnAndAssertURLandTableResults(
        dataCyNextPage,
        secondPageDisplayNames,
        1,
        dataCyTableRows
      );
    });

    it("Displays the previous page of results and updates URL when the left arrow is clicked and previous page exists", () => {
      clickOnPageBtnAndAssertURLandTableResults(
        dataCyPrevPage,
        firstPageDisplayNames,
        0,
        dataCyTableRows
      );
    });

    it("Does not update results or URL when left arrow is clicked and previous page does not exist", () => {
      clickOnPageBtnAndAssertURLandTableResults(
        dataCyPrevPage,
        firstPageDisplayNames,
        0,
        dataCyTableRows
      );
    });

    it("Does not update results or URL when right arrow is clicked and next page does not exist", () => {
      cy.visit(`${MY_PATCHES_ROUTE}?page=2`);
      clickOnPageBtnAndAssertURLandTableResults(
        dataCyNextPage,
        thirdPageDisplayNames,
        2,
        dataCyTableRows
      );
    });

    it("Changing page size updates URL and renders less than or equal to that many rows ", () => {
      cy.wrap([20, 10, 50, 100]).each((pageSize) => {
        clickOnPageSizeBtnAndAssertURLandTableSize(
          pageSize,
          "[data-test-id=my-patches-page-size-selector]",
          `[data-test-id=my-patches-page-size-selector-${pageSize}]`,
          dataCyTableRows
        );
      });
    });
  });

  describe("Clicking on status checkbox requests and renders patches for that status", () => {
    beforeEach(() => {
      cy.preserveCookies();
      cy.listenGQL();
      cy.get("[data-cy=my-patch-status-select] > .cy-treeselect-bar").click();
    });
    before(() => {
      cy.visit(MY_PATCHES_ROUTE);
    });

    const statuses = [
      { display: "Created", key: "created" },
      { display: "Running", key: "started" },
      { display: "Succeeded", key: "succeeded" },
      { display: "Failed", key: "failed" },
    ];

    it(`Clicking on a status checkbox applies the status and clicking again removes it`, () => {
      cy.wrap(statuses).each(({ display, key }) => {
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
      cy.get("[data-cy=my-patch-status-select] > .cy-treeselect-bar").click();
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

const dataCyNextPage =
  "[data-test-id=my-patches-pagination] > .ant-pagination-next";
const dataCyPrevPage =
  "[data-test-id=my-patches-pagination] > .ant-pagination-prev";
const dataCyTableRows = "[data-cy=patch-card]";

const firstPageDisplayNames = [
  "dist",
  "test meee",
  "'evergreen-ci/evergreen' pull request #3186 by bsamek: EVG-7425 Don't send ShouldExit to unprovisioned hosts (https://github.com/evergreen-ci/evergreen/pull/3186)",
  "SERVER-12189 test",
  "testtest",
  "Empty patch to run a lot of osx tasks",
  "the right version of ssl_fips",
  "no description",
  "SERVER-11333 test run 4",
  "linux-64",
];
const secondPageDisplayNames = [
  "linux-64",
  "all",
  "no description",
  "work from code freeze",
  "MCI-832 test run",
  "SERVER-11183 test run 2",
  "SERVER-11183 test run",
  "SERVER-10992 SERVER-11130 test run",
  "linux-64-duroff,linux-64-debug-duroff",
  "all",
];
const thirdPageDisplayNames = [
  "linux-64",
  "osx-108-cxx11-debug",
  "windows-64,windows-32,solaris-64-bit",
  "no description",
];
// TODO: These functions were adopted from cypress/utils/index and fixes two issues
// which caused the incorrect query to be tracked. The functions in the util folder
// should be updated as well as any tests that rely on them

const clickingCheckboxUpdatesUrlAndRendersFetchedResults = ({
  selector = ".cy-checkbox",
  checkboxDisplayName,
  pathname,
  paramName,
  search,
  tableRow: tableRowVal,
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
    tableRow: tableRowVal,
  }).then(() => urlSearchParamsAreUpdated({ pathname, paramName, search }));
  cy.get("@target").click({ force: true });
  resultsAreFetchedAndRendered({
    queryName: name,
    responseName,
    requestVariables: uncheckedRequestVariables,
    tableRow: tableRowVal,
  }).then(() => {
    urlSearchParamsAreUpdated({ pathname, paramName, search: null });
  });
};

const resultsAreFetchedAndRendered = ({
  queryName,
  responseName,
  requestVariables,
  tableRow: tableRowVal,
} = {}) =>
  assertQueryVariables(queryName, requestVariables).then((xhr) => {
    const { response } = xhr;
    const numberOfResults = get(response, `body.data.${responseName}`, [])
      .length;
    if (numberOfResults === 0) {
      cy.get(tableRowVal).should("not.exist");
    } else {
      cy.get(tableRowVal)
        .invoke("toArray")
        .then((filteredResults) => {
          expect(filteredResults.length >= numberOfResults).eq(true);
        });
    }
  });
