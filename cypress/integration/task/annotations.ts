import { popconfirmYesClassName } from "../../utils/popconfirm";

const taskWithAnnotations =
  "evergreen_ubuntu1604_test_annotations_b_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
const taskRoute = `/task/${taskWithAnnotations}/annotations`;

describe("Task Annotation Tab", () => {
  beforeEach(() => {
    cy.login();
  });

  it("annotations add and delete correctly", () => {
    cy.visit(taskRoute);
    const dataCyTableRows =
      "[data-test-id=suspected-issues-table] tr td:first-child";

    const dataCyTableRows2 = "[data-test-id=issues-table] tr td:first-child";
    cy.get(dataCyTableRows2).should("have.length", 1);
    cy.get(dataCyTableRows).should("have.length", 3);

    cy.dataCy("A-Random-Ticket-delete-btn").first().click();
    cy.get(popconfirmYesClassName).click();
    cy.get(dataCyTableRows2).should("have.length", 1);
    cy.get(dataCyTableRows).should("have.length", 2);

    cy.dataCy("add-suspected-issue-button").first().click();
    cy.dataCy("url-text-area").type("https://example.com/");
    cy.dataCy("issue-key-text-area").type("A-Random-Ticket");
    cy.dataCy("add-issue-save-button").click();

    cy.get(dataCyTableRows2).should("have.length", 1);
    cy.get(dataCyTableRows).should("have.length", 3);
  });

  it("annotations can be moved between lists", () => {
    cy.visit(taskRoute);
    const dataCyTableRows =
      "[data-test-id=suspected-issues-table] tr td:first-child";

    const dataCyTableRows2 = "[data-test-id=issues-table] tr td:first-child";
    cy.get(dataCyTableRows2).should("have.length", 1);
    cy.get(dataCyTableRows).should("have.length", 3);

    cy.dataCy("move-btn-AnotherOne").first().click();
    cy.get(popconfirmYesClassName).click();
    cy.get(dataCyTableRows2).should("have.length", 2);
    cy.get(dataCyTableRows).should("have.length", 2);

    cy.dataCy("move-btn-AnotherOne").first().click();
    cy.get(popconfirmYesClassName).click();
    cy.get(dataCyTableRows2).should("have.length", 1);
    cy.get(dataCyTableRows).should("have.length", 3);
  });
});
