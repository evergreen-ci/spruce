import { mockErrorResponse } from "../../utils/mockErrorResponse";

describe("Action Buttons", () => {
  const patch = "5ecedafb562343215a7ff297";
  const mainlineCommit = "5e4ff3abe3c3317e352062e4";
  const versionPath = (id: string) => `/version/${id}`;

  describe("When viewing a patch build", () => {
    beforeEach(() => {
      cy.visit(versionPath(patch));
    });
    it("Clicking 'Schedule' button shows modal and clicking on 'Cancel' closes it", () => {
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
  });

  describe("Version dropdown options", () => {
    beforeEach(() => {
      cy.visit(versionPath(patch));
      cy.dataCy("ellipsis-btn").click();
      cy.dataCy("card-dropdown").should("be.visible");
    });

    it("Error unscheduling a version shows error toast", () => {
      cy.dataCy("unschedule-patch").click();
      mockErrorResponse({
        errorMessage: "There was an error unscheduling tasks",
      });
      cy.contains("button", "Yes").click({ force: true });
      cy.validateToast("error");
    });

    it("Clicking 'Unschedule' button show popconfirm with abort checkbox and a toast on success", () => {
      cy.dataCy("unschedule-patch").click();
      cy.contains("button", "Yes").click({ force: true });
      cy.validateToast("success");
    });

    it("Clicking 'Set Priority' button shows popconfirm with input and toast on success", () => {
      const priority = "99";
      cy.dataCy("prioritize-patch").click();
      cy.dataCy("patch-priority-input").type(`${priority}{enter}`);
      cy.validateToast("success", priority);
    });

    it("Error setting priority shows error toast", () => {
      cy.dataCy("prioritize-patch").click();
      cy.dataCy("patch-priority-input").type("88");
      mockErrorResponse({
        errorMessage: "There was an error setting priority",
      });
      cy.dataCy("patch-priority-input").type("{enter}");
      cy.validateToast("error");
    });
    it("Should be able to reconfigure the patch", () => {
      cy.dataCy("reconfigure-link").should("not.be.disabled");
      cy.dataCy("reconfigure-link").click();
      cy.location("pathname").should("include", "configure");
      cy.visit(versionPath(patch));
    });
  });

  describe("When viewing a mainline commit", () => {
    describe("Version dropdown options", () => {
      beforeEach(() => {
        cy.visit(versionPath(mainlineCommit));
        cy.dataCy("ellipsis-btn").click();
        cy.dataCy("card-dropdown").should("be.visible");
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
