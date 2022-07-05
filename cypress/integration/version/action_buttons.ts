// / <reference types="Cypress" />
// / <reference path="../../support/index.d.ts" />
import { mockErrorResponse } from "../../utils/mockErrorResponse";
import { popconfirmYesClassName } from "../../utils/popconfirm";

const patch = "5ecedafb562343215a7ff297";
const mainlineCommit = "5e4ff3abe3c3317e352062e4";
const versionPath = (id) => `/version/${id}`;

describe("Action Buttons", () => {
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    cy.preserveCookies();
  });
  describe("When viewing a patch build", () => {
    before(() => {
      cy.visit(versionPath(patch));
    });
    it("Clicking 'Schedule' button shows modal and clicking on 'Cancel' closes it.", () => {
      cy.dataCy("schedule-patch").click();
      cy.dataCy("schedule-tasks-modal").should("be.visible");
      cy.contains("Cancel").click();
      cy.dataCy("schedule-tasks-modal").should("not.exist");
    });

    it("Clicking ellipses dropdown shows ellipses options", () => {
      cy.dataCy("ellipses-btn").should("not.exist");
      cy.dataCy("ellipsis-btn").click();
      cy.dataCy("card-dropdown").should("be.visible");

      cy.dataCy("ellipsis-btn").click();
      cy.dataCy("card-dropdown").should("not.exist");
    });
    describe("Version dropdown options", () => {
      before(() => {
        cy.dataCy("ellipsis-btn").click();
      });
      beforeEach(() => {
        cy.dataCy("card-dropdown").should("be.visible");
      });

      it("Error unscheduling a version shows error toast", () => {
        cy.dataCy("unschedule-patch").click();
        mockErrorResponse({
          errorMessage: "There was an error unscheduling tasks",
        });
        cy.get(popconfirmYesClassName).contains("Yes").click({ force: true });
        cy.validateToast("error");
      });

      xit("Clicking 'Unschedule' button show popconfirm with abort checkbox and a toast on success", () => {
        cy.dataCy("unschedule-patch").click();
        cy.get(popconfirmYesClassName).contains("Yes").click({ force: true });
        cy.validateToast("success");
      });

      it("Clicking 'Set Priority' button shows popconfirm with input and toast on success", () => {
        const priority = "99";
        cy.dataCy("prioritize-patch").click();
        cy.dataCy("patch-priority-input").clear().type(priority);
        cy.get(popconfirmYesClassName).contains("Set").click({ force: true });
        cy.validateToast("success", priority);
      });

      it("Error setting priority shows error toast", () => {
        cy.dataCy("prioritize-patch").click();
        cy.dataCy("patch-priority-input").clear().type("88");
        mockErrorResponse({
          errorMessage: "There was an error setting priority",
        });
        cy.get(popconfirmYesClassName).contains("Set").click({ force: true });
        cy.validateToast("error");
      });
      it("Should be able to reconfigure the patch", () => {
        cy.dataCy("reconfigure-link").should("not.be.disabled");
        cy.dataCy("reconfigure-link").click();
        cy.location("pathname").should("include", "configure");
        cy.visit(versionPath(patch));
      });
    });
  });

  describe("When viewing a mainline commit", () => {
    describe("Version dropdown options", () => {
      before(() => {
        cy.visit(versionPath(mainlineCommit));
      });
      beforeEach(() => {
        cy.dataCy("ellipsis-btn").click();
        cy.dataCy("card-dropdown").should("be.visible");
      });
      afterEach(() => {
        cy.dataCy("ellipsis-btn").click();
      });

      it("Reconfigure link is disabled for mainline commits", () => {
        cy.dataCy("reconfigure-link").should("have.attr", "disabled");
      });
      it("Should not be able to enqueue the version", () => {
        cy.dataCy("enqueue-patch").should("be.disabled");
      });
    });
  });
});
