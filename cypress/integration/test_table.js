/// <reference types="Cypress" />
import { waitForGQL } from "../utils/networking";
import { clickCheckboxGetTasksUpdateUrl } from "../utils";

const TABLE_SORT_SELECTOR = ".ant-table-column-title";
const DESCEND_PARAM = "sortDir=DESC";
const ASCEND_PARAM = "sortDir=ASC";
const waitForTestsQuery = () => waitForGQL("@gqlQuery", "taskTests");

const TESTS_ROUTE =
  "/task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/tests";
describe("Tests Table", function() {
  beforeEach(() => {
    cy.server();
    cy.login();
    cy.route("POST", "/graphql/query").as("gqlQuery");
  });

  it("Should display No Data when given an invalid TaskID in the url", () => {
    cy.visit("/task/NO-SUCH-THANG/tests");
    waitForGQL("@gqlQuery", "GetTask");
    cy.contains("No Data");
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

  it("Adjusts query params when table headers are clicked", () => {
    cy.visit(TESTS_ROUTE);
    waitForTestsQuery();
    cy.contains(TABLE_SORT_SELECTOR, "Name").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=TEST_NAME");
      expect(loc.search).to.include(DESCEND_PARAM);
    });
    waitForTestsQuery();
    cy.contains(TABLE_SORT_SELECTOR, "Status").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=STATUS");
      expect(loc.search).to.include(ASCEND_PARAM);
    });
    waitForTestsQuery();
    cy.contains(TABLE_SORT_SELECTOR, "Status").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=STATUS");
      expect(loc.search).to.include(DESCEND_PARAM);
    });
    waitForTestsQuery();
    cy.contains(TABLE_SORT_SELECTOR, "Time").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=DURATION");
      expect(loc.search).to.include(ASCEND_PARAM);
    });
    waitForTestsQuery();
    cy.contains(TABLE_SORT_SELECTOR, "Time").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=DURATION");
      expect(loc.search).to.include(DESCEND_PARAM);
    });
  });

  it("Should not adjust URL params when clicking Logs tab", () => {
    const assertInitialURLState = () =>
      cy.location().should((loc) => {
        expect(loc.pathname).to.equal(TESTS_ROUTE);
        expect(loc.search).to.include("sortBy=TEST_NAME");
        expect(loc.search).to.include(ASCEND_PARAM);
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
    cy.get("#htmlBtn-356534666634326434653838666165613761393066306666").should(
      "have.attr",
      "target",
      "_blank"
    );
    cy.get("#rawBtn-356534666634326434653838666165613761393066306666").should(
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

    it("Clicking on 'All' checkbox adds all statuses to URL ", () => {
      clickCheckboxGetTasksUpdateUrl({
        checkboxDisplayName: "All",
        pathname: TESTS_ROUTE,
        paramName: "statuses",
        search: "all,pass,fail,skip,silentfail",
        query: {
          name: "taskTests",
          responseName: "taskTests",
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
        clickCheckboxGetTasksUpdateUrl({
          checkboxDisplayName: display,
          pathname: TESTS_ROUTE,
          paramName: "statuses",
          search: key,
          query: {
            name: "taskTests",
            responseName: "taskTests",
          },
        });
      });
    });

    it("Checking multiple statuses adds them all to the URL as opposed to one, some or none", () => {
      statuses.forEach(({ display }) => {
        cy.get(".cy-checkbox")
          .contains(display)
          .click();
      });
      cy.location().should((loc) => {
        expect(loc.search).to.include("statuses=pass,silentfail,fail,skip,all");
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
      const xhrTestNamePath = "requestBody.variables.testName";
      waitForGQL("@gqlQuery", "taskTests", {
        [xhrTestNamePath]: testNameInputValue,
      });
      cy.get("@gqlQuery")
        .its("requestBody.operationName")
        .should("equal", "taskTests");
      cy.get("@gqlQuery")
        .its(xhrTestNamePath)
        .should("equal", testNameInputValue);
    });
  });
});
