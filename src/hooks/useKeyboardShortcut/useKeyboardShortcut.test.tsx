/* eslint-disable testing-library/no-node-access */
import { renderHook } from "@testing-library/react-hooks";
import { CharKey, ModifierKey } from "constants/keys";
import { render, screen, userEvent } from "test_utils";
import useKeyboardShortcut from ".";

const { type, click } = userEvent;

describe("useKeyboardShortcut", () => {
  describe("multiple keys", () => {
    it("should call the callback only when the exact shortcut keys are pressed", () => {
      const callback = jest.fn();
      renderHook(() =>
        useKeyboardShortcut(
          { charKey: CharKey.A, modifierKeys: [ModifierKey.Control] },
          callback
        )
      );
      type(document.body, "{ctrl}");
      expect(callback).toHaveBeenCalledTimes(0);
      type(document.body, "{a}");
      expect(callback).toHaveBeenCalledTimes(0);
      type(document.body, "{ctrl}{shift}{a}{/ctrl}{/shift}");
      expect(callback).toHaveBeenCalledTimes(0);
      type(document.body, "{ctrl}{a}{/ctrl}");
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should not call the callback if an input element has focus", () => {
      const callback = jest.fn();
      renderHook(() =>
        useKeyboardShortcut(
          { charKey: CharKey.A, modifierKeys: [ModifierKey.Control] },
          callback
        )
      );
      render(<input data-cy="test-input" />);

      click(screen.getByDataCy("test-input"));
      expect(screen.getByDataCy("test-input")).toHaveFocus();
      type(document.activeElement, "{ctrl}a{/ctrl}");
      expect(callback).toHaveBeenCalledTimes(0);
      expect(screen.getByDataCy("test-input")).toHaveValue("a");
    });
  });

  describe("single key", () => {
    it("should call the callback only when the exact shortcut key is pressed", () => {
      const callback = jest.fn();
      renderHook(() => useKeyboardShortcut({ charKey: CharKey.A }, callback));
      type(document.activeElement, "{ctrl}{A}{/ctrl}");
      expect(callback).toHaveBeenCalledTimes(0);
      type(document.activeElement, "{ctrl}{shift}{a}{/ctrl}{/shift}");
      expect(callback).toHaveBeenCalledTimes(0);
      type(document.activeElement, "{a}");
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should not call the callback if an input element has focus", () => {
      const callback = jest.fn();
      renderHook(() => useKeyboardShortcut({ charKey: CharKey.A }, callback));
      render(<input data-cy="test-input" />);

      click(screen.getByDataCy("test-input"));
      expect(screen.getByDataCy("test-input")).toHaveFocus();
      type(document.activeElement, "a");
      expect(callback).toHaveBeenCalledTimes(0);
      expect(screen.getByDataCy("test-input")).toHaveValue("a");
    });
  });

  it("should call the callback if an input element has focus and ignoreFocus is enabled", () => {
    const callback = jest.fn();
    renderHook(() =>
      useKeyboardShortcut(
        { charKey: CharKey.A, modifierKeys: [ModifierKey.Control] },
        callback,
        {
          ignoreFocus: true,
        }
      )
    );
    render(<input data-cy="test-input" />);
    click(screen.getByDataCy("test-input"));
    expect(screen.getByDataCy("test-input")).toHaveFocus();
    type(document.activeElement, "{ctrl}{a}{/ctrl}");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call the callback if the component is disabled", () => {
    const callback = jest.fn();
    renderHook(() =>
      useKeyboardShortcut(
        { charKey: CharKey.A, modifierKeys: [ModifierKey.Control] },
        callback,
        {
          disabled: true,
        }
      )
    );
    type(document.activeElement, "{a}");
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("should remove the event listener if the component is initially enabled, then disabled", () => {
    const mockedAddEventListener = jest.fn();
    const mockedRemoveEventListener = jest.fn();
    jest
      .spyOn(document, "addEventListener")
      .mockImplementation(mockedAddEventListener);
    jest
      .spyOn(document, "removeEventListener")
      .mockImplementation(mockedRemoveEventListener);

    const { rerender: rerenderHook } = renderHook(
      (args: { disabled: boolean } = { disabled: false }) =>
        useKeyboardShortcut({ charKey: CharKey.A }, jest.fn(), {
          disabled: args.disabled,
        })
    );
    expect(mockedAddEventListener).toHaveBeenCalledTimes(1);

    rerenderHook({ disabled: true });
    expect(mockedAddEventListener).toHaveBeenCalledTimes(1);
    expect(mockedRemoveEventListener).toHaveBeenCalledTimes(2);
  });
});
