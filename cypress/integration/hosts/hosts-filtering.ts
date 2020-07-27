const hostsRoute = "/hosts";

const tableRow = "tr.ant-table-row";

// FILTERS
const idFilter = "hostId=i-0d0ae8b83366d22";
const distroFilter = "distroId=macos-1014";
const statusesFilter = "limit=50&page=0&statuses=running,provisioning";
const ownerFilter = "startedBy=mci";

const filterTests = [
  {
    param: "hostId",
    filterUrlParam: idFilter,
    expectedIds: ["i-0d0ae8b83366d22"],
  },
  {
    param: "distroId",
    filterUrlParam: distroFilter,
    expectedIds: [
      "macos-1014-68.macstadium.build.10gen",
      "macos-1014-68.macstadium.build.10gen.c",
      "macos-1014-68.macstadium.build.10gen.cc",
    ],
  },
  {
    param: "currentTaskId",
    filterUrlParam: statusesFilter,
    expectedIds: [
      "i-06f80fa6e28f93b",
      "i-06f80fa6e28f93b7",
      "i-06f80fa6e28f93b7d",
      "i-0fb9fe0592ea381",
      "i-0fb9fe0592ea3815",
      "i-0fb9fe0592ea38150",
      "build10.ny.cbi.10gen",
      "build10.ny.cbi.10gen.c",
      "build10.ny.cbi.10gen.cc",
      "i-0d0ae8b83366d22",
      "i-0d0ae8b83366d22b",
      "i-0d0ae8b83366d22be",
      "i-0f81a2d39744003",
      "i-0f81a2d39744003d",
      "i-0f81a2d39744003dd",
      "rhel71-ppc-1.pic.build.10gen",
      "rhel71-ppc-1.pic.build.10gen.c",
      "rhel71-ppc-1.pic.build.10gen.cc",
      "ubuntu1604-ppc-1.pic.build.10gen",
      "ubuntu1604-ppc-1.pic.build.10gen.c",
      "ubuntu1604-ppc-1.pic.build.10gen.cc",
    ],
  },
  {
    param: "startedBy",
    filterUrlParam: ownerFilter,
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
      "ubuntu1804-ppc-3.pic.build.10gen.c",
      "ubuntu1804-ppc-3.pic.build.10gen.cc",
      "build10.ny.cbi.10gen",
      "build10.ny.cbi.10gen.c",
      "build10.ny.cbi.10gen.cc",
      "i-0d0ae8b83366d22",
      "i-0d0ae8b83366d22b",
      "i-0d0ae8b83366d22be",
      "i-0f81a2d39744003",
      "i-0f81a2d39744003d",
      "i-0f81a2d39744003dd",
      "rhel71-ppc-1.pic.build.10gen",
      "rhel71-ppc-1.pic.build.10gen.c",
      "rhel71-ppc-1.pic.build.10gen.cc",
      "ubuntu1604-ppc-1.pic.build.10gen",
      "ubuntu1604-ppc-1.pic.build.10gen.c",
      "ubuntu1604-ppc-1.pic.build.10gen.cc",
    ],
  },
];

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
  {
    sorterName: "owner",
    sortBy: "OWNER",
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

describe("Hosts Page Filtering", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.listenGQL();
  });

  it("Calculates number of pages based on total hosts count if no filters", () => {
    cy.visit(hostsRoute);
    cy.get(".ant-pagination-simple-pager")
      .should("have.attr", "title")
      .and("eq", "1/3");
  });
  it("Calculates number of pages based on filtered hosts count if hosts are filtered", () => {
    cy.visit(`${hostsRoute}?${idFilter}`);
    cy.get(".ant-pagination-simple-pager")
      .should("have.attr", "title")
      .and("eq", "1/1");
  });

  filterTests.forEach(({ param, filterUrlParam, expectedIds }) => {
    it(`Filters by ${param} if ${param} url query param exists`, () => {
      cy.visit(`${hostsRoute}?${filterUrlParam}`);
      cy.get(tableRow).each(($el, index) =>
        cy.wrap($el).contains(expectedIds[index])
      );
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
