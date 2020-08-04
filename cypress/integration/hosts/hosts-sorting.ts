const hostsRoute = "/hosts";

const tableRow = "tr.ant-table-row";

const sortByTests = [
  {
    sorterName: "ID",
    sortBy: "ID",
    expectedIds: [
      "build10.ny.cbi.10gen",
      "build10.ny.cbi.10gen.c",
      "build10.ny.cbi.10gen.cc",
      "i-06f80fa6e28f93b",
      "i-06f80fa6e28f93b7",
      "i-06f80fa6e28f93b7d",
      "i-0d0ae8b83366d22",
      "i-0d0ae8b83366d22b",
      "i-0d0ae8b83366d22be",
      "i-0f81a2d39744003",
    ],
  },
  {
    sorterName: "distro",
    sortBy: "DISTRO",
    expectedIds: [
      "build10.ny.cbi.10gen",
      "build10.ny.cbi.10gen.c",
      "build10.ny.cbi.10gen.cc",
      "i-0fb9fe0592ea381",
      "i-0fb9fe0592ea3815",
      "i-0fb9fe0592ea38150",
      "macos-1014-68.macstadium.build.10gen",
      "macos-1014-68.macstadium.build.10gen.c",
      "macos-1014-68.macstadium.build.10gen.cc",
      "rhel71-ppc-1.pic.build.10gen",
    ],
  },
  {
    sorterName: "current task",
    sortBy: "CURRENT_TASK",
    expectedIds: [
      "i-0d0ae8b83366d22",
      "i-0d0ae8b83366d22b",
      "i-0d0ae8b83366d22be",
      "macos-1014-68.macstadium.build.10gen",
      "macos-1014-68.macstadium.build.10gen.c",
      "macos-1014-68.macstadium.build.10gen.cc",
      "ubuntu1604-ppc-1.pic.build.10gen",
      "ubuntu1604-ppc-1.pic.build.10gen.c",
      "ubuntu1604-ppc-1.pic.build.10gen.cc",
      "ubuntu1804-ppc-3.pic.build.10gen",
    ],
  },
  {
    sorterName: "status",
    sortBy: "STATUS",
    expectedIds: [
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
    ],
  },
  {
    sorterName: "elapsed",
    sortBy: "ELAPSED",
    expectedIds: [
      "i-0d0ae8b83366d22",
      "i-0d0ae8b83366d22b",
      "i-0d0ae8b83366d22be",
      "macos-1014-68.macstadium.build.10gen",
      "macos-1014-68.macstadium.build.10gen.c",
      "macos-1014-68.macstadium.build.10gen.cc",
      "ubuntu1604-ppc-1.pic.build.10gen",
      "ubuntu1604-ppc-1.pic.build.10gen.c",
      "ubuntu1604-ppc-1.pic.build.10gen.cc",
      "ubuntu1804-ppc-3.pic.build.10gen",
    ],
  },
  {
    sorterName: "uptime",
    sortBy: "UPTIME",
    expectedIds: [
      "ubuntu1604-ppc-1.pic.build.10gen",
      "ubuntu1604-ppc-1.pic.build.10gen.c",
      "ubuntu1604-ppc-1.pic.build.10gen.cc",
      "rhel71-ppc-1.pic.build.10gen",
      "rhel71-ppc-1.pic.build.10gen.c",
      "rhel71-ppc-1.pic.build.10gen.cc",
      "build10.ny.cbi.10gen",
      "build10.ny.cbi.10gen.c",
      "build10.ny.cbi.10gen.cc",
      "ubuntu1804-ppc-3.pic.build.10gen",
    ],
  },
  {
    sorterName: "idle time",
    sortBy: "IDLE_TIME",
    expectedIds: [
      "build10.ny.cbi.10gen",
      "build10.ny.cbi.10gen.c",
      "build10.ny.cbi.10gen.cc",
      "macos-1014-68.macstadium.build.10gen",
      "macos-1014-68.macstadium.build.10gen.c",
      "macos-1014-68.macstadium.build.10gen.cc",
      "rhel71-ppc-1.pic.build.10gen",
      "rhel71-ppc-1.pic.build.10gen.c",
      "rhel71-ppc-1.pic.build.10gen.cc",
      "ubuntu1604-ppc-1.pic.build.10gen",
    ],
  },
];

const sortDirectionTests = [
  {
    sortDir: "ASC",
    order: "ascending",
    expectedIds: [
      "i-0d0ae8b83366d22",
      "i-0d0ae8b83366d22b",
      "i-0d0ae8b83366d22be",
      "macos-1014-68.macstadium.build.10gen",
      "macos-1014-68.macstadium.build.10gen.c",
      "macos-1014-68.macstadium.build.10gen.cc",
      "ubuntu1604-ppc-1.pic.build.10gen",
      "ubuntu1604-ppc-1.pic.build.10gen.c",
      "ubuntu1604-ppc-1.pic.build.10gen.cc",
      "ubuntu1804-ppc-3.pic.build.10gen",
    ],
  },
  {
    sortDir: "DESC",
    order: "descending",
    expectedIds: [
      "build10.ny.cbi.10gen",
      "build10.ny.cbi.10gen.c",
      "build10.ny.cbi.10gen.cc",
      "i-0f81a2d39744003",
      "i-0f81a2d39744003d",
      "i-0f81a2d39744003dd",
      "i-0fb9fe0592ea381",
      "i-0fb9fe0592ea3815",
      "i-0fb9fe0592ea38150",
      "i-06f80fa6e28f93b",
    ],
  },
];

describe("Hosts page sorting", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.listenGQL();
  });

  it("Status sorter is selected by default if no sort params in url", () => {
    cy.visit(hostsRoute);
    cy.get(".cy-task-table-col-STATUS").within(() => {
      cy.get("[data-icon=caret-up]")
        .should("have.attr", "fill")
        .and("eq", "currentColor");
    });
  });

  it("Status sorter has initial value of sort param from url", () => {
    cy.visit(`${hostsRoute}?page=0&sortBy=DISTRO&sortDir=DESC`);
    cy.get(".cy-task-table-col-DISTRO").within(() => {
      cy.get("[data-icon=caret-down]")
        .should("have.attr", "fill")
        .and("eq", "currentColor");
    });
  });

  it("Clicking column header updates selected sorter caret icon", () => {
    cy.visit(hostsRoute);
    cy.get(".cy-task-table-col-STATUS").click();
    cy.get(".cy-task-table-col-STATUS").within(() => {
      cy.get("[data-icon=caret-down]")
        .should("have.attr", "fill")
        .and("eq", "currentColor");
    });
  });

  sortByTests.forEach(({ sorterName, sortBy, expectedIds }) => {
    it(`Sorts by ${sorterName} when sortBy = ${sortBy}`, () => {
      cy.visit(`${hostsRoute}?sortBy=${sortBy}`);
      cy.get(tableRow).each(($el, index) =>
        cy.wrap($el).contains(expectedIds[index])
      );
    });
  });

  sortDirectionTests.forEach(({ order, sortDir, expectedIds }) => {
    it(`Sorts in ${order} order when sortDir = ${sortDir}`, () => {
      cy.visit(`${hostsRoute}?page=0&sortBy=CURRENT_TASK&sortDir=${sortDir}`);
      cy.get(tableRow).each(($el, index) =>
        cy.wrap($el).contains(expectedIds[index])
      );
    });
  });

  it("Uses default sortBy and sortDir if sortBy or sortDir param is invalid", () => {
    cy.visit(`${hostsRoute}?sortBy=INVALID&sortDir=INVALID`);
    cy.get(tableRow).each(($el, index) =>
      cy
        .wrap($el)
        .contains(
          [
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
          ][index]
        )
    );
  });
});
