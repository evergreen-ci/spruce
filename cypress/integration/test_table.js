/// <reference types="Cypress" />

describe("tests table", function() {
  this.beforeEach(() => {
    cy.server();
    cy.login();
    cy.route("POST", "/graphql/query").as("gqlQuery");
  });

  it("Should display No Data when given an invalid TaskID in the url", () => {
    cy.visit("/task/NO-SUCH-THANG/tests");
    cy.login();
    cy.wait(["@gqlQuery"]);
    cy.wait(["@gqlQuery"]);
    cy.get(".ant-table").should("not.exist");
  });

  //this test is skipped until we can use POST body to match routes with cypress
  it.skip("Should have sort buttons disabled when fetching data", () => {
    cy.visit(
      "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests"
    );
    cy.login();
    cy.contains("Name").click();
    cy.once;
    cy.once("fail", err => {
      expect(err.message).to.include(
        "'pointer-events: none' prevents user mouse interaction."
      );
    });
  });

  //this test is skipped until we can use POST body to match routes with cypress
  it.skip("Adjusts query params when table headers are clicked", () => {
    cy.visit(
      "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests"
    );
    cy.login();
    // waits on requests that we are not related to the test table
    cy.wait(["@gqlQuery"]);
    cy.wait(["@gqlQuery"]);
    cy.wait(["@gqlQuery"]);
    cy.wait(["@gqlQuery"]);
    cy.contains("Name").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(
        "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests"
      );
      expect(loc.search).to.include("category=TEST_NAME");
      expect(loc.search).to.include("sort=-1");
    });
    cy.wait(["@gqlQuery"]);
    cy.contains("Status").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(
        "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests"
      );
      expect(loc.search).to.include("category=STATUS");
      expect(loc.search).to.include("sort=1");
    });
    cy.wait(["@gqlQuery"]);
    cy.contains("Status").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(
        "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests"
      );
      expect(loc.search).to.include("category=STATUS");
      expect(loc.search).to.include("sort=-1");
    });
    cy.wait(["@gqlQuery"]);
    cy.contains("Time").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(
        "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests"
      );
      expect(loc.search).to.include("category=DURATION");
      expect(loc.search).to.include("sort=1");
    });
    cy.wait(["@gqlQuery"]);
    cy.contains("Time").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(
        "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests"
      );
      expect(loc.search).to.include("category=DURATION");
      expect(loc.search).to.include("sort=-1");
    });
  });
});
