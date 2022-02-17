import { act, renderHook } from "@testing-library/react-hooks";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectSettingsProvider,
  useIsAnyTabUnsaved,
  useProjectSettingsContext,
} from "./Context";

const DEBOUNCE_MS = 400;

describe("projectSettingsContext", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

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
      result.current.projectSettings.setInitialData(
        ProjectSettingsTabRoutes.Variables,
        {
          vars: [],
        }
      );
    });

    jest.useFakeTimers("modern");
    await act(async () => {
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
      jest.advanceTimersByTime(DEBOUNCE_MS);
    });

    expect(result.current.tabUnsaved.hasUnsaved).toBe(true);
    expect(result.current.tabUnsaved.unsavedTabs).toStrictEqual(["variables"]);
  });

  it("updating the form state with identical data does not unsave the tab", async () => {
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
      result.current.projectSettings.setInitialData(
        ProjectSettingsTabRoutes.Variables,
        {
          vars: [
            {
              varName: "test_name",
              varValue: "test_value",
              isPrivate: "false",
              isDisabled: "false",
            },
          ],
        }
      );
    });

    jest.useFakeTimers("modern");
    await act(async () => {
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
      jest.advanceTimersByTime(DEBOUNCE_MS);
    });

    expect(result.current.tabUnsaved.hasUnsaved).toBe(false);
    expect(result.current.tabUnsaved.unsavedTabs).toStrictEqual([]);
  });

  it("updating push an error updates the tab's hasError state", async () => {
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
      result.current.projectSettings.setInitialData(
        ProjectSettingsTabRoutes.Variables,
        {
          vars: [],
        }
      );
    });

    jest.useFakeTimers("modern");
    await act(async () => {
      result.current.projectSettings.updateForm(
        ProjectSettingsTabRoutes.Variables
      )({
        formData: {
          vars: [],
        },
        errors: ["err"],
      });
      jest.advanceTimersByTime(DEBOUNCE_MS);
    });

    expect(
      result.current.projectSettings.getTab(ProjectSettingsTabRoutes.Variables)
        .hasError
    ).toBe(true);
  });
});
