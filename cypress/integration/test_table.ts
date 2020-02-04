/// <reference types="Cypress" />

describe("Tests Table", function() {
  it("Navigate to tests table and click on table header to adjust query params", function() {
    function login() {
      cy.get("input[name=username]").type("admin");
      cy.get("input[name=password]").type("password");
      cy.get("button[id=login-submit]").click();
    }
    cy.visit("/login");
    login();
    cy.visit(
      "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests"
    );
    cy.wait(15000);
    cy.contains("Name").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(
        "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests"
      );
      expect(loc.search).to.include("category=TEST_NAME");
      expect(loc.search).to.include("sort=-1");
    });
    cy.wait(15000);
    cy.contains("Status").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(
        "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests"
      );
      expect(loc.search).to.include("category=STATUS");
      expect(loc.search).to.include("sort=1");
    });
    cy.wait(15000);
    cy.contains("Status").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(
        "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests"
      );
      expect(loc.search).to.include("category=STATUS");
      expect(loc.search).to.include("sort=-1");
    });
    cy.wait(15000);
    cy.contains("Time").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(
        "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests"
      );
      expect(loc.search).to.include("category=DURATION");
      expect(loc.search).to.include("sort=1");
    });
    cy.wait(15000);
    cy.contains("Time").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(
        "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests"
      );
      expect(loc.search).to.include("category=DURATION");
      expect(loc.search).to.include("sort=-1");
    });
    //cy.location().should(fallbackLocation);k
  });
});
