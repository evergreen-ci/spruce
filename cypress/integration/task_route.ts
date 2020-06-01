// / <reference types="Cypress" />

describe("Task Page Route", () => {
  before(() => {
    cy.login();
  });

  it("User is redirected to logs if they land on /task/{taskID}", () => {
    cy.visit("/task/taskID");
    cy.location("pathname").should("include", "/task/taskID/logs");
  });

  it("Browser history is replaced when user lands on /task/{taskID}", () => {
    cy.visit("/random");
    cy.visit("/task/taskID");
    cy.go("back");
    cy.location("pathname").should("eq", "/random");
  });

  it("User is not redirected if they land on /task/{taskID}/files", () => {
    cy.visit("/task/taskID/files");
    cy.location("pathname").should("eq", "/task/taskID/files");
  });
});
