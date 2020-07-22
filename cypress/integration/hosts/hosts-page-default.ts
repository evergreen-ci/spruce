describe("Hosts Page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.listenGQL();
    cy.visit("/hosts");
  });

  it("Renders hosts table with hosts sorted by status by default", () => {
    cy.get("tr.ant-table-row").each(($el, index) =>
      cy.wrap($el).contains(defaultHostsOrder[index])
    );
  });

  it("ID column value links to host page", () => {
    cy.get("tr.ant-table-row")
      .first()
      .within(() => {
        cy.dataCy("host-id-link")
          .should("have.attr", "href")
          .and("eq", "/host/i-06f80fa6e28f93b7d");
      });
  });

  it("Current Task column value links to task page", () => {
    cy.get("tr.ant-table-row")
      .first()
      .within(() => {
        cy.dataCy("current-task-link")
          .should("have.attr", "href")
          .and("eq", `/task/${taskId}`);
      });
  });

  // FUTURE TESTS
  // test pagination
  // first page of results
  // second page of results
  // can go forward and back using the pagination ui
  // can change number of hosts rendered by adjusting limit

  // test filtering
  // for each of the filterable headers, i click on a filter, input filter, and filtered hosts are rendered
  // i can reset the filter
  // url params are updated to reflect filter values

  // test sorting
  // clicking on table header sorts hosts in ascending and descending order
  // url param is updated with sortBy and sortDirection values
});

const defaultHostsOrder = [
  "i-06f80fa6e28f93b7d",
  "i-0fb9fe0592ea38150",
  "macos-1014-68.macstadium.build.10gen.cc",
  "ubuntu1804-ppc-3.pic.build.10gen.cc",
  "build10.ny.cbi.10gen.cc",
  "i-0d0ae8b83366d22be",
  "i-0f81a2d39744003dd",
  "rhel71-ppc-1.pic.build.10gen.cc",
  "ubuntu1604-ppc-1.pic.build.10gen.cc",
];

const taskId =
  "mongo_tools_ubuntu1604_qa_dump_restore_with_archiving_current_patch_b7227e1b7aeaaa6283d53b32fc03968a46b19c2d_5f15ad3c3627e07772ab2d01_20_07_20_14_42_05";
