describe("Host page title and sidebar ", () => {
  const pathWithTask = `/host/i-0fb9fe0592ea3815`;
  const pathNoTask = `/host/macos-1014-68.macstadium.build.10gen`;

  it("title shows the host name", () => {
    cy.visit(pathNoTask);
    cy.dataCy("page-title").should(
      "include.text",
      "Host: macos-1014-68.macstadium.build.10gen",
    );
  });

  it("Metadata card Current task should display none when running task does not exist", () => {
    cy.visit(pathNoTask);
    cy.dataCy("current-running-task").contains("none");
  });

  it("Metadata card Distro and current running links should have href", () => {
    cy.visit(pathWithTask);
    cy.get("[data-cy=distro-link]").should("have.attr", "href");
    cy.get("[data-cy=running-task-link]").should("have.attr", "href");
  });

  it("sshCommand has the correct values", () => {
    cy.visit(pathWithTask);
    cy.dataCy("ssh-command").contains(
      "ssh admin@ec2-54-146-18-248.compute-1.amazonaws.com",
    );
  });
});
