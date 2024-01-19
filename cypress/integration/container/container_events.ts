import { clickOnPageSizeBtnAndAssertURLandTableSize } from "../../utils";

describe("Container events", () => {
  const pathWithEvents = "/container/localhost";
  const taskId =
    "logkeeper_ubuntu_test_edd78c1d581bf757a880777b00685321685a8e67_16_10_20_21_58_58";
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("recentPageSize", "20");
    });
    cy.visit(pathWithEvents);
  });

  it("events display the correct text", () => {
    const eventTypes = [
      {
        event: "event-type-ASSIGNED_TASK",
        text: `Task ${taskId} assigned.`,
      },
      {
        event: "event-type-CLEARED_TASK",
        text: `Task ${taskId} cleared.`,
      },
      {
        event: "event-type-CONTAINER_TASK_FINISHED",
        text: `Task ${taskId} finished with status failed.`,
      },
      {
        event: "event-type-STATUS_CHANGE",
        text: "Container status changed from starting to terminated.",
      },
    ];

    eventTypes.forEach(({ event, text }) => {
      cy.dataCy(event).contains(text);
    });
  });

  it("event links get displayed", () => {
    const eventTypes = [
      "event-type-CONTAINER_TASK_FINISHED",
      "event-type-CLEARED_TASK",
      "event-type-CONTAINER_TASK_FINISHED",
    ];
    eventTypes.forEach((type) => {
      cy.dataCy(type)
        .find("a")
        .should(
          "have.attr",
          "href",
          "/task/logkeeper_ubuntu_test_edd78c1d581bf757a880777b00685321685a8e67_16_10_20_21_58_58?execution=0",
        );
    });
  });

  it("pagination component updates the page size and renders the correct number of rows", () => {
    clickOnPageSizeBtnAndAssertURLandTableSize(10, allRows);
  });

  it("events are displayed in the right timezone", () => {
    cy.dataCy("ASSIGNED_TASK-time").contains("Apr 4, 2023, 4:34:03 PM");
    cy.visit("/preferences");
    cy.contains("Select a timezone").click();
    cy.contains("Chatham Islands").click();
    cy.contains("button", "Save Changes").click();
    cy.visit(pathWithEvents);
    cy.dataCy("ASSIGNED_TASK-time").contains("Apr 5, 2023, 5:19:03 AM");
    // undo preferences change
    cy.visit("/preferences");
    cy.contains("Chatham Islands").click();
    cy.contains("Select a timezone").last().click();
    cy.contains("button", "Save Changes").click();
  });
});

const allRows = "[data-cy=container-events] > tbody > tr";
