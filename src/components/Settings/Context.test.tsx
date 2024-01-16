import { AjvError } from "@rjsf/core";
import { act, renderHook, waitFor } from "test_utils";
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
      hasError: false,
      hasChanges: false,
      initialData: null,
      formData: null,
    });
    expect(result.current.getTab("bar")).toStrictEqual({
      hasError: false,
      hasChanges: false,
      initialData: null,
      formData: null,
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
      hasError: false,
      hasChanges: false,
      initialData: initialData.foo,
      formData: null,
    });
    expect(result.current.getTab("bar")).toStrictEqual({
      hasError: false,
      hasChanges: false,
      initialData: initialData.bar,
      formData: null,
    });
  });

  it("marks the tab as having changes when updateForm is called", async () => {
    const { result } = renderHook(() => useTestContext(), {
      wrapper: TestProvider,
    });

    act(() => {
      result.current.setInitialData(initialData);
    });

    act(() => {
      result.current.updateForm("foo")({
        formData: { capsLockEnabled: false },
        errors: [],
      });
    });

    await waitFor(() => {
      expect(result.current.getTab("foo").hasChanges).toBe(true);
    });
    expect(result.current.getTab("foo").hasError).toBe(false);
    expect(result.current.getTab("bar").hasChanges).toBe(false);
    expect(result.current.getTab("bar").hasError).toBe(false);
  });

  it("updating the form state with identical data does not unsave the tab", async () => {
    const { result } = renderHook(() => useTestContext(), {
      wrapper: TestProvider,
    });

    act(() => {
      result.current.setInitialData(initialData);
    });

    act(() => {
      result.current.updateForm("foo")({
        formData: initialData.foo,
        errors: [],
      });
    });

    expect(result.current.getTab("foo").hasChanges).toBe(false);
  });

  it("an error in updateForm sets the tab's hasError state", async () => {
    const { result } = renderHook(() => useTestContext(), {
      wrapper: TestProvider,
    });

    act(() => {
      result.current.updateForm("foo")({
        formData: initialData.foo,
        errors: [{ name: "err" } as AjvError],
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
    const { result } = renderHook(
      () => ({
        ...useHasUnsavedTab(),
        ...useTestContext(),
      }),
      {
        wrapper: TestProvider,
      },
    );
    expect(result.current.unsavedTabs).toStrictEqual([]);
    expect(result.current.hasUnsaved).toBe(false);

    act(() => {
      result.current.updateForm("bar")({
        formData: { name: "Sophie", age: 27 },
        errors: [],
      });
    });

    await waitFor(() => {
      expect(result.current.hasUnsaved).toBe(true);
    });
    expect(result.current.unsavedTabs).toStrictEqual(["bar"]);
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
      },
    );
    expect(result.current.hasUnsaved).toBe(false);
    expect(result.current.getTab("foo")).toStrictEqual({
      hasChanges: false,
      hasError: false,
      initialData: null,
      formData: { capsLockEnabled: true },
    });
    expect(result.current.getTab("bar")).toStrictEqual({
      hasChanges: false,
      hasError: false,
      initialData: null,
      formData: null,
    });
  });
});
