const sortByTests = [
  {
    sorterName: "ID",
    sortBy: "ID",
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
    sorterName: "distro",
    sortBy: "DISTRO",
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
    sorterName: "current task",
    sortBy: "CURRENT_TASK",
    expectedIds: [
      "i-04ade558e1e26b0ad",
      "i-0d0ae8b83366d22",
      "i-0d0ae8b83366d22b",
      "i-0d0ae8b83366d22be",
      "macos-1014-68.macstadium.build.10gen",
      "macos-1014-68.macstadium.build.10gen.c",
      "macos-1014-68.macstadium.build.10gen.cc",
      "ubuntu1604-ppc-1.pic.build.10gen",
      "ubuntu1604-ppc-1.pic.build.10gen.c",
      "ubuntu1604-ppc-1.pic.build.10gen.cc",
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
      "i-04ade558e1e26b0ad",
      "i-0d0ae8b83366d22",
      "i-0d0ae8b83366d22b",
      "i-0d0ae8b83366d22be",
      "macos-1014-68.macstadium.build.10gen",
      "macos-1014-68.macstadium.build.10gen.c",
      "macos-1014-68.macstadium.build.10gen.cc",
      "ubuntu1604-ppc-1.pic.build.10gen",
      "ubuntu1604-ppc-1.pic.build.10gen.c",
      "ubuntu1604-ppc-1.pic.build.10gen.cc",
    ],
  },
  {
    sorterName: "uptime",
    sortBy: "UPTIME",
    expectedIds: [
      "ubuntu1604-ppc-1.pic.build.10gen",
      "ubuntu1604-ppc-1.pic.build.10gen.c",
      "ubuntu1604-ppc-1.pic.build.10gen.cc",
      "i-092593689871a50dc",
      "rhel71-ppc-1.pic.build.10gen.c",
      "rhel71-ppc-1.pic.build.10gen.cc",
      "16326bd716fd4ad5845710c479c79e86c66b61bcef8ebbe7fc38dfc36fab512e",
      "1694cfe1eac28b3316339f6276021afcb2a07bcd21a266405835fd039557ea2d",
      "4b332e12790a585a0c7cbaf1650674f408117cf6134679c9e5f2e96cadd07923",
      "6e331e02aaaebba422d1f1d2dbd3e64f01776b84c68c672ea680e4b81b0719bb",
    ],
  },
  {
    sorterName: "idle time",
    sortBy: "IDLE_TIME",
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
];

const sortDirectionTests = [
  {
    sortDir: "ASC",
    order: "ascending",
    expectedIds: [
      "i-04ade558e1e26b0ad",
      "i-0d0ae8b83366d22",
      "i-0d0ae8b83366d22b",
      "i-0d0ae8b83366d22be",
      "macos-1014-68.macstadium.build.10gen",
      "macos-1014-68.macstadium.build.10gen.c",
      "macos-1014-68.macstadium.build.10gen.cc",
      "ubuntu1604-ppc-1.pic.build.10gen",
      "ubuntu1604-ppc-1.pic.build.10gen.c",
      "ubuntu1604-ppc-1.pic.build.10gen.cc",
    ],
  },
  {
    sortDir: "DESC",
    order: "descending",
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
];

describe("Hosts page sorting", () => {
  const hostsRoute = "/hosts";
  const distroSortControl = "button[aria-label='Sort by Distro']";

  it("Clicking the sort direction filter will set the page query param to 0", () => {
    cy.visit(`${hostsRoute}?distroId=arfarf&page=5`);
    cy.dataCy("hosts-table").should("be.visible");
    cy.dataCy("hosts-table").should("not.have.attr", "data-loading", "true");
    cy.get(distroSortControl).click();
    cy.location("search").should(
      "equal",
      "?distroId=arfarf&page=0&sortBy=DISTRO&sortDir=ASC"
    );
  });
  it("Clicking a sort direction 3 times will set the page query param to 0, clear the direction & sortBy query param, and preserve the rest", () => {
    cy.visit(`${hostsRoute}?distroId=arfarf&page=5`);
    cy.get(distroSortControl).click();
    cy.location("search").should(
      "equal",
      "?distroId=arfarf&page=0&sortBy=DISTRO&sortDir=ASC"
    );
    cy.get(distroSortControl).click();
    cy.location("search").should(
      "equal",
      "?distroId=arfarf&page=0&sortBy=DISTRO&sortDir=DESC"
    );
    cy.get(distroSortControl).click();
    cy.location("search").should("equal", "?distroId=arfarf&page=0");
  });
  it("Status sorter is selected by default if no sort params in url", () => {
    cy.visit(hostsRoute);
    cy.contains("th", "Status")
      .first()
      .within(() => {
        cy.validateTableSort("asc");
      });
  });

  it("Status sorter has initial value of sort param from url", () => {
    cy.visit(`${hostsRoute}?page=0&sortBy=DISTRO&sortDir=DESC`);
    cy.contains("th", "Distro").within(() => {
      cy.validateTableSort("desc");
    });
  });

  sortByTests.forEach(({ expectedIds, sortBy, sorterName }) => {
    it(`Sorts by ${sorterName} when sortBy = ${sortBy}`, () => {
      cy.visit(`${hostsRoute}?sortBy=${sortBy}&limit=10`);
      cy.dataCy("leafygreen-table-row").each(($el, index) =>
        cy.wrap($el).contains(expectedIds[index])
      );
    });
  });

  sortDirectionTests.forEach(({ expectedIds, order, sortDir }) => {
    it(`Sorts in ${order} order when sortDir = ${sortDir}`, () => {
      cy.visit(
        `${hostsRoute}?page=0&sortBy=CURRENT_TASK&sortDir=${sortDir}&limit=10`
      );
      cy.dataCy("leafygreen-table-row").each(($el, index) =>
        cy.wrap($el).contains(expectedIds[index])
      );
    });
  });

  it("Uses default sortBy and sortDir if sortBy or sortDir param is invalid", () => {
    cy.visit(`${hostsRoute}?sortBy=INVALID&sortDir=INVALID&limit=10`);
    cy.dataCy("leafygreen-table-row").each(($el, index) =>
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
