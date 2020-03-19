/// <reference types="Cypress" />
import { waitForGQL } from "../utils/networking";

const TABLE_SORT_SELECTOR = ".ant-table-column-title";
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
    cy.get(".ant-table").should("not.exist");
  });

  it("Should have sort buttons disabled when fetching data", () => {
    cy.visit(TESTS_ROUTE);
    cy.contains(TABLE_SORT_SELECTOR, "Name").click();
    cy.once("fail", err => {
      expect(err.message).to.include(
        "'pointer-events: none' prevents user mouse interaction."
      );
    });
  });

  it("Adjusts query params when table headers are clicked", () => {
    cy.visit(TESTS_ROUTE);
    waitForTestsQuery();
    cy.contains(TABLE_SORT_SELECTOR, "Name").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("category=TEST_NAME");
      expect(loc.search).to.include("sort=-1");
    });
    waitForTestsQuery();
    cy.contains(TABLE_SORT_SELECTOR, "Status").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("category=STATUS");
      expect(loc.search).to.include("sort=1");
    });
    waitForTestsQuery();
    cy.contains(TABLE_SORT_SELECTOR, "Status").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("category=STATUS");
      expect(loc.search).to.include("sort=-1");
    });
    waitForTestsQuery();
    cy.contains(TABLE_SORT_SELECTOR, "Time").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("category=DURATION");
      expect(loc.search).to.include("sort=1");
    });
    waitForTestsQuery();
    cy.contains(TABLE_SORT_SELECTOR, "Time").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("category=DURATION");
      expect(loc.search).to.include("sort=-1");
    });
  });

  it("Should not adjust URL params when clicking Logs tab", () => {
    const assertInitialURLState = () =>
      cy.location().should(loc => {
        expect(loc.pathname).to.equal(TESTS_ROUTE);
        expect(loc.search).to.include("category=TEST_NAME");
        expect(loc.search).to.include("sort=1");
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
      cy.get("#cy-test-status-select > .cy-treeselect-bar").click();
    });

    it("Status select says 'No filters selected' by default", () => {
      cy.get("#cy-test-status-select").contains("No filters selected");
    });

    it("Clicking on 'All' checkbox adds all statuses to URL ", () => {
      cy.get(".cy-checkbox")
        .contains("All")
        .click();
      cy.location().should(loc => {
        expect(loc.pathname).to.equal(TESTS_ROUTE);
        expect(loc.search).to.include("statuses=all,pass,fail,skip,silentfail");
      });
    });

    const statuses = [
      { display: "Pass", key: "pass" },
      { display: "Silent Fail", key: "silentfail" },
      { display: "Fail", key: "fail" },
      { display: "Skip", key: "skip" }
    ];

    statuses.forEach(({ display, key }) => {
      it(`Clicking on ${display} status checkbox adds ${key} status to URL and clicking again removes it`, () => {
        cy.get(".cy-checkbox")
          .contains(display)
          .click();
        cy.location().should(loc => {
          expect(loc.pathname).to.equal(TESTS_ROUTE);
          expect(loc.search).to.include(`statuses=${key}`);
        });
        cy.get(".cy-checkbox")
          .contains(display)
          .click();
        cy.location().should(loc => {
          expect(loc.pathname).to.equal(TESTS_ROUTE);
          expect(loc.search).to.not.include(`statuses=${key}`);
        });
      });
    });

    it("Checking all statuses will check 'All' checkbox", () => {
      statuses.forEach(({ display }) => {
        cy.get(".cy-checkbox")
          .contains(display)
          .click();
      });
      cy.get(".cy-checkbox > input").should("be.checked");
    });

    it("Unchecking a status will uncheck 'All' checkbox", () => {
      statuses.forEach(({ display }) => {
        cy.get(".cy-checkbox")
          .contains(display)
          .click();
      });
      cy.get(".cy-checkbox")
        .contains("Pass")
        .click();
      cy.get(".cy-checkbox > input")
        .first()
        .should("not.be.checked");
    });

    it("Checking multiple statuses adds them to URL", () => {
      statuses.forEach(({ display }) => {
        cy.get(".cy-checkbox")
          .contains(display)
          .click();
      });
      cy.location().should(loc => {
        expect(loc.search).to.include("statuses=pass,silentfail,fail,skip,all");
      });
    });
  });
});
