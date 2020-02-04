/// <reference types="Cypress" />

const fallbackLocation = loc => {
  expect(loc.pathname).to.equal("/task/taskID/tests");
  expect(loc.search).to.include("category=TEST_NAME");
  expect(loc.search).to.include("sort=1");
};

describe("Test Table Route", function() {
  it("Default query params are set when no required query params exist", function() {
    cy.visit("/task/taskID/tests");
    cy.location().should(fallbackLocation);
  });

  it("Default query params are set when some required query params exist", function() {
    cy.visit("/task/taskID/tests?category=TEST_NAME");
    cy.location().should(fallbackLocation);
  });

  it("Default query params are not changed when all required query params exist and are valid", function() {
    cy.visit("/task/taskID/tests?category=DURATION&sort=-1");
    cy.location().should(loc => {
      expect(loc.pathname).to.equal("/task/taskID/tests");
      expect(loc.search).to.include("category=DURATION");
      expect(loc.search).to.include("sort=-1");
    });
  });

  it("Category query param is case insensitve", function() {
    cy.visit("/task/taskID/tests?category=DuRaTiOn&sort=-1");
    cy.location().should(loc => {
      expect(loc.pathname).to.equal("/task/taskID/tests");
      expect(loc.search).to.include("category=DuRaTiOn");
      expect(loc.search).to.include("page=4");
    });
  });

  describe("Page and Limit must be positive numbers", () => {
    it("Page cannot be less than 0", function() {
      cy.visit("/task/taskID/tests?category=TEST_NAME&sort=1");
      cy.location().should(fallbackLocation);
    });

    it("Limit cannot be less than 0", function() {
      cy.visit("/task/taskID/tests?category=TEST_NAME&sort=1");
      cy.location().should(fallbackLocation);
    });

    it("Page will truncate if it's a float", function() {
      cy.visit("/task/taskID/tests?category=TEST_NAME&sort=1");
      cy.location().should(loc => {
        expect(loc.pathname).to.equal("/task/taskID/tests");
        expect(loc.search).to.include("category=TEST_NAME");
        expect(loc.search).to.include("sort=1");
      });
    });

    it("Limit will truncate if it's a float", function() {
      cy.visit("/task/taskID/tests?category=TEST_NAME&sort=1");
      cy.location().should(loc => {
        expect(loc.pathname).to.equal("/task/taskID/tests");
        expect(loc.search).to.include("category=TEST_NAME");
        expect(loc.search).to.include("sort=1");
      });
    });

    it("Default query params are set if page query param is an array", function() {
      cy.visit(
        "/task/taskID/tests?category=TEST_NAME&page=[0,1,3,4]&limit=4&sort=1"
      );
      cy.location().should(fallbackLocation);
    });

    it("Default query params are set if limit query param is an array", function() {
      cy.visit(
        "/task/taskID/tests?category=TEST_NAME&page=0&limit=[4,3,4]&sort=1]"
      );
      cy.location().should(fallbackLocation);
    });
  });
});
