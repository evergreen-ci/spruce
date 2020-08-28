const pathWithTask = `/host/i-0fb9fe0592ea3815`;
const pathNoTask = `/host/macos-1014-68.macstadium.build.10gen`;

describe("Host page title and sidebar ", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.listenGQL();
    cy.preserveCookies();
  });

  it("title shows the host name", () => {
    cy.visit(pathNoTask);
    cy.get("[data-cy=page-title").should(
      "include.text",
      "Host: macos-1014-68.macstadium.build.10gen"
    );
  });

  it("Metadata card last Communication has the correct values", () => {
    cy.visit("/preferences");
    cy.dataCy("timezone-field").click();
    cy.dataCy("Hawaii-option").click();
    cy.dataCy("save-profile-changes-button").click();

    cy.visit(pathWithTask);
    cy.dataCy("host-last-communication").contains(
      "Last Communication: Jul 20, 2020 9:16:36 am"
    );
  });

  it("Metadata card Distro and current running links should have href", () => {
    cy.visit(pathWithTask);
    cy.get("[data-cy=distro-link]").should("have.attr", "href");
    cy.get("[data-cy=running-task-link]").should("have.attr", "href");
  });

  it("Metadata card Current task should display none when running task does not exist", () => {
    cy.visit(pathNoTask);
    cy.dataCy("current-running-task").contains("none");
  });

  it("sshCommand has the correct values", () => {
    cy.visit(pathWithTask);
    cy.dataCy("ssh-command").contains(
      "ssh admin@ec2-54-146-18-248.compute-1.amazonaws.com"
    );
  });
});
