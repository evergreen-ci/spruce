import { clickOnPageSizeBtnAndAssertURLandTableSize } from "../../utils";

describe("Host events", () => {
  const pathWithEvents = "/host/i-0f81a2d39744003dd";
  const dataCyTableRows = "[data-cy=host-events-table] .ant-table-row";

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("recentPageSize", "20");
    });
  });

  it("host events display the correct text", () => {
    cy.visit(pathWithEvents);
    clickOnPageSizeBtnAndAssertURLandTableSize(100, dataCyTableRows);

    const hostTypes = [
      {
        hostType: "host-converted-provisioning",
        text: "Host successfully converted provisioning type",
      },
      {
        hostType: "host-dns-name-set",
        text: "DNS Name set to ec2-12-12-12-122.compute-1.amazonaws.com",
      },
      {
        hostType: "stopped",
        text: "Host stop attempt failed",
      },
      {
        hostType: "started",
        text: "Host start attempt succeeded",
      },
      {
        hostType: "provision-error",
        text: "Host encountered error during provisioning",
      },
      {
        hostType: "agent-deploy-failed",
        text: "New agent deploy failed",
      },
      {
        hostType: "created",
        text: "Host creation succeeded",
      },
      {
        hostType: "agent-monitor-deploy-failed",
        text: "New agent monitor deploy failed",
      },
      {
        hostType: "agent-monitor-deployed",
        text: "Agent monitor deployed with revision 1fa212ac4acea6ce2a0123a123456c06e8cf72ea",
      },
      {
        hostType: "agent-deployed",
        text: "Agent deployed with revision 2019-05-25 from f4c4c42abc123456d14edfe4c123bb1a1a47dd12",
      },
      {
        hostType: "modified",
        text: "Host modify attempt failed",
      },
      {
        hostType: "host-jasper-restarting",
        text: "Jasper service marked as restarting by mci",
      },
      {
        hostType: "host-jasper-restarted",
        text: "Jasper service restarted with revision",
      },
      {
        hostType: "host-converting-provisioning",
        text: "Host converting provisioning type",
      },
      {
        hostType: "host-converted-provisioning",
        text: "Host successfully converted provisioning type",
      },
      {
        hostType: "host-dns-name-set",
        text: "DNS Name set to ec2-12-12-12-122.compute-1.amazonaws.com",
      },
      {
        hostType: "host-provisioned",
        text: "Marked as provisioned",
      },
      {
        hostType: "host-monitor-flag",
        text: "Flagged for termination because: unreachable",
      },
      {
        hostType: "host-expiration-warning-set",
        text: "Expiration warning sent",
      },
      {
        hostType: "host-running-task-set",
        text: "Assigned to run task evergreen_ubuntu1604_test_command_patch_5e823e1f28",
      },
      {
        hostType: "host-running-task-cleared",
        text: "Current running task cleared (was: ",
      },
      {
        hostType: "host-running-task-cleared",
        text: "evergreen_ubuntu1604_test_command_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
      },
      {
        hostType: "host-task-finished",
        text: "Task evergreen_ubuntu1604_test_command_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48 completed with status: test-timed-out",
      },
    ];
    hostTypes.forEach(({ hostType, text }) => {
      cy.dataCy(hostType).contains(text);
    });
  });

  it("host events with logs display the correct text and the logs get displayed when available", () => {
    const hostTypes = [
      {
        hostType: "host-script-executed",
        text: "Executed script on host",
        logsTitle: "Script logs",
      },
      {
        hostType: "host-script-execute-failed",
        text: "Failed to execute script on host",
        logsTitle: "Script logs",
      },
      {
        hostType: "host-teardown",
        text: "Teardown script failed in < 1 ms",
        logsTitle: "Teardown logs",
      },
      {
        hostType: "host-provision-failed",
        text: "Provisioning failed",
        logsTitle: "Provisioning logs",
      },
      {
        hostType: "host-jasper-restart-error",
        text: "Host encountered error when restarting Jasper service",
        logsTitle: "Provisioning logs",
      },
      {
        hostType: "host-converting-provisioning-error",
        text: "Host encountered error when converting reprovisioning",
        logsTitle: "Provisioning logs",
      },
      {
        hostType: "host-status-changed",
        text: "Status changed from running to unreachable by chaya.malik",
        logsTitle: "Additional details",
      },
      {
        hostType: "stopped",
        text: "Host stop attempt failed",
        logsTitle: "Additional details",
      },
      {
        hostType: "modified",
        text: "Host modify attempt failed",
        logsTitle: "Additional details",
      },
      {
        hostType: "host-creation-failed",
        text: "Host creation failed.",
        logsTitle: "Host creation logs",
      },
    ];
    cy.visit(pathWithEvents);
    clickOnPageSizeBtnAndAssertURLandTableSize(100, dataCyTableRows);

    hostTypes.forEach(({ hostType, logsTitle, text }) => {
      cy.dataCy(hostType)
        .contains(text)
        .within(() => {
          cy.dataCy("host-event-log").should("exist").contains(logsTitle);
        });
    });
    cy.dataCy("host-status-changed").find("[data-cy='host-event-log']").click();
    cy.dataCy("host-event-log-content")
      .should("exist")
      .contains("terminated via UI by chaya.malik");
  });

  it("host events logs do not display when not available", () => {
    cy.visit(pathWithEvents);
    clickOnPageSizeBtnAndAssertURLandTableSize(100, dataCyTableRows);
    cy.dataCy("host-status-changed")
      .contains("Status changed from running to stopping")
      .first()
      .within(() => {
        cy.dataCy("host-event-log").should("not.exist");
      });
  });

  it("host event links get displayed", () => {
    cy.visit(pathWithEvents);
    clickOnPageSizeBtnAndAssertURLandTableSize(100, dataCyTableRows);
    const hostTypes = [
      "host-running-task-set-link",
      "host-running-task-cleared-link",
      "host-task-finished-link",
    ];
    hostTypes.forEach((hostType) => {
      cy.dataCy(hostType).should("have.attr", "href");
    });
  });

  it("host event pagination last page displays the right items", () => {
    cy.visit("host/i-0f81a2d39744003dd?limit=10&page=3");
    cy.dataCy("host-provisioned").should("exist");
  });

  it("host events are displayed in the right timezone", () => {
    cy.visit("/preferences");
    cy.contains("Select a timezone").click();
    cy.contains("Hawaii").click();
    cy.contains("button", "Save Changes").click();
    cy.visit(pathWithEvents);
    cy.dataCy("HOST_JASPER_RESTARTING-time").contains(
      "Sep 30, 2017, 9:11:16 AM"
    );
    // Reset timezone so re-running this test works.
    cy.visit("/preferences");
    cy.contains("Hawaii").click();
    cy.contains("Select a timezone").click();
    cy.contains("button", "Save Changes").click();
  });
});
