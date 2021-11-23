import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import userEvent from "@testing-library/user-event";
import { useOnClickOutside } from "hooks";
import { render } from "test_utils/test-utils";

describe("useOnClickOutside", () => {
  describe("useOnClickOutside with 1 ref", () => {
    test("executes callback when clicking outside element", () => {
      const body = document.body as HTMLElement;
      const callback = jest.fn();
      const ref = React.createRef<HTMLDivElement>();
      render(<div ref={ref}> Test ref </div>);

      renderHook(() => useOnClickOutside([ref], callback));
      userEvent.click(body);
      expect(callback).toHaveBeenCalledTimes(1);
    });
    test("does not execute callback when clicking inside element", () => {
      const callback = jest.fn();
      const ref = React.createRef<HTMLDivElement>();
      const { getByText } = render(<div ref={ref}> Test ref </div>);

      renderHook(() => useOnClickOutside([ref], callback));
      userEvent.click(getByText("Test ref"));
      expect(callback).not.toHaveBeenCalled();
    });
  });
  describe("useOnClickOutside with multiple refs", () => {
    test("executes callback when clicking outside elements", () => {
      const body = document.body as HTMLElement;
      const callback = jest.fn();
      const ref1 = React.createRef<HTMLDivElement>();
      const ref2 = React.createRef<HTMLDivElement>();
      render(
        <>
          <div ref={ref1}> Test ref 1 </div> <div ref={ref2}> Test ref 2 </div>
        </>
      );

      renderHook(() => useOnClickOutside([ref1, ref2], callback));
      userEvent.click(body);
      expect(callback).toHaveBeenCalledTimes(1);
    });
    test("does not execute callback when clicking inside elements", () => {
      const callback = jest.fn();
      const ref1 = React.createRef<HTMLDivElement>();
      const ref2 = React.createRef<HTMLDivElement>();
      const { getByText } = render(
        <>
          <div ref={ref1}> Test ref 1 </div> <div ref={ref2}> Test ref 2 </div>
        </>
      );

      renderHook(() => useOnClickOutside([ref1, ref2], callback));
      userEvent.click(getByText("Test ref 1"));
      expect(callback).not.toHaveBeenCalled();
      userEvent.click(getByText("Test ref 2"));
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
