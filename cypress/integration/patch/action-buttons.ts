// / <reference types="Cypress" />
// / <reference path="../../support/index.d.ts" />
import { mockErrorResponse } from "../../utils/mockErrorResponse";
import { popconfirmYesClassName } from "../../utils/popconfirm";

const patchIdWithWorkingReconfigureLink = "5ecedafb562343215a7ff297";
const patchId = "5e4ff3abe3c3317e352062e4";
const patchPath = (id) => `/patch/${id}`;

describe("Patch Action Buttons", () => {
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    cy.preserveCookies();
    cy.visit(patchPath(patchId));
  });

  it("Clicking 'Schedule' button shows popconfirm and banner on success", () => {
    cy.dataCy("schedule-patch").click();
    cy.get(popconfirmYesClassName).contains("Yes").click({ force: true });
    cy.dataCy("banner").should("exist");
  });

  it("Error scheduling a version shows error banner", () => {
    cy.dataCy("schedule-patch").click();
    mockErrorResponse({ errorMessage: "There was an error scheduling tasks" });
    cy.get(popconfirmYesClassName).contains("Yes").click({ force: true });
    cy.dataCy("banner").contains("error").should("exist");
  });

  it("Clicking 'Unschedule' button show popconfirm with abort checkbox and a banner on success", () => {
    cy.dataCy("ellipsis-btn").click();
    cy.dataCy("unschedule-patch").click();
    cy.dataCy("abort-checkbox").check({ force: true });
    cy.get(popconfirmYesClassName).contains("Yes").click({ force: true });
    cy.dataCy("banner").should("exist");
  });

  it("Error unscheduling a version shows error banner", () => {
    cy.dataCy("ellipsis-btn").click();
    cy.dataCy("unschedule-patch").click();
    mockErrorResponse({
      errorMessage: "There was an error unscheduling tasks",
    });
    cy.get(popconfirmYesClassName).contains("Yes").click({ force: true });
    cy.dataCy("banner").contains("error").should("exist");
  });

  it("Reconfigure button should have link to reconfigure page", () => {
    cy.visit(patchPath(patchIdWithWorkingReconfigureLink));
    cy.dataCy("ellipsis-btn").click();
    cy.dataCy("reconfigure-link").click();
    cy.location("pathname").should("include", "configure");
  });

  it("Reconfigure link is disabled for patches on commit queue", () => {
    cy.dataCy("ellipsis-btn").click();
    cy.dataCy("reconfigure-link").should("have.attr", "disabled");
  });

  it("Clicking 'Set Priority' button shows popconfirm with input and banner on success", () => {
    const priority = "99";
    cy.dataCy("ellipsis-btn").click();
    cy.dataCy("prioritize-patch").click();
    cy.dataCy("priority-input").clear().type(priority);
    cy.get(popconfirmYesClassName).contains("Set").click({ force: true });
    cy.dataCy("banner").contains(priority).should("exist");
  });

  it("Error setting priority shows error banner", () => {
    cy.dataCy("ellipsis-btn").click();
    cy.dataCy("prioritize-patch").click();
    cy.dataCy("priority-input").clear().type("88");
    mockErrorResponse({
      errorMessage: "There was an error setting priority",
    });
    cy.get(popconfirmYesClassName).contains("Set").click({ force: true });
    cy.dataCy("banner").contains("error").should("exist");
  });

  it("Clicking 'Enqueue Patch' button shows popconfirm with input and banner on success", () => {
    cy.dataCy("ellipsis-btn").click();
    cy.dataCy("enqueue-patch").click();
    cy.get(popconfirmYesClassName).contains("Yes").click({ force: true });
    cy.dataCy("banner").should("exist").contains("Enqueued patch");
  });
});
