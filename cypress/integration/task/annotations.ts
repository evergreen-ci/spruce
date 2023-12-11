const taskWithAnnotations =
  "evergreen_ubuntu1604_test_annotations_b_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
const taskRoute = `/task/${taskWithAnnotations}/annotations`;

const issuesList = "issues-list";
const suspectedIssuesList = "suspected-issues-list";

const validateAnnotationRowCount = (listName: string, count: number) => {
  cy.dataCy(listName).within(() =>
    cy.dataCy("annotation-ticket-row").should("have.length", count)
  );
};
describe("Task Annotation Tab", () => {
  beforeEach(() => {
    cy.visit(taskRoute);
  });

  it("annotations can be moved between lists", () => {
    cy.dataCy("loading-annotation-ticket").should("not.exist");

    validateAnnotationRowCount(issuesList, 1);
    validateAnnotationRowCount(suspectedIssuesList, 3);

    // move from suspectedIssues to Issues
    cy.dataCy("move-btn-AnotherOne").click();
    cy.contains("button", "Yes")
      .should("be.visible")
      .should("not.have.attr", "aria-disabled", "true");
    cy.contains("button", "Yes").click();
    validateAnnotationRowCount(issuesList, 2);
    validateAnnotationRowCount(suspectedIssuesList, 2);
    cy.validateToast("success", "Successfully moved suspected issue to issues");

    // move from Issues to suspectedIssues
    cy.dataCy("move-btn-AnotherOne").click();
    cy.contains("button", "Yes")
      .should("be.visible")
      .should("not.have.attr", "aria-disabled", "true");
    cy.contains("button", "Yes").click();
    validateAnnotationRowCount(issuesList, 1);
    validateAnnotationRowCount(suspectedIssuesList, 3);

    cy.validateToast("success", "Successfully moved issue to suspected issues");
  });

  it("annotations add and delete correctly", () => {
    validateAnnotationRowCount(issuesList, 1);
    validateAnnotationRowCount(suspectedIssuesList, 3);
    cy.dataCy("loading-annotation-ticket").should("have.length", 0);

    // add a ticket
    cy.dataCy("add-suspected-issue-button").click();
    cy.dataCy("issue-url").type("https://jira.example.com/browse/SERVER-1234");
    cy.contains("Add suspected issue").click();
    validateAnnotationRowCount(issuesList, 1);
    validateAnnotationRowCount(suspectedIssuesList, 4);
    cy.validateToast("success", "Successfully added suspected issue");

    // delete the added ticket
    cy.dataCy("SERVER-1234-delete-btn").click();
    cy.contains("button", "Yes")
      .should("be.visible")
      .should("not.have.attr", "aria-disabled", "true");
    cy.contains("button", "Yes").click();
    validateAnnotationRowCount(issuesList, 1);
    validateAnnotationRowCount(suspectedIssuesList, 3);
    cy.validateToast("success", "Successfully removed suspected issue");
  });
});
