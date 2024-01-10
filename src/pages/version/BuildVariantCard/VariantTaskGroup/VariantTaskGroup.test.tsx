import { MockedProvider } from "@apollo/client/testing";
import { getVersionRoute } from "constants/routes";
import { mapUmbrellaStatusToQueryParam } from "constants/task";
import { renderWithRouterMatch as render, screen } from "test_utils";
import { TaskStatus } from "types/task";
import { applyStrictRegex } from "utils/string";
import VariantTaskGroup from ".";

const Wrapper = ({ children }) => <MockedProvider>{children}</MockedProvider>;
const Component = () => (
  <VariantTaskGroup
    variant="some_variant"
    versionId="1"
    displayName="Some Variant"
    statusCounts={[
      { count: 1, status: TaskStatus.Succeeded },
      { count: 2, status: TaskStatus.Failed },
    ]}
  />
);
describe("variantTaskGroup", () => {
  it("should render variants with their grouped status cards", () => {
    render(<Component />, {
      wrapper: Wrapper,
      route: "/version/1",
      path: "/version/:id",
    });
    expect(screen.getByText("Some Variant")).toBeDefined();
    expect(screen.queryAllByDataCy("grouped-task-status-badge")).toHaveLength(
      2,
    );
  });
  describe("variantTaskGroup status badge state", () => {
    it("should render a status badge for each status", () => {
      render(<Component />, {
        wrapper: Wrapper,
        route: "/version/1",
        path: "/version/:id",
      });
      expect(screen.getByText("Some Variant")).toBeDefined();
      expect(screen.queryAllByDataCy("grouped-task-status-badge")).toHaveLength(
        2,
      );
    });
    it("all should be active if no status and variant filters are set", () => {
      render(<Component />, {
        wrapper: Wrapper,
        route: "/version/1",
        path: "/version/:id",
      });
      expect(screen.getByText("Some Variant")).toBeDefined();
      expect(screen.queryAllByDataCy("grouped-task-status-badge")).toHaveLength(
        2,
      );
      screen.queryAllByDataCy("grouped-task-status-badge").forEach((badge) => {
        expect(badge).toHaveAttribute("aria-selected", "true");
      });
    });
    it("all should be active if the variant is selected and there are no status filters", () => {
      render(<Component />, {
        wrapper: Wrapper,
        route: `/version/1?variant=${applyStrictRegex("some_variant")}`,
        path: "/version/:id",
      });
      expect(screen.getByText("Some Variant")).toBeDefined();
      expect(screen.queryAllByDataCy("grouped-task-status-badge")).toHaveLength(
        2,
      );
      screen.queryAllByDataCy("grouped-task-status-badge").forEach((badge) => {
        expect(badge).toHaveAttribute("aria-selected", "true");
      });
    });
    it("all should be active if no variant is selected and there are status filters", () => {
      render(<Component />, {
        wrapper: Wrapper,
        route: `/version/1?statuses=${TaskStatus.Succeeded}`,
        path: "/version/:id",
      });
      expect(screen.getByText("Some Variant")).toBeDefined();
      expect(screen.queryAllByDataCy("grouped-task-status-badge")).toHaveLength(
        2,
      );
      screen.queryAllByDataCy("grouped-task-status-badge").forEach((badge) => {
        expect(badge).toHaveAttribute("aria-selected", "true");
      });
    });

    it("should only be active if the variant is selected and a matching status filter", () => {
      render(<Component />, {
        wrapper: Wrapper,
        route: `/version/1?statuses=${
          TaskStatus.Succeeded
        }&variant=${applyStrictRegex("some_variant")}`,
        path: "/version/:id",
      });
      expect(screen.getByText("Some Variant")).toBeDefined();
      expect(screen.queryAllByDataCy("grouped-task-status-badge")).toHaveLength(
        2,
      );
      const successBadge = screen.queryAllByDataCy(
        "grouped-task-status-badge",
      )[0];
      expect(successBadge).toHaveTextContent("Succeeded");
      const failedBadge = screen.queryAllByDataCy(
        "grouped-task-status-badge",
      )[1];
      expect(failedBadge).toHaveTextContent("Failed");

      expect(successBadge).toHaveAttribute("aria-selected", "true");
      expect(failedBadge).toHaveAttribute("aria-selected", "false");
    });
    it("none should be active if no matching variant is selected", () => {
      render(<Component />, {
        wrapper: Wrapper,
        route: `/version/1?statuses=${
          TaskStatus.Succeeded
        }&variant=${applyStrictRegex("some_other_variant")}`,
        path: "/version/:id",
      });
      expect(screen.getByText("Some Variant")).toBeDefined();
      expect(screen.queryAllByDataCy("grouped-task-status-badge")).toHaveLength(
        2,
      );
      screen.queryAllByDataCy("grouped-task-status-badge").forEach((badge) => {
        expect(badge).toHaveAttribute("aria-selected", "false");
      });
    });
  });

  describe("variantTaskGroup links", () => {
    describe("title", () => {
      it("should link to the variant filter if there is no variant selected", () => {
        render(<Component />, {
          wrapper: Wrapper,
          route: "/version/1",
          path: "/version/:id",
        });
        const variantLink = screen.queryByDataCy("build-variant-display-name");
        expect(variantLink).toBeDefined();
        expect(variantLink).toHaveTextContent("Some Variant");
        expect(variantLink).toHaveAttribute(
          "href",
          getVersionRoute("1", {
            variant: applyStrictRegex("some_variant"),
            page: 0,
          }),
        );
      });
      it("should link to the variant filter if a different variant is selected", () => {
        render(<Component />, {
          wrapper: Wrapper,
          route: `/version/1?variant=${applyStrictRegex("some_other_variant")}`,
          path: "/version/:id",
        });
        const variantLink = screen.queryByDataCy("build-variant-display-name");
        expect(variantLink).toBeDefined();
        expect(variantLink).toHaveTextContent("Some Variant");
        expect(variantLink).toHaveAttribute(
          "href",
          getVersionRoute("1", {
            variant: applyStrictRegex("some_variant"),
            page: 0,
          }),
        );
      });
      it("should remove the variant filter if the same variant is selected", () => {
        render(<Component />, {
          wrapper: Wrapper,
          route: `/version/1?variant=${applyStrictRegex("some_variant")}`,
          path: "/version/:id",
        });
        const variantLink = screen.queryByDataCy("build-variant-display-name");
        expect(variantLink).toBeDefined();
        expect(variantLink).toHaveTextContent("Some Variant");
        expect(variantLink).toHaveAttribute(
          "href",
          getVersionRoute("1", {
            page: 0,
          }),
        );
      });
    });
    describe("status badges", () => {
      it("should link to the variant and status filter if there is no variant selected", () => {
        render(<Component />, {
          wrapper: Wrapper,
          route: "/version/1",
          path: "/version/:id",
        });
        expect(screen.getByText("Some Variant")).toBeDefined();
        expect(
          screen.queryAllByDataCy("grouped-task-status-badge"),
        ).toHaveLength(2);
        const successBadge = screen.queryAllByDataCy(
          "grouped-task-status-badge",
        )[0];
        expect(successBadge).toHaveTextContent("Succeeded");
        expect(successBadge).toHaveAttribute(
          "href",
          getVersionRoute("1", {
            statuses: [TaskStatus.Succeeded],
            variant: applyStrictRegex("some_variant"),
            page: 0,
          }),
        );

        const failedBadge = screen.queryAllByDataCy(
          "grouped-task-status-badge",
        )[1];
        expect(failedBadge).toHaveTextContent("Failed");
        expect(failedBadge).toHaveAttribute(
          "href",
          getVersionRoute("1", {
            statuses: mapUmbrellaStatusToQueryParam[TaskStatus.FailedUmbrella],
            variant: applyStrictRegex("some_variant"),
            page: 0,
          }),
        );
      });
      it("should link to the variant and status filter if a different variant is selected", () => {
        render(<Component />, {
          wrapper: Wrapper,
          route: `/version/1?variant=${applyStrictRegex("some_other_variant")}`,
          path: "/version/:id",
        });
        expect(screen.getByText("Some Variant")).toBeDefined();
        expect(
          screen.queryAllByDataCy("grouped-task-status-badge"),
        ).toHaveLength(2);
        const successBadge = screen.queryAllByDataCy(
          "grouped-task-status-badge",
        )[0];
        expect(successBadge).toHaveTextContent("Succeeded");
        expect(successBadge).toHaveAttribute(
          "href",
          getVersionRoute("1", {
            statuses: [TaskStatus.Succeeded],
            variant: applyStrictRegex("some_variant"),
            page: 0,
          }),
        );

        const failedBadge = screen.queryAllByDataCy(
          "grouped-task-status-badge",
        )[1];
        expect(failedBadge).toHaveTextContent("Failed");
        expect(failedBadge).toHaveAttribute(
          "href",
          getVersionRoute("1", {
            statuses: mapUmbrellaStatusToQueryParam[TaskStatus.FailedUmbrella],
            variant: applyStrictRegex("some_variant"),
            page: 0,
          }),
        );
      });
      it("should link to the variant and status filter if the same variant is selected and no status is selected", () => {
        render(<Component />, {
          wrapper: Wrapper,
          route: `/version/1?variant=${applyStrictRegex("some_variant")}`,
          path: "/version/:id",
        });
        expect(screen.getByText("Some Variant")).toBeDefined();
        expect(
          screen.queryAllByDataCy("grouped-task-status-badge"),
        ).toHaveLength(2);
        const successBadge = screen.queryAllByDataCy(
          "grouped-task-status-badge",
        )[0];
        expect(successBadge).toHaveTextContent("Succeeded");
        expect(successBadge).toHaveAttribute(
          "href",
          getVersionRoute("1", {
            statuses: [TaskStatus.Succeeded],
            variant: applyStrictRegex("some_variant"),
            page: 0,
          }),
        );

        const failedBadge = screen.queryAllByDataCy(
          "grouped-task-status-badge",
        )[1];
        expect(failedBadge).toHaveTextContent("Failed");
        expect(failedBadge).toHaveAttribute(
          "href",
          getVersionRoute("1", {
            statuses: mapUmbrellaStatusToQueryParam[TaskStatus.FailedUmbrella],
            variant: applyStrictRegex("some_variant"),
            page: 0,
          }),
        );
      });
      it("should remove the variant and status filter if the same variant and the same status is selected", () => {
        render(<Component />, {
          wrapper: Wrapper,
          route: `/version/1?variant=${applyStrictRegex(
            "some_variant",
          )}&statuses=${TaskStatus.Succeeded}`,
          path: "/version/:id",
        });
        expect(screen.getByText("Some Variant")).toBeDefined();
        expect(
          screen.queryAllByDataCy("grouped-task-status-badge"),
        ).toHaveLength(2);
        const successBadge = screen.queryAllByDataCy(
          "grouped-task-status-badge",
        )[0];
        expect(successBadge).toHaveTextContent("Succeeded");
        expect(successBadge).toHaveAttribute(
          "href",
          getVersionRoute("1", {
            page: 0,
          }),
        );
      });
    });
  });
});
