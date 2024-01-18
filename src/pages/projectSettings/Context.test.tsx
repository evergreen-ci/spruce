import { AjvError } from "@rjsf/core";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { WritableProjectSettingsType } from "pages/projectSettings/tabs/types";
import { act, renderHook, waitFor } from "test_utils";
import { ProjectSettingsProvider, useProjectSettingsContext } from "./Context";

describe("projectSettingsContext", () => {
  it("ensure that tab are initially saved", async () => {
    const { result } = renderHook(() => useProjectSettingsContext(), {
      wrapper: ProjectSettingsProvider,
    });

    expect(
      result.current.getTab(ProjectSettingsTabRoutes.General).hasChanges,
    ).toBe(false);
  });

  it("updating the form state unsaves the tab", async () => {
    const { result } = renderHook(() => useProjectSettingsContext(), {
      wrapper: ProjectSettingsProvider,
    });

    act(() => {
      result.current.setInitialData({
        [ProjectSettingsTabRoutes.Variables]: {
          vars: [],
        },
      } as Record<WritableProjectSettingsType, any>);
    });

    act(() => {
      result.current.updateForm(ProjectSettingsTabRoutes.Variables)({
        formData: {
          vars: [
            {
              varName: "test_name",
              varValue: "test_value",
              isPrivate: false,
              isDisabled: false,
              isAdminOnly: false,
            },
          ],
        },
        errors: [],
      });
    });

    await waitFor(() => {
      expect(
        result.current.getTab(ProjectSettingsTabRoutes.Variables).hasChanges,
      ).toBe(true);
    });
  });

  it("updating the form state with identical data does not unsave the tab", async () => {
    const { result } = renderHook(() => useProjectSettingsContext(), {
      wrapper: ProjectSettingsProvider,
    });

    act(() => {
      result.current.setInitialData({
        [ProjectSettingsTabRoutes.Variables]: {
          vars: [
            {
              varName: "test_name",
              varValue: "test_value",
              isPrivate: false,
              isDisabled: false,
              isAdminOnly: false,
            },
          ],
        },
      } as Record<WritableProjectSettingsType, any>);
    });

    act(() => {
      result.current.updateForm(ProjectSettingsTabRoutes.Variables)({
        formData: {
          vars: [
            {
              varName: "test_name",
              varValue: "test_value",
              isPrivate: false,
              isDisabled: false,
              isAdminOnly: false,
            },
          ],
        },
        errors: [],
      });
    });

    expect(
      result.current.getTab(ProjectSettingsTabRoutes.Variables).hasChanges,
    ).toBe(false);
  });

  it("updating push an error updates the tab's hasError state", async () => {
    const { result } = renderHook(() => useProjectSettingsContext(), {
      wrapper: ProjectSettingsProvider,
    });

    act(() => {
      result.current.setInitialData({
        [ProjectSettingsTabRoutes.Variables]: {
          vars: [],
        },
      } as Record<WritableProjectSettingsType, any>);
    });

    act(() => {
      result.current.updateForm(ProjectSettingsTabRoutes.Variables)({
        formData: {
          vars: [],
        },
        errors: [{ name: "err" } as AjvError],
      });
    });

    expect(
      result.current.getTab(ProjectSettingsTabRoutes.Variables).hasError,
    ).toBe(true);
  });
});
