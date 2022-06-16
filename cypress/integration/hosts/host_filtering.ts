const hostsRoute = "/hosts";

const tableRow = "tr.ant-table-row";

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

const distroFilterIconDataCy = "distro-id-filter";

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
    filterIconDataCy: distroFilterIconDataCy,
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
      "16326bd716fd4ad5845710c479c79e86c66b61bcef8ebbe7fc38dfc36fab512e",
      "1694cfe1eac28b3316339f6276021afcb2a07bcd21a266405835fd039557ea2d",
      "4b332e12790a585a0c7cbaf1650674f408117cf6134679c9e5f2e96cadd07923",
      "6e331e02aaaebba422d1f1d2dbd3e64f01776b84c68c672ea680e4b81b0719bb",
      "7f909d47566126bd39a05c1a5bd5d111c2e68de3830a8be414c18c231a47f4fc",
      "a99b50cd37b012c53db7207e4ba8b52989aefab551176c07962cea979abcc479",
      "b700d10f21a5386c827251a029dd931b5ea910377e0bb93f3393b17fb9bdbd08",
      "build10.ny.cbi.10gen",
      "build10.ny.cbi.10gen.c",
      "build10.ny.cbi.10gen.cc",
      "c04d193c4de174376167746bc268426a4085bffb364c4740e0564ca3eeee6875",
      "i-04ade558e1e26b0ad",
      "i-092593689871a50dc",
      "i-0a5b8aa85c469e35d",
      "i-0d0ae8b83366d22",
      "i-0d0ae8b83366d22b",
      "i-0d0ae8b83366d22be",
      "i-0f81a2d39744003",
      "i-0f81a2d39744003d",
      "i-0f81a2d39744003dd",
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

describe("Hosts page filtering from URL", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Calculates number of pages based on total hosts count if no filters", () => {
    cy.visit(hostsRoute);
    cy.get(".ant-pagination-simple-pager")
      .should("have.attr", "title")
      .and("eq", "1/4");
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
});

describe("Hosts page filtering from table filters", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.visit(`${hostsRoute}?limit=100&page=0`);
    cy.dataCy("hosts-table").should("be.visible");
    cy.dataCy("hosts-table").should("not.have.attr", "data-loading", "true");
  });

  it("Filters hosts with input value when Enter key is pressed", () => {
    cy.dataCy(distroFilterIconDataCy).click();

    cy.dataCy(`${distroFilterIconDataCy}-wrapper`).within(() => {
      cy.dataCy("input-filter").type("centos6-perf").type("{enter}");
    });

    cy.get(tableRow).each(($el, index) =>
      cy
        .wrap($el)
        .contains(
          [
            "16326bd716fd4ad5845710c479c79e86c66b61bcef8ebbe7fc38dfc36fab512e",
            "1694cfe1eac28b3316339f6276021afcb2a07bcd21a266405835fd039557ea2d",
            "4b332e12790a585a0c7cbaf1650674f408117cf6134679c9e5f2e96cadd07923",
            "6e331e02aaaebba422d1f1d2dbd3e64f01776b84c68c672ea680e4b81b0719bb",
            "7f909d47566126bd39a05c1a5bd5d111c2e68de3830a8be414c18c231a47f4fc",
            "a99b50cd37b012c53db7207e4ba8b52989aefab551176c07962cea979abcc479",
            "b700d10f21a5386c827251a029dd931b5ea910377e0bb93f3393b17fb9bdbd08",
            "build10.ny.cbi.10gen",
            "build10.ny.cbi.10gen.c",
            "build10.ny.cbi.10gen.cc",
            "c04d193c4de174376167746bc268426a4085bffb364c4740e0564ca3eeee6875",
            "i-0a5b8aa85c469e35d",
          ][index]
        )
    );
  });

  it("Trims the whitespace from filter input values", () => {
    cy.dataCy(distroFilterIconDataCy).click();

    cy.dataCy(`${distroFilterIconDataCy}-wrapper`).within(() => {
      cy.dataCy("input-filter").type("      centos6-perf     ").type("{enter}");
    });

    cy.get(tableRow).each(($el, index) =>
      cy
        .wrap($el)
        .contains(
          [
            "16326bd716fd4ad5845710c479c79e86c66b61bcef8ebbe7fc38dfc36fab512e",
            "1694cfe1eac28b3316339f6276021afcb2a07bcd21a266405835fd039557ea2d",
            "4b332e12790a585a0c7cbaf1650674f408117cf6134679c9e5f2e96cadd07923",
            "6e331e02aaaebba422d1f1d2dbd3e64f01776b84c68c672ea680e4b81b0719bb",
            "7f909d47566126bd39a05c1a5bd5d111c2e68de3830a8be414c18c231a47f4fc",
            "a99b50cd37b012c53db7207e4ba8b52989aefab551176c07962cea979abcc479",
            "b700d10f21a5386c827251a029dd931b5ea910377e0bb93f3393b17fb9bdbd08",
            "build10.ny.cbi.10gen",
            "build10.ny.cbi.10gen.c",
            "build10.ny.cbi.10gen.cc",
            "c04d193c4de174376167746bc268426a4085bffb364c4740e0564ca3eeee6875",
            "i-0a5b8aa85c469e35d",
          ][index]
        )
    );
  });

  filterTests.forEach(({ param, filterIconDataCy, filterValue }) => {
    it(`Filters hosts using table filter dropdowns for ${param}`, () => {
      cy.dataCy(filterIconDataCy).click();
      cy.dataCy(`${filterIconDataCy}-wrapper`).should("be.visible");
      cy.dataCy(`${filterIconDataCy}-wrapper`).within(() => {
        if (param === statusesParam) {
          cy.getInputByLabel("Running").click({ force: true });
        } else if (param === currentTaskIdParam) {
          // do this for really long text because otherwise cypress times out while typing and fails
          const subString = filterValue.substr(0, filterValue.length - 1);
          const lastChar = filterValue.slice(-1);

          cy.dataCy("input-filter")
            .as("currentTask")
            .invoke("val", subString)
            .trigger("input");

          cy.get("@currentTask").type(lastChar).type(`{enter}`);
        } else {
          cy.dataCy("input-filter").type(filterValue).type(`{enter}`);
        }
      });
    });
  });
});
