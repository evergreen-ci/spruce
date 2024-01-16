import { createRef } from "react";
import { useOnClickOutside } from "hooks";
import { renderHook, render, screen, userEvent } from "test_utils";

describe("useOnClickOutside", () => {
  describe("useOnClickOutside with 1 ref", () => {
    it("executes callback when clicking outside element", async () => {
      const user = userEvent.setup();
      const body = document.body as HTMLElement;
      const callback = jest.fn();
      const ref = createRef<HTMLDivElement>();
      render(<div ref={ref}> Test ref </div>);

      renderHook(() => useOnClickOutside([ref], callback));
      await user.click(body);
      expect(callback).toHaveBeenCalledTimes(1);
    });
    it("does not execute callback when clicking inside element", async () => {
      const user = userEvent.setup();
      const callback = jest.fn();
      const ref = createRef<HTMLDivElement>();
      render(<div ref={ref}> Test ref </div>);

      renderHook(() => useOnClickOutside([ref], callback));
      await user.click(screen.getByText("Test ref"));
      expect(callback).not.toHaveBeenCalled();
    });
  });
  describe("useOnClickOutside with multiple refs", () => {
    it("executes callback when clicking outside elements", async () => {
      const user = userEvent.setup();
      const body = document.body as HTMLElement;
      const callback = jest.fn();
      const ref1 = createRef<HTMLDivElement>();
      const ref2 = createRef<HTMLDivElement>();
      render(
        <>
          <div ref={ref1}> Test ref 1 </div>
          <div ref={ref2}> Test ref 2 </div>
        </>,
      );

      renderHook(() => useOnClickOutside([ref1, ref2], callback));
      await user.click(body);
      expect(callback).toHaveBeenCalledTimes(1);
    });
    it("does not execute callback when clicking inside elements", async () => {
      const user = userEvent.setup();
      const callback = jest.fn();
      const ref1 = createRef<HTMLDivElement>();
      const ref2 = createRef<HTMLDivElement>();
      render(
        <>
          <div ref={ref1}> Test ref 1 </div>
          <div ref={ref2}> Test ref 2 </div>
        </>,
      );

      renderHook(() => useOnClickOutside([ref1, ref2], callback));
      await user.click(screen.getByText("Test ref 1"));
      expect(callback).not.toHaveBeenCalled();
      await user.click(screen.getByText("Test ref 2"));
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
