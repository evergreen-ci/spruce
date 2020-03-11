/// <reference types="Cypress" />
import { waitForGQL } from "../utils/networking";

const TABLE_SORT_SELECTOR = ".ant-table-column-title";
const waitForTestsQuery = () => waitForGQL("@gqlQuery", "taskTests");
const TESTS_ROUTE =
  "/task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/tests";
describe("tests table", function() {
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
    cy.get("#htmlBtn0").should("have.attr", "target", "_blank");
    cy.get("#rawBtn0").should("have.attr", "target", "_blank");
  });
});
