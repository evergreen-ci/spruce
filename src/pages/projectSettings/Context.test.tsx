import { act, renderHook } from "@testing-library/react-hooks";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { TabDataProps } from "pages/projectSettings/tabs/types";
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
    const { result, waitForNextUpdate } = renderHook(
      () => ({
        projectSettings: useProjectSettingsContext(),
        tabUnsaved: useIsAnyTabUnsaved(),
      }),
      {
        wrapper: ProjectSettingsProvider,
      }
    );

    act(() => {
      result.current.projectSettings.setInitialData({
        [ProjectSettingsTabRoutes.Variables]: {
          projectData: { vars: [] },
          repoData: null,
        },
      } as TabDataProps);
    });

    act(() => {
      result.current.projectSettings.updateForm(
        ProjectSettingsTabRoutes.Variables
      )({
        formData: {
          vars: [
            {
              varName: "test_name",
              varValue: "test_value",
              isPrivate: "false",
              isDisabled: "false",
            },
          ],
        },
        errors: [],
      });
    });

    await waitForNextUpdate();
    expect(result.current.tabUnsaved.hasUnsaved).toBe(true);
    expect(result.current.tabUnsaved.unsavedTabs).toStrictEqual(["variables"]);
  });

  it("updating the form state with identical data does not unsave the tab", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => ({
        projectSettings: useProjectSettingsContext(),
        tabUnsaved: useIsAnyTabUnsaved(),
      }),
      {
        wrapper: ProjectSettingsProvider,
      }
    );

    act(() => {
      result.current.projectSettings.setInitialData({
        [ProjectSettingsTabRoutes.Variables]: {
          projectData: null,
          repoData: {
            vars: [
              {
                varName: "test_name",
                varValue: "test_value",
                isPrivate: "false",
                isDisabled: "false",
              },
            ],
          },
        },
      } as TabDataProps);
    });

    act(() => {
      result.current.projectSettings.updateForm(
        ProjectSettingsTabRoutes.Variables
      )({
        formData: {
          vars: [
            {
              varName: "test_name",
              varValue: "test_value",
              isPrivate: "false",
              isDisabled: "false",
            },
          ],
        },
        errors: [],
      });
    });

    await waitForNextUpdate();
    expect(result.current.tabUnsaved.hasUnsaved).toBe(false);
    expect(result.current.tabUnsaved.unsavedTabs).toStrictEqual([]);
  });

  it("updating push an error updates the tab's hasError state", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => ({
        projectSettings: useProjectSettingsContext(),
        tabUnsaved: useIsAnyTabUnsaved(),
      }),
      {
        wrapper: ProjectSettingsProvider,
      }
    );

    act(() => {
      result.current.projectSettings.setInitialData({
        [ProjectSettingsTabRoutes.Variables]: {
          projectData: { vars: [] },
          repoData: null,
        },
      } as TabDataProps);
    });

    act(() => {
      result.current.projectSettings.updateForm(
        ProjectSettingsTabRoutes.Variables
      )({
        formData: {
          vars: [],
        },
        errors: ["err"],
      });
    });

    await waitForNextUpdate();
    expect(
      result.current.projectSettings.getTab(ProjectSettingsTabRoutes.Variables)
        .hasError
    ).toBe(true);
  });
});
