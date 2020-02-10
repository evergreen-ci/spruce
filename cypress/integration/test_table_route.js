/// <reference types="Cypress" />

const taskID =
  "mci_amazon_linux_test_model_grid_patch_6661f3b02a2bca29deb15feb543b3ba2079d8f1e_5dc5b45897b1d35e9c0d45bb_19_11_08_18_31_00";

const taskPath = `/task/${taskID}/tests`;

const fallbackLocation = loc => {
  expect(loc.pathname).to.equal(`/task/${taskID}/tests`);
  expect(loc.search).to.include("category=TEST_NAME");
  expect(loc.search).to.include("sort=1");
};

describe("Test Table Route", function() {
  beforeEach(() => {
    cy.login();
  });

  it("Default query params are set when no required query params exist", function() {
    cy.visit(taskPath);
    cy.location().should(fallbackLocation);
  });

  it("Default query params are set when some required query params exist", function() {
    cy.visit(`${taskPath}?category=TEST_NAME`);
    cy.location().should(fallbackLocation);
  });

  it("Default query params are not changed when all required query params exist and are valid", function() {
    cy.visit(`${taskPath}?category=DURATION&sort=-1`);
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(taskPath);
      expect(loc.search).to.include("category=DURATION");
      expect(loc.search).to.include("sort=-1");
    });
  });

  it("Category query param is case insensitve", function() {
    cy.visit(`${taskPath}?category=DuRaTiOn&sort=-1`);
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(taskPath);
      expect(loc.search).to.include("category=DuRaTiOn");
      expect(loc.search).to.include("sort=-1");
    });
  });

  describe("Page and Limit must be positive numbers", () => {
    it("Page cannot be less than 0", function() {
      cy.visit(`${taskPath}?category=TEST_NAME&sort=1`);
      cy.location().should(fallbackLocation);
    });

    it("Limit cannot be less than 0", function() {
      cy.visit(`${taskPath}?category=TEST_NAME&sort=1`);
      cy.location().should(fallbackLocation);
    });

    it("Page will truncate if it's a float", function() {
      cy.visit(`${taskPath}?category=TEST_NAME&sort=1`);
      cy.location().should(loc => {
        expect(loc.pathname).to.equal(taskPath);
        expect(loc.search).to.include("category=TEST_NAME");
        expect(loc.search).to.include("sort=1");
      });
    });

    it("Limit will truncate if it's a float", function() {
      cy.visit(`${taskPath}?category=TEST_NAME&sort=1`);
      cy.location().should(loc => {
        expect(loc.pathname).to.equal(taskPath);
        expect(loc.search).to.include("category=TEST_NAME");
        expect(loc.search).to.include("sort=1");
      });
    });

    it("Default query params are set if page query param is an array", function() {
      cy.visit(`${taskPath}?category=TEST_NAME&page=[0,1,3,4]&limit=4&sort=1`);
      cy.location().should(fallbackLocation);
    });

    it("Default query params are set if limit query param is an array", function() {
      cy.visit(`${taskPath}?category=TEST_NAME&page=0&limit=[4,3,4]&sort=1]`);
      cy.location().should(fallbackLocation);
    });
  });
});
