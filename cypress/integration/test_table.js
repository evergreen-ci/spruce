/// <reference types="Cypress" />

describe("tests table", function() {
  it("Navigate to tests table and click on table header to adjust query params", function() {
    cy.server();
    cy.route("POST", "/graphql/query").as("gqlQuery");
    cy.login();
    cy.visit(
      "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests"
    );
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
