/// <reference types="Cypress" />

describe("Task Page Route", function() {
  it("User is redirected to logs if they land on /task/{taskID}", function() {
    cy.visit("/task/taskID");
    cy.location("pathname").should("include", "/task/taskID/logs");
  });

  it("Browser history is placed when user lands on /task/{taskID}", function() {
    cy.visit("/login");
    cy.visit("/task/taskID");
    cy.go("back");
    cy.location("pathname").should("eq", "/login");
  });
});
