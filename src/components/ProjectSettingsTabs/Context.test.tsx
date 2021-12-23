import { act, renderHook } from "@testing-library/react-hooks";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectSettingsProvider,
  useIsAnyTabUnsaved,
  useProjectSettingsContext,
} from "./Context";

describe("projectSettingsContext", () => {
  it("ensure that tabs are initially saved", async () => {
    const { result } = renderHook(() => useIsAnyTabUnsaved(), {
      wrapper: ProjectSettingsProvider,
    });
    expect(result.current.hasUnsaved).toBe(false);
  });

  it("updating the form state unsaves the tab", async () => {
    const { result } = renderHook(
      () => ({
        projectSettings: useProjectSettingsContext(),
        tabUnsaved: useIsAnyTabUnsaved(),
      }),
      {
        wrapper: ProjectSettingsProvider,
      }
    );

    act(() => {
      result.current.projectSettings.updateForm(
        ProjectSettingsTabRoutes.General
      )({
        foo: "bar",
      });
    });

    expect(result.current.tabUnsaved.hasUnsaved).toBe(true);
    expect(result.current.tabUnsaved.unsavedTabs).toStrictEqual(["general"]);
  });
});
