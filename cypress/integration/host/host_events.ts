const pathWithEvents = `/host/i-0f81a2d39744003dd`;

describe("Host events", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.listenGQL();
    cy.preserveCookies();
  });

  it("host events display the correct text", () => {
    cy.visit(pathWithEvents);
    cy.dataCy("created").contains("Host created");
    cy.dataCy("agent-deploy-failed").contains("New agent deploy failed");
    cy.dataCy("provision-error").contains(
      "Host encountered error during provisioning"
    );
    cy.dataCy("started").contains("Host start attempt succeeded");
    cy.dataCy("stopped").contains("Host stop attempt");
    cy.dataCy("modified").contains("Host modify attempt");
    cy.dataCy("agent-deployed").contains(
      "Agent deployed with revision 2019-05-25 from f4c4c42abc123456d14edfe4c123bb1a1a47dd12"
    );
    cy.dataCy("agent-monitor-deployed").contains(
      "Agent monitor deployed with revision 1fa212ac4acea6ce2a0123a123456c06e8cf72ea"
    );
    cy.dataCy("agent-monitor-deploy-failed").contains(
      "New agent monitor deploy failed"
    );
    cy.dataCy("host-jasper-restarting").contains(
      "Jasper service marked as restarting by mci"
    );
    cy.dataCy("host-jasper-restarted").contains(
      "Jasper service restarted with revision"
    );
    cy.dataCy("host-converting-provisioning").contains(
      "Host converting provisioning type"
    );
    cy.dataCy("host-converted-provisioning").contains(
      "Host successfully converted provisioning type"
    );
    cy.dataCy("host-dns-name-set").contains(
      "DNS Name set to ec2-12-12-12-122.compute-1.amazonaws.com"
    );

    cy.dataCy("host-provisioned").contains("Marked as provisioned");

    cy.dataCy("host-task-pid-set").contains("PID of running task set to 123");
    cy.dataCy("host-monitor-flag").contains(
      "Flagged for termination because: unreachable"
    );

    cy.dataCy("host-expiration-warning-set").contains(
      "Expiration warning sent"
    );
    cy.dataCy("host-running-task-set").contains(
      "Assigned to run task evergreen_ubuntu1604_test_command_patch_5e823e1f28..."
    );
    cy.dataCy("host-running-task-cleared").contains(
      "Current running task cleared (was:evergreen_ubuntu1604_test_command_patch_5e823e1f28...)"
    );
    cy.dataCy("host-task-finished").contains(
      "Task evergreen_ubuntu1604_test_command_patch_5e823e1f28... completed with status: test-timed-out"
    );
  });

  it("host events with logs display the correct text and the logs get displayed when available", () => {
    cy.visit(pathWithEvents);
    cy.dataCy("host-script-executed")
      .contains("Executed script on host")
      .within(() => {
        cy.dataCy("host-event-logs")
          .should("exist")
          .contains("Script logs");
      });
    cy.dataCy("host-script-execute-failed")
      .contains("Failed to execute script on host")
      .within(() => {
        cy.dataCy("host-event-logs")
          .should("exist")
          .contains("Script logs");
      });
    cy.dataCy("host-status-changed")
      .contains("Status changed from running to unreachable")
      .within(() => {
        cy.dataCy("host-event-logs").should("not.exist");
      });
    cy.dataCy("host-teardown")
      .contains("Teardown script failed in < 1 ms")
      .within(() => {
        cy.dataCy("host-event-logs")
          .should("exist")
          .contains("Teardown logs");
      });
    cy.dataCy("host-provision-failed")
      .contains("Provisioning failed")
      .within(() => {
        cy.dataCy("host-event-logs")
          .should("exist")
          .contains("Provisioning logs");
      });
    cy.dataCy("host-jasper-restart-error")
      .contains("Host encountered error when restarting Jasper service")
      .within(() => {
        cy.dataCy("host-event-logs")
          .should("exist")
          .contains("Provisioning logs");
      });
    cy.dataCy("host-converting-provisioning-error")
      .contains("Host encountered error when converting reprovisioning")
      .within(() => {
        cy.dataCy("host-event-logs")
          .should("exist")
          .contains("Provisioning logs");
      });
  });

  it("host event links get displayed", () => {
    cy.dataCy("host-running-task-set-link").should("have.attr", "href");
    cy.dataCy("host-running-task-cleared-link").should("have.attr", "href");
    cy.dataCy("host-task-finished-link").should("have.attr", "href");
  });
});
