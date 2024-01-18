import {
  urlSearchParamsAreUpdated,
  clickOnPageBtnAndAssertURLandTableResults,
  clickOnPageSizeBtnAndAssertURLandTableSize,
} from "../../utils";

const MY_PATCHES_ROUTE = "/user/admin/patches";
const BOB_HICKS_PATCHES_ROUTE = "/user/bob.hicks/patches";
const REGULAR_USER_PATCHES_ROUTE = "/user/regular/patches";

describe("My Patches Page", () => {
  beforeEach(() => {
    cy.setCookie("include-commit-queue-user-patches", "true");
  });
  it("Redirects user to user patches route from `/user/:id`", () => {
    cy.visit("user/chicken");
    cy.location().should((loc) =>
      expect(loc.pathname).to.eq("/user/chicken/patches"),
    );
  });

  it("The page title should be 'My Patches' when viewing the logged in users' patches page", () => {
    cy.visit(MY_PATCHES_ROUTE);
    cy.contains("My Patches").should("exist");
  });

  it("The page title should reflect another users patches when viewing another users patches page", () => {
    cy.visit(BOB_HICKS_PATCHES_ROUTE);
    cy.contains("Bob Hicks' Patches").should("exist");
    cy.visit(REGULAR_USER_PATCHES_ROUTE);
    cy.contains("Regular User's Patches").should("exist");
  });

  it("Typing in patch description input updates the url, requests patches and renders patches", () => {
    cy.visit(MY_PATCHES_ROUTE);
    const inputVal = "testtest";
    cy.dataCy("patch-description-input").within(() => {
      cy.get("input").type(inputVal);
    });
    urlSearchParamsAreUpdated({
      pathname: MY_PATCHES_ROUTE,
      paramName: "patchName",
      search: inputVal,
    });
    urlSearchParamsAreUpdated({
      pathname: MY_PATCHES_ROUTE,
      paramName: "page",
      search: 0,
    });
    cy.dataCy("patch-description-input").within(() => {
      cy.get("input").clear();
    });
  });

  it("Inputting a number successfully searches patches", () => {
    cy.visit(MY_PATCHES_ROUTE);
    cy.dataCy("patch-description-input").within(() => {
      cy.get("input").type("3186");
    });
    cy.dataCy("patch-card").should("have.length", "1");
    cy.dataCy("patch-description-input").within(() => {
      cy.get("input").clear();
    });
  });

  it("Searching for a nonexistent patch shows 'No patches found'", () => {
    cy.visit(MY_PATCHES_ROUTE);
    cy.dataCy("patch-description-input").within(() => {
      cy.get("input").type("satenarstharienht");
    });
    cy.dataCy("no-patches-found").contains("No patches found");
  });

  it("Grouped task status icon should link to version page with appropriate filters", () => {
    cy.visit(MY_PATCHES_ROUTE);
    cy.dataCy("grouped-task-status-badge")
      .eq(1)
      .should("have.attr", "href")
      .and(
        "equals",
        "/version/5ecedafb562343215a7ff297/tasks?statuses=success",
      );
  });

  describe("Commit queue checkbox", () => {
    it("Clicking the commit queue checkbox updates the URL, requests patches and renders patches", () => {
      cy.visit(MY_PATCHES_ROUTE);
      cy.dataCy("commit-queue-checkbox").should("be.checked");
      cy.contains(patchOnCommitQueue);

      cy.dataCy("commit-queue-checkbox").uncheck({ force: true });
      urlSearchParamsAreUpdated({
        pathname: MY_PATCHES_ROUTE,
        paramName: "commitQueue",
        search: "false",
      });
      cy.contains(patchOnCommitQueue).should("not.exist");
      cy.dataCy("commit-queue-checkbox").check({ force: true });
    });

    it("The commit queue checkbox defaults to a cookie value when the commitQueue query param isn't defined", () => {
      cy.setCookie("include-commit-queue-user-patches", "true");
      cy.visit(MY_PATCHES_ROUTE);
      cy.dataCy("commit-queue-checkbox").should("be.checked");
      cy.setCookie("include-commit-queue-user-patches", "false");
      cy.dataCy("commit-queue-checkbox").should("not.be.checked");
    });

    it("The commitQueue query param has higher precedence than the cookie value when determining commit queue checkbox state", () => {
      cy.setCookie("include-commit-queue-user-patches", "true");
      cy.visit(`${MY_PATCHES_ROUTE}?commitQueue=false`);
      cy.dataCy("commit-queue-checkbox").should("not.be.checked");
      cy.setCookie("include-commit-queue-user-patches", "false");
      cy.visit(`${MY_PATCHES_ROUTE}?commitQueue=true`);
      cy.dataCy("commit-queue-checkbox").should("be.checked");
    });

    it("Clicking on the commit queue checkbox updates the cookie value", () => {
      cy.setCookie("include-commit-queue-user-patches", "true");
      cy.visit(MY_PATCHES_ROUTE);
      cy.dataCy("commit-queue-checkbox").should("be.checked");
      cy.contains("Include Commit Queue").click();
      cy.dataCy("commit-queue-checkbox").should("not.be.checked");
      cy.getCookie("include-commit-queue-user-patches").should(
        "have.property",
        "value",
        "false",
      );
      cy.contains("Include Commit Queue").click();
      cy.dataCy("commit-queue-checkbox").should("be.checked");
      cy.getCookie("include-commit-queue-user-patches").should(
        "have.property",
        "value",
        "true",
      );
    });
  });

  it("Changing page size updates URL and renders less than or equal to that many rows", () => {
    cy.visit(`${MY_PATCHES_ROUTE}?limit=10`);
    [20, 10, 50, 100].forEach((pageSize) => {
      clickOnPageSizeBtnAndAssertURLandTableSize(pageSize, dataCyTableRows);
    });
  });

  describe("Changing page number", () => {
    it("Displays the next page of results and updates URL when right arrow is clicked and next page exists", () => {
      cy.visit(`${MY_PATCHES_ROUTE}?limit=10`);
      cy.dataCy("patch-card").should("exist");
      cy.dataCy(dataCyNextPage).should("have.attr", "aria-disabled", "false");
      clickOnPageBtnAndAssertURLandTableResults(
        dataCyNextPage,
        secondPageDisplayNames,
        1,
      );
    });

    it("Displays the previous page of results and updates URL when the left arrow is clicked and previous page exists", () => {
      cy.visit(`${MY_PATCHES_ROUTE}?limit=10&page=1`);
      cy.dataCy("patch-card").should("exist");
      cy.dataCy(dataCyPrevPage).should("have.attr", "aria-disabled", "false");
      clickOnPageBtnAndAssertURLandTableResults(
        dataCyPrevPage,
        firstPageDisplayNames,
        0,
      );
    });

    it("Should disable pagination when there are no more pages", () => {
      cy.visit(`${MY_PATCHES_ROUTE}?limit=10`);
      cy.dataCy("patch-card").should("exist");
      cy.dataCy(dataCyPrevPage).should("have.attr", "aria-disabled", "true");

      cy.visit(`${MY_PATCHES_ROUTE}?page=2`);
      cy.dataCy("patch-card").should("exist");
      cy.dataCy(dataCyNextPage).should("have.attr", "aria-disabled", "true");
    });
  });

  describe("Clicking on status checkbox requests and renders patches for that status", () => {
    beforeEach(() => {
      cy.visit(MY_PATCHES_ROUTE);
      cy.dataCy("patch-card").should("exist");
      cy.dataCy("my-patch-status-select").click();
    });

    const statuses = [
      { display: "Created/Unconfigured", key: "created" },
      { display: "Running", key: "started" },
      { display: "Succeeded", key: "succeeded" },
      { display: "Failed", key: "failed" },
    ];

    it(`Clicking on a status checkbox applies the status and clicking again removes it`, () => {
      statuses.forEach(({ display, key }) => {
        clickingCheckboxUpdatesUrlAndRendersFetchedResults({
          checkboxDisplayName: display,
          pathname: MY_PATCHES_ROUTE,
          paramName: "statuses",
          search: key,
        });
      });
    });

    it("Clicking on All status checkbox applies all of the statuses and clicking again removes them", () => {
      clickingCheckboxUpdatesUrlAndRendersFetchedResults({
        checkboxDisplayName: "All",
        pathname: MY_PATCHES_ROUTE,
        paramName: "statuses",
        search: "all,created,started,succeeded,failed",
      });
    });
  });
});

const dataCyNextPage = "next-page-button";
const dataCyPrevPage = "prev-page-button";
const dataCyTableRows = "[data-cy=patch-card]";

const patchOnCommitQueue =
  "'evergreen-ci/evergreen' pull request #3186 by bsamek: EVG-7425 Don't send ShouldExit to unprovisioned hosts (https://github.com/evergreen-ci/evergreen/pull/3186)";
const firstPageDisplayNames = [
  "main: EVG-7823 add a commit queue message (#4048)",
  "dist",
  "test meee",
  "Patch with display tasks",
  "'evergreen-ci/evergreen' pull request #3186 by bsamek: EVG-7425 Don't send ShouldExit to unprovisioned hosts (https://github.com/evergreen-ci/evergreen/pull/3186)",
  "SERVER-12189 test",
  "testtest",
  "Empty patch to run a lot of osx tasks",
  "the right version of ssl_fips",
  "no description",
];
const secondPageDisplayNames = [
  "SERVER-11333 test run 4",
  "linux-64",
  "linux-64",
  "all",
  "no description",
  "work from code freeze",
  "MCI-832 test run",
  "SERVER-11183 test run 2",
  "SERVER-11183 test run",
  "SERVER-10992 SERVER-11130 test run",
];

const clickingCheckboxUpdatesUrlAndRendersFetchedResults = ({
  checkboxDisplayName,
  paramName,
  pathname,
  search,
  selector = ".cy-checkbox",
}) => {
  cy.get(selector)
    .contains(checkboxDisplayName)
    .as("target")
    .click({ force: true });
  urlSearchParamsAreUpdated({ pathname, paramName, search });
  cy.get("@target").click({ force: true });

  urlSearchParamsAreUpdated({ pathname, paramName, search: null });
};
