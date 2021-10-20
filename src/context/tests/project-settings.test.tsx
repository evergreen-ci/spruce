import { act, renderHook } from "@testing-library/react-hooks";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectSettingsProvider,
  useIsAnyTabUnsaved,
  useProjectSettingsContext,
} from "../project-settings";

test("Ensure that tabs are initially saved", async () => {
  const { result } = renderHook(() => useIsAnyTabUnsaved(), {
    wrapper: ProjectSettingsProvider,
  });
  expect(result.current).toBe(false);
});

test("Updating the form state unsaves the tab", async () => {
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
      ProjectSettingsTabRoutes.General,
      {
        foo: "bar",
      }
    );
  });

  expect(result.current.tabUnsaved).toBe(true);
});
