const hostsRoute = "/hosts";

const idParam = "hostId";
const distroParam = "distroId";
const statusesParam = "statuses";
const currentTaskIdParam = "currentTaskId";
const ownerParam = "startedBy";

const idFilter = "i-0d0ae8b83366d22";
const dnsFilter = "ec2-34-207-222-84.compute-1.amazonaws.com";
const distroFilter = "macos-1014";
const statusesFilter = "running";
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
    param: idParam,
    filterIconDataCy: "host-id-filter",
    filterValue: dnsFilter,
    filterUrlParam: `${idParam}=${dnsFilter}`,
    expectedIds: ["i-06f80fa6e28f93b7d"],
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
    filterUrlParam: `${statusesParam}=${statusesFilter}`,
    expectedIds: [
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
    ],
  },
];

describe("Hosts page filtering from table filters", () => {
  beforeEach(() => {
    cy.visit(`${hostsRoute}?page=0`);
    cy.dataCy("hosts-table").should("be.visible");
    cy.dataCy("hosts-table").should("have.attr", "data-loading", "false");
  });

  filterTests.forEach(
    ({ expectedIds, filterIconDataCy, filterUrlParam, filterValue, param }) => {
      it(`Filters hosts using table filter dropdowns for ${param}`, () => {
        cy.dataCy(filterIconDataCy).should("be.visible");
        cy.dataCy(filterIconDataCy).click();
        cy.dataCy(`${filterIconDataCy}-wrapper`).should("be.visible");
        if (param === statusesParam) {
          cy.getInputByLabel("Running").check({ force: true });
          cy.get("body").click();
        } else {
          cy.dataCy(`${filterIconDataCy}-input-filter`).should("be.visible");
          cy.dataCy(`${filterIconDataCy}-input-filter`).should("be.focused");

          cy.dataCy(`${filterIconDataCy}-input-filter`).type(
            `${filterValue}{enter}`,
            { scrollBehavior: false },
          );
        }
        cy.dataCy(`${filterIconDataCy}-wrapper`).should("not.exist");
        cy.location("search").should("contain", filterUrlParam);
        cy.dataCy("hosts-table").should("have.attr", "data-loading", "false");

        expectedIds.forEach((id) => {
          cy.dataCy("leafygreen-table-row").contains(id).should("be.visible");
        });

        cy.dataCy(filterIconDataCy).should("be.visible");
        cy.dataCy(filterIconDataCy).click();
        cy.dataCy(`${filterIconDataCy}-wrapper`).should("be.visible");
        if (param === statusesParam) {
          cy.getInputByLabel("Running").uncheck({ force: true });
        } else {
          cy.dataCy(`${filterIconDataCy}-input-filter`).should("be.visible");
          cy.dataCy(`${filterIconDataCy}-input-filter`)
            .should("be.focused")
            .focus()
            .clear()
            .type("{enter}");
        }
      });
    },
  );
});
