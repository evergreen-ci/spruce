describe("Hosts Page Default", () => {
  const taskId =
    "mongo_tools_ubuntu1604_qa_dump_restore_with_archiving_current_patch_b7227e1b7aeaaa6283d53b32fc03968a46b19c2d_5f15ad3c3627e07772ab2d01_20_07_20_14_42_05";

  beforeEach(() => {
    cy.visit("/hosts?limit=10");
  });

  it("Renders hosts table with hosts sorted by status by default", () => {
    cy.dataCy("leafygreen-table-row").each(($el, index) =>
      cy.wrap($el).contains(defaultHostsFirstPage[index]),
    );
  });

  it("ID column value links to host page", () => {
    cy.dataCy("leafygreen-table-row")
      .first()
      .within(() => {
        cy.dataCy("host-id-link")
          .should("have.attr", "href")
          .and("eq", "/host/i-06f80fa6e28f93b");
      });
  });

  it("Current Task column value links to task page", () => {
    cy.dataCy("leafygreen-table-row")
      .first()
      .within(() => {
        cy.dataCy("current-task-link")
          .should("have.attr", "href")
          .and("eq", `/task/${taskId}`);
      });
  });
});

export const defaultHostsFirstPage = [
  "i-06f80fa6e28f93b",
  "i-06f80fa6e28f93b7",
  "i-06f80fa6e28f93b7d",
  "i-0fb9fe0592ea381",
  "i-0fb9fe0592ea3815",
  "i-0fb9fe0592ea38150",
  "macos-1014-68.macstadium.build.10gen",
  "macos-1014-68.macstadium.build.10gen.c",
  "macos-1014-68.macstadium.build.10gen.cc",
  "ubuntu1804-ppc-3.pic.build.10gen",
];
