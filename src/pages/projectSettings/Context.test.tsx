import { AjvError } from "@rjsf/core";
import { act, renderHook } from "@testing-library/react-hooks";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { TabDataProps } from "pages/projectSettings/tabs/types";
import { ProjectSettingsProvider, useProjectSettingsContext } from "./Context";

describe("projectSettingsContext", () => {
  it("ensure that tab are initially saved", async () => {
    const { result } = renderHook(() => useProjectSettingsContext(), {
      wrapper: ProjectSettingsProvider,
    });

    expect(
      result.current.getTab(ProjectSettingsTabRoutes.General).hasChanges
    ).toBe(false);
  });

  it("updating the form state unsaves the tab", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useProjectSettingsContext(),
      {
        wrapper: ProjectSettingsProvider,
      }
    );

    act(() => {
      result.current.setInitialData({
        [ProjectSettingsTabRoutes.Variables]: {
          projectData: { vars: [] },
          repoData: null,
        },
      } as TabDataProps);
    });

    act(() => {
      result.current.updateForm(ProjectSettingsTabRoutes.Variables)({
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
    expect(
      result.current.getTab(ProjectSettingsTabRoutes.Variables).hasChanges
    ).toBe(true);
  });

  it("updating the form state with identical data does not unsave the tab", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useProjectSettingsContext(),
      {
        wrapper: ProjectSettingsProvider,
      }
    );

    act(() => {
      result.current.setInitialData({
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
      result.current.updateForm(ProjectSettingsTabRoutes.Variables)({
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
    expect(
      result.current.getTab(ProjectSettingsTabRoutes.Variables).hasChanges
    ).toBe(false);
  });

  it("updating push an error updates the tab's hasError state", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useProjectSettingsContext(),
      {
        wrapper: ProjectSettingsProvider,
      }
    );

    act(() => {
      result.current.setInitialData({
        [ProjectSettingsTabRoutes.Variables]: {
          projectData: { vars: [] },
          repoData: null,
        },
      } as TabDataProps);
    });

    act(() => {
      result.current.updateForm(ProjectSettingsTabRoutes.Variables)({
        formData: {
          vars: [],
        },
        errors: [{ name: "err" } as AjvError],
      });
    });

    await waitForNextUpdate();
    expect(
      result.current.getTab(ProjectSettingsTabRoutes.Variables).hasError
    ).toBe(true);
  });
});
