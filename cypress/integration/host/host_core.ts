describe("Host load page with nonexistent host", () => {
  it("Should show an error message when navigating to a nonexistent host id", () => {
    cy.visit("host/not-real");
    cy.validateToast("error");
  });
});

describe("Host page title is displayed ", () => {
  it("title shows the host name", () => {
    cy.visit(`host/macos-1014-68.macstadium.build.10gen`);
    cy.dataCy("page-title").should(
      "include.text",
      "Host: macos-1014-68.macstadium.build.10gen",
    );
  });
});
