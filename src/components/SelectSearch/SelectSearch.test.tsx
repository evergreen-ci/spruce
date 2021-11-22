import React from "react";
import userEvent from "@testing-library/user-event";
import { render, fireEvent } from "test_utils/test-utils";
import SelectSearch from ".";

const RenderSelectSearch = (props: any) => (
  <SelectSearch
    label="Just a test"
    searchPlaceholder="Test Placeholder"
    {...props}
  />
);

describe("SelectSearch", () => {
  test("Should toggle dropdown when clicking on it ", () => {
    const onChange = jest.fn();
    const { queryByText, getByPlaceholderText } = render(
      RenderSelectSearch({
        onChange,
        options: ["evergreen", "spruce"],
      })
    );
    // options shouldn't be open, so spruce should not be visible
    const input = getByPlaceholderText("Test Placeholder") as HTMLInputElement;
    const body = document.body as HTMLElement;
    expect(queryByText("spruce")).not.toBeInTheDocument();

    // open options, spruce should be visible
    userEvent.click(input);
    expect(queryByText("spruce")).toBeInTheDocument();

    // click outside component to close options, spruce should not be visible
    userEvent.click(body);
    expect(queryByText("spruce")).not.toBeInTheDocument();
  });

  test("Should narrow down search results when filtering", () => {
    const onChange = jest.fn();
    const { queryByText, getByPlaceholderText } = render(
      RenderSelectSearch({
        onChange,
        options: ["evergreen", "spruce"],
      })
    );
    const input = getByPlaceholderText("Test Placeholder") as HTMLInputElement;
    userEvent.click(input);

    // all options visible
    expect(queryByText("spruce")).toBeInTheDocument();
    expect(queryByText("evergreen")).toBeInTheDocument();

    fireEvent.change(input, {
      target: { value: "spr" },
    });
    expect(input).toHaveValue("spr");

    // only spruce visible
    expect(queryByText("spruce")).toBeInTheDocument();
    expect(queryByText("evergreen")).not.toBeInTheDocument();
  });

  test("Should use custom search function when passed in", () => {
    const onChange = jest.fn();
    const searchFunc = jest.fn((options, match) =>
      options.filter((o) => o === match)
    );
    const { queryByText, getByPlaceholderText } = render(
      RenderSelectSearch({
        onChange,
        options: ["evergreen", "spruce"],
        searchFunc,
      })
    );
    const input = getByPlaceholderText("Test Placeholder") as HTMLInputElement;
    userEvent.click(input);
    fireEvent.change(input, {
      target: { value: "spruce" },
    });
    expect(searchFunc).toHaveBeenCalled();
    expect(queryByText("spruce")).toBeInTheDocument();
  });

  describe("When using custom render options", () => {
    test("Should render custom options", () => {
      const onChange = jest.fn();
      const { queryByText, getByPlaceholderText } = render(
        RenderSelectSearch({
          onChange,
          options: [
            {
              label: "Evergreen",
              value: "evergreen",
            },
            {
              label: "Spruce",
              value: "spruce",
            },
          ],
          optionRenderer: (option: any, onClick) => (
            <button
              type="button"
              key={option.value}
              onClick={() => onClick(option.value)}
            >
              {option.label}
            </button>
          ),
        })
      );
      const input = getByPlaceholderText(
        "Test Placeholder"
      ) as HTMLInputElement;
      userEvent.click(input);

      expect(queryByText("Evergreen")).toBeInTheDocument();
      expect(queryByText("Spruce")).toBeInTheDocument();
      expect(queryByText("Evergreen")).toBeInstanceOf(HTMLButtonElement);
      expect(queryByText("Spruce")).toBeInstanceOf(HTMLButtonElement);
    });

    test("Should be able to click on custom elements", () => {
      const onChange = jest.fn();
      const { queryByText, getByPlaceholderText } = render(
        RenderSelectSearch({
          onChange,
          options: [
            {
              label: "Evergreen",
              value: "evergreen",
            },
            {
              label: "Spruce",
              value: "spruce",
            },
          ],
          optionRenderer: (option: any, onClick) => (
            <button
              type="button"
              key={option.value}
              onClick={() => onClick(option.value)}
            >
              {option.label}
            </button>
          ),
        })
      );
      const input = getByPlaceholderText(
        "Test Placeholder"
      ) as HTMLInputElement;
      userEvent.click(input);

      expect(queryByText("Spruce")).toBeInTheDocument();
      userEvent.click(queryByText("Spruce"));
      expect(onChange).toBeCalledWith("spruce");
    });
  });
});
