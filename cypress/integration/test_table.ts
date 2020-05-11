/// <reference types="Cypress" />

import {
  clickingCheckboxUpdatesUrlAndRendersFetchedResults,
  resultsAreFetchedAndRendered,
  assertQueryVariables,
} from "../utils";
import { assertCountLabels } from "../utils/table";

describe("Tests Table", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.listenGQL();
    cy.preserveCookies();
  });

  it("Should make GQL request with default query variables when no query params are provided", () => {
    cy.visit(TESTS_ROUTE);
    assertQueryVariables("TaskTests", {
      cat: "STATUS",
      dir: "ASC",
      testName: "",
      pageNum: 0,
    });
  });

  it("Should make GQL request with default query variables when invalid query params are provided", () => {
    cy.visit(`${TESTS_ROUTE}?sortBy=INVALID&sortDir=INVALID`);
    assertQueryVariables("TaskTests", {
      cat: "STATUS",
      dir: "ASC",
      testName: "",
      pageNum: 0,
    });
  });

  it("Should display error banner when given an invalid TaskID in the url", () => {
    cy.visit("/task/NO-SUCH-THANG/tests");
    cy.waitForGQL("GetTask");
    cy.dataCy("banner").contains(
      "There was an error loading the task: GraphQL error:"
    );
  });

  it("Should have sort buttons disabled when fetching data", () => {
    cy.visit(TESTS_ROUTE);
    cy.contains(TABLE_SORT_SELECTOR, "Name").click();
    cy.once("fail", (err) => {
      expect(err.message).to.include(
        "'pointer-events: none' prevents user mouse interaction."
      );
    });
  });

  it("Adjusts query params when table headers are clicked and makes GQL request with correct variables", () => {
    cy.visit(TESTS_ROUTE);
    waitForTestsQuery();
    cy.contains(TABLE_SORT_SELECTOR, "Name").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=TEST_NAME");
      expect(loc.search).to.include(ASCEND_PARAM);
    });
    assertQueryVariables("TaskTests", {
      cat: "TEST_NAME",
      dir: "ASC",
    });
    cy.contains(TABLE_SORT_SELECTOR, "Status").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=STATUS");
      expect(loc.search).to.include(ASCEND_PARAM);
    });
    assertQueryVariables("TaskTests", {
      cat: "STATUS",
      dir: "ASC",
    });
    cy.contains(TABLE_SORT_SELECTOR, "Status").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=STATUS");
      expect(loc.search).to.include(DESCEND_PARAM);
    });
    assertQueryVariables("TaskTests", {
      cat: "STATUS",
      dir: "DESC",
    });
    cy.contains(TABLE_SORT_SELECTOR, "Time").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=DURATION");
      expect(loc.search).to.include(ASCEND_PARAM);
    });
    assertQueryVariables("TaskTests", {
      cat: "DURATION",
      dir: "ASC",
    });
    cy.contains(TABLE_SORT_SELECTOR, "Time").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=DURATION");
      expect(loc.search).to.include(DESCEND_PARAM);
    });
    assertQueryVariables("TaskTests", {
      cat: "DURATION",
      dir: "DESC",
    });
  });
  it("Should not adjust URL params when clicking Logs tab", () => {
    const assertInitialURLState = () =>
      cy.location().should((loc) => {
        expect(loc.pathname).to.equal(TESTS_ROUTE);
        expect(loc.search).to.equal("");
      });
    cy.visit(TESTS_ROUTE);
    assertInitialURLState();
    waitForTestsQuery();
    cy.contains(TABLE_SORT_SELECTOR, "Logs").click();
    assertInitialURLState();
  });

  it("Buttons in log column should have target=_blank attribute", () => {
    cy.visit(TESTS_ROUTE);
    waitForTestsQuery();
    cy.get("[data-cy=test-table-html-btn").should(
      "have.attr",
      "target",
      "_blank"
    );
    cy.get("[data-cy=test-table-raw-btn").should(
      "have.attr",
      "target",
      "_blank"
    );
  });

  describe("Test Status Selector", () => {
    beforeEach(() => {
      cy.visit(TESTS_ROUTE);
      cy.get("[data-cy=test-status-select] > .cy-treeselect-bar").click();
    });

    it("Status select says 'No filters selected' by default", () => {
      cy.get("[data-cy=test-status-select]").contains("No filters selected");
    });

    it("Clicking on 'All' checkbox adds all statuses to URL", () => {
      clickingCheckboxUpdatesUrlAndRendersFetchedResults({
        checkboxDisplayName: "All",
        pathname: TESTS_ROUTE,
        paramName: "statuses",
        search: "all,pass,fail,skip,silentfail",
        query: {
          name: "TaskTests",
          responseName: "taskTests.testResults",
          requestVariables: {
            cat: "STATUS",
            dir: "ASC",
            statusList: ["pass", "fail", "skip", "silentfail"],
            limitNum: 10,
            pageNum: 0,
            testName: "",
          },
        },
      });
    });

    const statuses = [
      { display: "Pass", key: "pass" },
      { display: "Silent Fail", key: "silentfail" },
      { display: "Fail", key: "fail" },
      { display: "Skip", key: "skip" },
    ];

    statuses.forEach(({ display, key }) => {
      it(`Clicking on ${display} status checkbox adds ${key} status to URL and clicking again removes it`, () => {
        clickingCheckboxUpdatesUrlAndRendersFetchedResults({
          checkboxDisplayName: display,
          pathname: TESTS_ROUTE,
          paramName: "statuses",
          search: key,
          query: {
            name: "TaskTests",
            responseName: "taskTests.testResults",
            requestVariables: {
              cat: "STATUS",
              dir: "ASC",
              statusList: [key],
              limitNum: 10,
              pageNum: 0,
              testName: "",
            },
          },
        });
      });
    });

    it("Checking multiple statuses adds them all to the URL as opposed to one, some or none and makes a GQL request including the statuses", () => {
      statuses.forEach(({ display }) => {
        cy.get(".cy-checkbox")
          .contains(display)
          .click({ force: true });
      });
      cy.location().should((loc) => {
        expect(loc.search).to.include("statuses=pass,silentfail,fail,skip,all");
      });
      assertQueryVariables("TaskTests", {
        statusList: ["pass", "silentfail", "fail", "skip"],
      });
    });
  });

  describe("Test Name Filter", () => {
    const testNameInputValue = "group";
    beforeEach(() => {
      cy.visit(TESTS_ROUTE);
      cy.dataCy("testname-input").type(testNameInputValue);
    });

    it("Typing in test name filter updates testname query param", () => {
      cy.location().should((loc) => {
        expect(loc.search).to.include(`testname=${testNameInputValue}`);
      });
    });

    it("Input value is included in the taskTests GQL request body under variables.testName ", () => {
      assertQueryVariables("TaskTests", {
        cat: "STATUS",
        dir: "ASC",
        statusList: [],
        testName: testNameInputValue,
        pageNum: 0,
      });
    });
  });

  describe("Filtered and total test count label", () => {
    before(() => {
      cy.visit(TESTS_ROUTE);
    });

    it("Should display filteredTestCount and totalTestCount from taskTest GQL response", () => {
      assertTestCountLabels();
      cy.get("[data-cy=test-status-select] > .cy-treeselect-bar").click();
      cy.get(".cy-checkbox")
        .contains("Fail")
        .click({ force: true });
      assertTestCountLabels();
      cy.dataCy("testname-input").type("group");
      assertTestCountLabels();
    });
  });

  describe("Scrolling", () => {
    it("Fetches and appends additional tests to table as the user scrolls", () => {
      cy.visit(TESTS_ROUTE);
      cy.get(".ant-table-body").scrollTo(0, "101%", { duration: 500 });
      resultsAreFetchedAndRendered({
        queryName: "TaskTests",
        responseName: "taskTests.testResults",
        requestVariables: {
          cat: "STATUS",
          dir: "ASC",
          statusList: [],
          testName: "",
          pageNum: 1,
        },
      });
    });
  });
});

const assertTestCountLabels = () => {
  waitForTestsQuery();
  assertCountLabels(
    "response.body.data.taskTests.filteredTestCount",
    "response.body.data.taskTests.totalTestCount",
    "filtered-test-count",
    "total-test-count"
  );
};
const TABLE_SORT_SELECTOR = ".ant-table-column-title";
const DESCEND_PARAM = "sortDir=DESC";
const ASCEND_PARAM = "sortDir=ASC";
const waitForTestsQuery = () => cy.waitForGQL("TaskTests");
const TESTS_ROUTE =
  "/task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/tests";
