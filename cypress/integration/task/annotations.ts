import { popconfirmYesClassName } from "../../utils/popconfirm";

const taskWithAnnotations =
  "evergreen_ubuntu1604_test_annotations_b_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
const taskRoute = `/task/${taskWithAnnotations}/annotations`;

const suspectedIssuesTable =
  "[data-test-id=suspected-issues-table] tr td:first-child";
const issuesTable = "[data-test-id=issues-table] tr td:first-child";

describe("Task Annotation Tab", () => {
  before(() => {
    cy.login();
    cy.visit(taskRoute);
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("annotations can be moved between lists", () => {
    cy.get(issuesTable).should("have.length", 1);
    cy.get(suspectedIssuesTable).should("have.length", 3);

    // move from suspectedIssues to Issues
    cy.dataCy("move-btn-AnotherOne").click();
    cy.get(popconfirmYesClassName).click();
    cy.get(issuesTable).should("have.length", 2);
    cy.get(suspectedIssuesTable).should("have.length", 2);

    // move from Issues to suspectedIssues
    cy.dataCy("move-btn-AnotherOne").click();
    cy.get(popconfirmYesClassName).click();
    cy.get(issuesTable).should("have.length", 1);
    cy.get(suspectedIssuesTable).should("have.length", 3);
  });

  it("annotations add and delete correctly", () => {
    cy.get(issuesTable).should("have.length", 1);
    cy.get(suspectedIssuesTable).should("have.length", 3);

    // add a ticket
    cy.dataCy("add-suspected-issue-button").click({ force: true });
    cy.dataCy("issue-url").type("https://jira.example.com/browse/SERVER-1234");
    cy.dataCy("issue-key").type("A-New-Ticket");
    cy.contains("Add suspected issue").click();
    cy.get(issuesTable).should("have.length", 1);
    cy.get(suspectedIssuesTable).should("have.length", 4);

    // delete the added ticket
    cy.dataCy("A-New-Ticket-delete-btn").click();
    cy.get(popconfirmYesClassName).click();
    cy.get(issuesTable).should("have.length", 1);
    cy.get(suspectedIssuesTable).should("have.length", 3);
  });
});
