const pathWithEvents = `/host/i-0f81a2d39744003dd`;

describe("Host events", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("host events display the correct text", () => {
    cy.visit(pathWithEvents);
    cy.dataCy("host-event-table-page-size-selector").click();
    cy.dataCy("host-event-table-page-size-selector-100").click();

    const dataCyTableRows = "[data-cy=host-events-table] tr td:first-child";
    cy.get(dataCyTableRows).should("have.length.of.at.most", 32);

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
        text: "Host stop attempt",
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
        text: "Host created",
      },
      {
        hostType: "agent-monitor-deploy-failed",
        text: "New agent monitor deploy failed",
      },
      {
        hostType: "agent-monitor-deployed",
        text:
          "Agent monitor deployed with revision 1fa212ac4acea6ce2a0123a123456c06e8cf72ea",
      },
      {
        hostType: "agent-deployed",
        text:
          "Agent deployed with revision 2019-05-25 from f4c4c42abc123456d14edfe4c123bb1a1a47dd12",
      },
      {
        hostType: "modified",
        text: "Host modify attempt",
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
        hostType: "host-task-pid-set",
        text: "PID of running task set to 123",
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
        text:
          "Assigned to run task evergreen_ubuntu1604_test_command_patch_5e823e1f28...",
      },
      {
        hostType: "host-running-task-cleared",
        text:
          "Current running task cleared (was:evergreen_ubuntu1604_test_command_patch_5e823e1f28...)",
      },
      {
        hostType: "host-task-finished",
        text:
          "Task evergreen_ubuntu1604_test_command_patch_5e823e1f28... completed with status: test-timed-out",
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
    ];
    cy.visit(pathWithEvents);
    cy.dataCy("host-event-table-page-size-selector").click();
    cy.dataCy("host-event-table-page-size-selector-100").click();
    hostTypes.forEach(({ hostType, text, logsTitle }) => {
      cy.dataCy(hostType)
        .contains(text)
        .within(() => {
          cy.dataCy("host-event-logs").should("exist").contains(logsTitle);
        });
    });
    cy.dataCy("host-status-log").click();
    cy.dataCy("host-event-log-content")
      .should("exist")
      .contains("terminated via UI by chaya.malik");
  });

  it("host events logs do not display when not available", () => {
    cy.dataCy("host-event-table-page-size-selector").click();
    cy.dataCy("host-event-table-page-size-selector-100").click();
    cy.dataCy("host-status-changed")
      .contains("Status changed from running to stopping")
      .within(() => {
        cy.dataCy("host-event-logs").should("not.exist");
      });
  });

  it("host event links get displayed", () => {
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
    const hostTypes = ["host-running-task-set-link", "host-provisioned"];
    hostTypes.forEach((hostType) => {
      cy.dataCy(hostType).should("exist");
    });
  });

  it("host events are displayed in the right timezone", () => {
    cy.visit("/preferences");
    cy.contains("Select timezone").click();
    cy.contains("Hawaii").click();
    cy.contains("Save Changes").click();
    cy.visit(pathWithEvents);
    cy.dataCy("HOST_JASPER_RESTARTING-time").contains(
      "Sep 30, 2017, 9:11:16 AM"
    );
  });
});
