import { MemoryRouter } from "react-router-dom";
import { renderHook, act } from "test_utils";
import useConfigurePatch from ".";
import { patchQuery } from "../testData";

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter initialEntries={[`/version/123/tasks`]}>
    {children}
  </MemoryRouter>
);

const basePatch = {
  ...patchQuery.patch,
  description: "default description",
  patchTriggerAliases: [],
};
describe("useConfigurePatch", () => {
  describe("default state", () => {
    it("should preserve the default description", () => {
      const { result } = renderHook(() => useConfigurePatch(basePatch), {
        wrapper,
      });
      expect(result.current.description).toBe("default description");
    });
    it("build variants should be populated by default and the first one should be selected", async () => {
      const { result } = renderHook(() => useConfigurePatch(basePatch), {
        wrapper,
      });
      expect(result.current.selectedBuildVariantTasks).toStrictEqual({
        ubuntu2004: {
          e2e_test: false,
          test: false,
        },
        ubuntu2204: {
          e2e_test: false,
          graphql: false,
        },
      });
      expect(result.current.selectedBuildVariants).toStrictEqual([
        "ubuntu2004",
      ]);
    });
    it("already activated patches should populate previously activated tasks by default", () => {
      const patch = {
        ...basePatch,
        activated: true,
        variantsTasks: [
          {
            name: "ubuntu2004",
            tasks: ["e2e_test"],
          },
        ],
      };
      const { result } = renderHook(() => useConfigurePatch(patch), {
        wrapper,
      });
      expect(result.current.selectedBuildVariantTasks).toStrictEqual({
        ubuntu2004: {
          e2e_test: true,
          test: false,
        },
        ubuntu2204: {
          e2e_test: false,
          graphql: false,
        },
      });
      expect(result.current.selectedBuildVariants).toStrictEqual([
        "ubuntu2004",
      ]);
    });
  });
  describe("tabs", () => {
    it("should default to the tasks tab", () => {
      const { result } = renderHook(() => useConfigurePatch(basePatch), {
        wrapper,
      });
      expect(result.current.selectedTab).toBe(0);
    });
    it("should set the selected tab", async () => {
      const { result } = renderHook(() => useConfigurePatch(basePatch), {
        wrapper,
      });
      act(() => {
        result.current.setSelectedTab(1);
      });
      expect(result.current.selectedTab).toBe(1);
    });
    it("should disable build variant selector if not on the tasks tab", async () => {
      const { result } = renderHook(() => useConfigurePatch(basePatch), {
        wrapper,
      });
      expect(result.current.disableBuildVariantSelect).toBeFalsy();
      act(() => {
        result.current.setSelectedTab(1);
      });
      expect(result.current.selectedTab).toBe(1);
      expect(result.current.disableBuildVariantSelect).toBeTruthy();
    });
  });
  describe("build variants", () => {
    it("should be able to set a different build variant", async () => {
      const { result } = renderHook(() => useConfigurePatch(basePatch), {
        wrapper,
      });
      expect(result.current.selectedBuildVariants).toStrictEqual([
        "ubuntu2004",
      ]);
      act(() => {
        result.current.setSelectedBuildVariants(["ubuntu2204"]);
      });
      expect(result.current.selectedBuildVariants).toStrictEqual([
        "ubuntu2204",
      ]);
    });
    it("should be able to set multiple build variants", async () => {
      const { result } = renderHook(() => useConfigurePatch(basePatch), {
        wrapper,
      });
      expect(result.current.selectedBuildVariants).toStrictEqual([
        "ubuntu2004",
      ]);
      act(() => {
        result.current.setSelectedBuildVariants(["ubuntu2204", "ubuntu2004"]);
      });
      expect(result.current.selectedBuildVariants).toStrictEqual([
        "ubuntu2004",
        "ubuntu2204",
      ]);
    });
    it("should consistently sort multiple build variants", async () => {
      const { result } = renderHook(() => useConfigurePatch(basePatch), {
        wrapper,
      });
      expect(result.current.selectedBuildVariants).toStrictEqual([
        "ubuntu2004",
      ]);
      act(() => {
        result.current.setSelectedBuildVariants(["ubuntu2204", "ubuntu2004"]);
      });
      expect(result.current.selectedBuildVariants).toStrictEqual([
        "ubuntu2004",
        "ubuntu2204",
      ]);
    });
  });
});
