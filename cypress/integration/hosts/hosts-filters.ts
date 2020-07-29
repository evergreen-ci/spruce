const hostsRoute = "/hosts";

const tableRow = "tr.ant-table-row";

// FILTERS
const idParam = "hostId";
const distroParam = "distroId";
const statusesParam = "statuses";
const currentTaskIdParam = "currentTaskId";
const ownerParam = "startedBy";

const idFilter = "i-0d0ae8b83366d22";
const distroFilter = "macos-1014";
const statusesFilter = "running,provisioning";
const currentTaskIdFilter =
  "mongodb_mongo_v3.6_debian92_sharding_auth_bc405c72dce4714da604810cdc90c132bd5fbaa1_20_07_20_17_39_20";
const ownerFilter = "mci";

const filterTests = [
  {
    param: idParam,
    filterIconDataCy: "host-id-filter",
    filterValue: idFilter,
    filterUrlParam: `${idParam}=${idFilter}`,
    expectedIds: ["i-0d0ae8b83366d22"],
  },
  {
    param: distroParam,
    filterIconDataCy: "distro-id-filter",
    filterValue: distroFilter,
    filterUrlParam: `${distroParam}=${distroFilter}`,
    expectedIds: [
      "macos-1014-68.macstadium.build.10gen",
      "macos-1014-68.macstadium.build.10gen.c",
      "macos-1014-68.macstadium.build.10gen.cc",
    ],
  },
  {
    param: statusesParam,
    filterIconDataCy: "statuses-filter",
    filterValue: statusesFilter,
    filterUrlParam: `limit=50&page=0&${statusesParam}=${statusesFilter}`,
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
    param: currentTaskIdParam,
    filterIconDataCy: "current-task-id-filter",
    filterValue: currentTaskIdFilter,
    filterUrlParam: `${currentTaskIdParam}=${currentTaskIdFilter}`,
    expectedIds: [
      "i-0fb9fe0592ea381",
      "i-0fb9fe0592ea3815",
      "i-0fb9fe0592ea38150",
    ],
  },
  {
    param: ownerParam,
    filterIconDataCy: "owner-filter",
    filterValue: ownerFilter,
    filterUrlParam: `${ownerParam}=${ownerFilter}`,
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

describe("Hosts page filtering from URL", () => {
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
    cy.visit(`${hostsRoute}?${idParam}=${idFilter}`);
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

describe("Hosts page filtering from table filters", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.listenGQL();
    cy.visit(hostsRoute);
  });

  filterTests.forEach(
    ({ param, expectedIds, filterIconDataCy, filterValue }) => {
      it(`Filters hosts using table filter dropdowns for ${param}`, () => {
        cy.dataCy(filterIconDataCy).click();

        cy.dataCy(`${filterIconDataCy}-wrapper`).within(() => {
          if (param === statusesParam) {
            cy.get(".cy-checkbox")
              .contains("Running")
              .click({ force: true });

            cy.get(".cy-checkbox")
              .contains("Provisioning")
              .click({ force: true });
          } else {
            cy.dataCy("input-filter").type(filterValue);
          }

          cy.dataCy("filter-button").click();
        });

        cy.get(tableRow).each(($el, index) =>
          cy.wrap($el).contains(expectedIds[index])
        );
      });
    }
  );
});
