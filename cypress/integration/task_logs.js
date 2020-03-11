/// <reference types="Cypress" />
import { waitForGQL } from "../utils/networking";

const LOGS_ROUTE =
  "/task/evergreen_ubuntu1604_js_test_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/logs";
describe("tests table", function() {
  beforeEach(() => {
    cy.server();
    cy.login();
    cy.route("POST", "/graphql/query").as("gqlQuery");
  });

  it("Should render with task logs radio checked when logtype not indicated in URL query param", () => {
    cy.visit(LOGS_ROUTE);
    cy.get("#cy-task-radio").should("be.checked");
  });

  it("Should update logtype query param to event after checking agent radio button", () => {
    cy.visit(LOGS_ROUTE);
    cy.get("#cy-agent-radio")
      .check()
      .should("be.checked");
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(LOGS_ROUTE);
      expect(loc.search).to.include("logtype=agent");
    });
  });

  it("Should update logtype query param to event after checking event radio button", () => {
    cy.visit(LOGS_ROUTE);
    cy.get("#cy-event-radio")
      .check()
      .should("be.checked");
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(LOGS_ROUTE);
      expect(loc.search).to.include("logtype=event");
    });
  });

  it("Should update logtype query param to system after checking system radio button", () => {
    cy.visit(LOGS_ROUTE);
    cy.get("#cy-system-radio")
      .check()
      .should("be.checked");
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(LOGS_ROUTE);
      expect(loc.search).to.include("logtype=system");
    });
  });
  it("Should intially load with agent log radio checked when logtype query param is agent", () => {
    cy.visit(LOGS_ROUTE + "?logtype=agent");
    cy.get("#cy-agent-radio")
      .check()
      .should("be.checked");
  });
  it("Should intially load with system log radio checked when logtype query param is system", () => {
    cy.visit(LOGS_ROUTE + "?logtype=system");
    cy.get("#cy-system-radio")
      .check()
      .should("be.checked");
  });
  it("Should intially load with event log radio checked when logtype query param is event", () => {
    cy.visit(LOGS_ROUTE + "?logtype=event");
    cy.get("#cy-event-radio")
      .check()
      .should("be.checked");
  });
  it("Should intially load with task log radio checked when logtype query param is task", () => {
    cy.visit(LOGS_ROUTE + "?logtype=task");
    cy.get("#cy-task-radio")
      .check()
      .should("be.checked");
  });
  it("Should intially load with task log radio checked when logtype query param is not a valid log type", () => {
    cy.visit(LOGS_ROUTE + "?logtype=soeiantsrein");
    cy.get("#cy-task-radio")
      .check()
      .should("be.checked");
  });
});
