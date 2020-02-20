/// <reference types="Cypress" />
import { waitForGQL } from "../utils/networking";

const TABLE_SORT_SELECTOR = ".ant-table-column-title";
const waitForTestsQuery = () => waitForGQL("@gqlQuery", "taskTests");
const TESTS_ROUTE =
  "/task/logkeeper_ubuntu_test_edd78c1d581bf757a880777b00685321685a8e67_16_10_20_21_58_58/tests";
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
