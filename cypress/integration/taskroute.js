/// <reference types="Cypress" />

describe("Task Page Route", function() {
  it("User is redirected to logs if they land on /task/{taskID}", function() {
    cy.visit("/task/taskID");
    cy.login();
    cy.location("pathname").should("include", "/task/taskID/logs");
  });

  it("Browser history is replaced when user lands on /task/{taskID}", function() {
    cy.visit("/random");
    cy.visit("/task/taskID");
    cy.go("back");
    cy.location("pathname").should("eq", "/random");
  });

  it("User is not redirected if they land on /task/{taskID}/files", function() {
    cy.visit("/task/taskID/files");
    cy.location("pathname").should("eq", "/task/taskID/files");
  });
});
