/// <reference types="Cypress" />

const taskID =
  "evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";

const taskPath = `/task/${taskID}/tests`;
const DESCEND_PARAM = "sortDir=DESC";
const ASCEND_PARAM = "sortDir=ASC";

const fallbackLocation = loc => {
  expect(loc.pathname).to.equal(`/task/${taskID}/tests`);
  expect(loc.search).to.include("sortBy=TEST_NAME");
  expect(loc.search).to.include(ASCEND_PARAM);
};

describe("Tests Table Route", function() {
  beforeEach(() => {
    cy.login();
  });

  it("sortBy query param is case insensitve", function() {
    cy.visit(`${taskPath}?sortBy=DuRaTiOn&${DESCEND_PARAM}`);
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(taskPath);
      expect(loc.search).to.include("sortBy=DuRaTiOn");
      expect(loc.search).to.include(DESCEND_PARAM);
    });
  });

  describe("Page and Limit must be positive numbers", () => {
    it("Page cannot be less than 0", function() {
      cy.visit(`${taskPath}?sortBy=TEST_NAME&${ASCEND_PARAM}`);
      cy.location().should(fallbackLocation);
    });

    it("Limit cannot be less than 0", function() {
      cy.visit(`${taskPath}?sortBy=TEST_NAME&${ASCEND_PARAM}`);
      cy.location().should(fallbackLocation);
    });

    it("Page will truncate if it's a float", function() {
      cy.visit(`${taskPath}?sortBy=TEST_NAME&${ASCEND_PARAM}`);
      cy.location().should(loc => {
        expect(loc.pathname).to.equal(taskPath);
        expect(loc.search).to.include("sortBy=TEST_NAME");
        expect(loc.search).to.include(ASCEND_PARAM);
      });
    });

    it("Limit will truncate if it's a float", function() {
      cy.visit(`${taskPath}?sortBy=TEST_NAME&${ASCEND_PARAM}`);
      cy.location().should(loc => {
        expect(loc.pathname).to.equal(taskPath);
        expect(loc.search).to.include("sortBy=TEST_NAME");
        expect(loc.search).to.include(ASCEND_PARAM);
      });
    });
  });
});
