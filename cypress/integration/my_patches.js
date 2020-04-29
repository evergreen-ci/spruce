/// <reference types="Cypress" />

import {
  urlSearchParamsAreUpdated,
  resultsAreFetchedAndRendered,
  clickingCheckboxUpdatesUrlAndRendersFetchedResults,
} from "../utils";
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

  it("Clicking the commit queue checkbox updates the URL, requests patches and renders patches", () => {
    cy.dataCy("commit-queue-checkbox").should("be.checked");
    cy.dataCy("commit-queue-checkbox").click({ force: true });
    urlSearchParamsAreUpdated({
      pathname: MY_PATCHES_ROUTE,
      paramName: "commitQueue",
      search: "false",
    });
    resultsAreFetchedAndRendered({
      queryName: "UserPatches",
      responseName: "userPatches.patches",
      requestVariables: { includeCommitQueue: false },
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
      requestVariables: { includeCommitQueue: true },
      tableRow: "[data-cy=patch-card]",
    });
  });

  describe("Pagination", () => {
    [2, 3].forEach((pageNum) =>
      it(`Clicking on page number ${pageNum} requests and renders patches for that page`, () => {
        cy.get(`.ant-pagination-item-${pageNum}`).click({ force: true });
        resultsAreFetchedAndRendered({
          queryName: "UserPatches",
          responseName: "userPatches.patches",
          requestVariables: { page: (v) => v === pageNum - 1 },
          tableRow: "[data-cy=patch-card]",
        });
      })
    );
  });

  describe("Clicking on status checkbox requests and renders patches for that status", () => {
    beforeEach(() => {
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
            requestVariables: {
              statuses: [key],
            },
          },
        });
      });
    });
  });

  xdescribe("Show commit queue checkbox", () => {
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
