/// <reference types="Cypress" />
import { waitForGQL } from "../utils/networking";
import {
  clickingCheckboxFetchesFilteredTasksAndUpdatesUrl,
  filteredTasksAreFetchedAndRendered,
  urlSearchParamsAreUpdated,
  assertQueryVariables,
} from "../utils";
import { assertScrollFetchAppend } from "../utils/table";

describe("Tests Table", function() {
  beforeEach(() => {
    cy.server();
    cy.login();
    cy.route("POST", "/graphql/query").as("gqlQuery");
  });

  xit("Should make GQL request with default query variables when no query params are provided", () => {
    cy.visit(TESTS_ROUTE);
    assertQueryVariables();
  });

  xit("Should display No Data when given an invalid TaskID in the url", () => {
    cy.visit("/task/NO-SUCH-THANG/tests");
    waitForGQL("@gqlQuery", "GetTask");
    cy.contains("No Data");
  });

  xit("Should have sort buttons disabled when fetching data", () => {
    cy.visit(TESTS_ROUTE);
    cy.contains(TABLE_SORT_SELECTOR, "Name").click();
    cy.once("fail", (err) => {
      expect(err.message).to.include(
        "'pointer-events: none' prevents user mouse interaction."
      );
    });
  });

  xit("Adjusts query params when table headers are clicked and makes GQL request with correct variables", () => {
    cy.visit(TESTS_ROUTE);
    waitForTestsQuery();
    cy.contains(TABLE_SORT_SELECTOR, "Name").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=TEST_NAME");
      expect(loc.search).to.include(ASCEND_PARAM);
    });
    assertQueryVariables("TEST_NAME", "ASC");
    cy.contains(TABLE_SORT_SELECTOR, "Status").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=STATUS");
      expect(loc.search).to.include(ASCEND_PARAM);
    });
    assertQueryVariables("STATUS", "ASC");
    cy.contains(TABLE_SORT_SELECTOR, "Status").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=STATUS");
      expect(loc.search).to.include(DESCEND_PARAM);
    });
    assertQueryVariables("STATUS", "DESC");
    cy.contains(TABLE_SORT_SELECTOR, "Time").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=DURATION");
      expect(loc.search).to.include(ASCEND_PARAM);
    });
    assertQueryVariables("DURATION", "ASC");
    cy.contains(TABLE_SORT_SELECTOR, "Time").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=DURATION");
      expect(loc.search).to.include(DESCEND_PARAM);
    });
    assertQueryVariables("DURATION", "DESC");
  });

  xit("Should not adjust URL params when clicking Logs tab", () => {
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

  xit("Buttons in log column should have target=_blank attribute", () => {
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

    xit("Status select says 'No filters selected' by default", () => {
      cy.get("[data-cy=test-status-select]").contains("No filters selected");
    });

    it("Clicking on 'All' checkbox adds all statuses to URL ", () => {
      clickingCheckboxFetchesFilteredTasksAndUpdatesUrl({
        checkboxDisplayName: "All",
        pathname: TESTS_ROUTE,
        paramName: "statuses",
        search: "all,pass,fail,skip,silentfail",
        query: {
          name: "taskTests",
          responseName: "taskTests",
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
        clickingCheckboxFetchesFilteredTasksAndUpdatesUrl({
          checkboxDisplayName: display,
          pathname: TESTS_ROUTE,
          paramName: "statuses",
          search: key,
          query: {
            name: "taskTests",
            responseName: "taskTests",
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
          .click();
      });
      cy.location().should((loc) => {
        expect(loc.search).to.include("statuses=pass,silentfail,fail,skip,all");
      });
      assertQueryVariables("taskTests", {
        statusList: ["pass", "silentfail", "fail", "skip"],
      });
    });
  });

  describe("Test Name Filter", () => {
    const testNameInputValue = "group";
    beforeEach(() => {
      cy.visit(TESTS_ROUTE);
      cy.get("#cy-testname-input").type(testNameInputValue);
    });

    it("Typing in test name filter updates testname query param", () => {
      cy.location().should((loc) => {
        expect(loc.search).to.include(`testname=${testNameInputValue}`);
      });
    });

    it("Input value is included in the taskTests GQL request body under variables.testName ", () => {
      assertQueryVariables("taskTests", {
        cat: "STATUS",
        dir: "ASC",
        statusList: [],
        testName: testNameInputValue,
        pageNum: 0,
      });
    });
  });

  describe("Scrolling", () => {
    it("Fetches and appends additional tests to table as the user scrolls", () => {
      cy.visit(TESTS_ROUTE);
      cy.get(".ant-table-body").scrollTo(0, "101%", { duration: 500 });
      filteredTasksAreFetchedAndRendered({
        queryName: "taskTests",
        responseName: "taskTests",
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

const TABLE_SORT_SELECTOR = ".ant-table-column-title";
const DESCEND_PARAM = "sortDir=DESC";
const ASCEND_PARAM = "sortDir=ASC";
const waitForTestsQuery = () => waitForGQL("@gqlQuery", "taskTests");
const TESTS_ROUTE =
  "/task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/tests";
