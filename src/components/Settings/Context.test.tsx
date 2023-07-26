import { AjvError } from "@rjsf/core";
import { act, renderHook } from "@testing-library/react-hooks";
import {
  initialData,
  TestProvider,
  useHasUnsavedTab,
  usePopulateForm,
  useTestContext,
} from "./test-utils";

describe("useTestContext", () => {
  it("sets the default state", async () => {
    const { result } = renderHook(() => useTestContext(), {
      wrapper: TestProvider,
    });

    expect(result.current.getTab("foo")).toStrictEqual({
      formData: null,
      hasChanges: false,
      hasError: false,
      initialData: null,
    });
    expect(result.current.getTab("bar")).toStrictEqual({
      formData: null,
      hasChanges: false,
      hasError: false,
      initialData: null,
    });
  });

  it("sets the initial data field", async () => {
    const { result } = renderHook(() => useTestContext(), {
      wrapper: TestProvider,
    });

    act(() => {
      result.current.setInitialData(initialData);
    });

    expect(result.current.getTab("foo")).toStrictEqual({
      formData: null,
      hasChanges: false,
      hasError: false,
      initialData: initialData.foo,
    });
    expect(result.current.getTab("bar")).toStrictEqual({
      formData: null,
      hasChanges: false,
      hasError: false,
      initialData: initialData.bar,
    });
  });

  it("marks the tab as having changes when updateForm is called", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useTestContext(), {
      wrapper: TestProvider,
    });

    act(() => {
      result.current.setInitialData(initialData);
    });

    act(() => {
      result.current.updateForm("foo")({
        errors: [],
        formData: { capsLockEnabled: false },
      });
    });

    await waitForNextUpdate();
    expect(result.current.getTab("foo").hasChanges).toBe(true);
    expect(result.current.getTab("foo").hasError).toBe(false);
    expect(result.current.getTab("bar").hasChanges).toBe(false);
    expect(result.current.getTab("bar").hasError).toBe(false);
  });

  it("updating the form state with identical data does not unsave the tab", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useTestContext(), {
      wrapper: TestProvider,
    });

    act(() => {
      result.current.setInitialData(initialData);
    });

    act(() => {
      result.current.updateForm("foo")({
        errors: [],
        formData: initialData.foo,
      });
    });

    await waitForNextUpdate();
    expect(result.current.getTab("foo").hasChanges).toBe(false);
  });

  it("an error in updateForm sets the tab's hasError state", async () => {
    const { result } = renderHook(() => useTestContext(), {
      wrapper: TestProvider,
    });

    act(() => {
      result.current.updateForm("foo")({
        errors: [{ name: "err" } as AjvError],
        formData: initialData.foo,
      });
    });

    expect(result.current.getTab("foo").hasError).toBe(true);
  });
});

describe("useHasUnsavedTab", () => {
  it("has no unsaved tabs on initial render", () => {
    const { result } = renderHook(() => useHasUnsavedTab(), {
      wrapper: TestProvider,
    });
    expect(result.current.unsavedTabs).toStrictEqual([]);
    expect(result.current.hasUnsaved).toBe(false);
  });

  it("returns names of unsaved tabs", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => ({
        ...useHasUnsavedTab(),
        ...useTestContext(),
      }),
      {
        wrapper: TestProvider,
      }
    );
    expect(result.current.unsavedTabs).toStrictEqual([]);
    expect(result.current.hasUnsaved).toBe(false);

    act(() => {
      result.current.updateForm("bar")({
        errors: [],
        formData: { age: 27, name: "Sophie" },
      });
    });

    await waitForNextUpdate();
    expect(result.current.unsavedTabs).toStrictEqual(["bar"]);
    expect(result.current.hasUnsaved).toBe(true);
  });
});

describe("usePopulateForm", () => {
  it("updates the form state and marks as saved", async () => {
    const { result } = renderHook(
      () => ({
        ...useHasUnsavedTab(),
        ...useTestContext(),
        populate: usePopulateForm(initialData.foo, "foo"),
      }),
      {
        wrapper: TestProvider,
      }
    );
    expect(result.current.hasUnsaved).toBe(false);
    expect(result.current.getTab("foo")).toStrictEqual({
      formData: { capsLockEnabled: true },
      hasChanges: false,
      hasError: false,
      initialData: null,
    });
    expect(result.current.getTab("bar")).toStrictEqual({
      formData: null,
      hasChanges: false,
      hasError: false,
      initialData: null,
    });
  });
});
