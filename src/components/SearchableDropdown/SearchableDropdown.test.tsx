import React from "react";
import userEvent from "@testing-library/user-event";
import { render } from "test_utils";
import SearchableDropdown from ".";

const RenderSearchableDropdown = (
  props: Omit<React.ComponentProps<typeof SearchableDropdown>, "label">
) => <SearchableDropdown label="Just a test" {...props} />;

describe("searchableDropdown", () => {
  it("sets the label to what ever the current value is", () => {
    const onChange = jest.fn();
    const { queryByText } = render(
      RenderSearchableDropdown({
        value: "evergreen",
        onChange,
        options: ["evergreen", "spruce"],
      })
    );
    expect(queryByText("evergreen")).toBeInTheDocument();
  });

  it("should toggle dropdown when clicking on it", () => {
    const onChange = jest.fn();
    const { queryByDataCy } = render(
      RenderSearchableDropdown({
        value: "evergreen",
        onChange,
        options: ["evergreen", "spruce"],
      })
    );
    expect(
      queryByDataCy("searchable-dropdown-options")
    ).not.toBeInTheDocument();
    userEvent.click(queryByDataCy("searchable-dropdown"));
    expect(queryByDataCy("searchable-dropdown-options")).toBeInTheDocument();
    userEvent.click(queryByDataCy("searchable-dropdown"));
    expect(
      queryByDataCy("searchable-dropdown-options")
    ).not.toBeInTheDocument();
  });

  it("should narrow down search results when filtering", () => {
    const onChange = jest.fn();
    const { queryByDataCy, queryAllByDataCy } = render(
      RenderSearchableDropdown({
        value: "evergreen",
        onChange,
        options: ["evergreen", "spruce"],
      })
    );
    expect(
      queryByDataCy("searchable-dropdown-options")
    ).not.toBeInTheDocument();
    userEvent.click(queryByDataCy("searchable-dropdown"));
    expect(queryByDataCy("searchable-dropdown-options")).toBeInTheDocument();
    expect(
      queryByDataCy("searchable-dropdown-search-input")
    ).toBeInTheDocument();
    expect(queryAllByDataCy("searchable-dropdown-option")).toHaveLength(2);
    userEvent.type(queryByDataCy("searchable-dropdown-search-input"), "spru");
    expect(queryAllByDataCy("searchable-dropdown-option")).toHaveLength(1);
  });

  it("should use custom search function when passed in", () => {
    const onChange = jest.fn();
    const searchFunc = jest.fn((options, match) =>
      options.filter((o) => o === match)
    );
    const { queryByDataCy, queryByText } = render(
      RenderSearchableDropdown({
        value: ["evergreen"],
        onChange,
        options: ["evergreen", "spruce"],
        searchFunc,
      })
    );
    userEvent.click(queryByDataCy("searchable-dropdown"));

    expect(
      queryByDataCy("searchable-dropdown-search-input")
    ).toBeInTheDocument();
    userEvent.type(queryByDataCy("searchable-dropdown-search-input"), "spruce");
    expect(searchFunc).toHaveBeenLastCalledWith(
      ["evergreen", "spruce"],
      "spruce"
    );
    expect(queryByText("spruce")).toBeInTheDocument();
  });

  describe("when multiselect == false", () => {
    it("should call onChange when clicking on an option and should close the option list", () => {
      const onChange = jest.fn();
      const { queryByDataCy, queryByText, rerender } = render(
        RenderSearchableDropdown({
          value: "evergreen",
          onChange,
          options: ["evergreen", "spruce"],
        })
      );
      expect(
        queryByDataCy("searchable-dropdown-options")
      ).not.toBeInTheDocument();
      userEvent.click(queryByDataCy("searchable-dropdown"));
      expect(queryByDataCy("searchable-dropdown-options")).toBeInTheDocument();
      userEvent.click(queryByText("spruce"));
      expect(onChange).toHaveBeenCalledWith("spruce");
      expect(
        queryByDataCy("searchable-dropdown-options")
      ).not.toBeInTheDocument();
      rerender(
        RenderSearchableDropdown({
          value: "spruce",
          onChange,
          options: ["evergreen", "spruce"],
        })
      );
      expect(queryByText("spruce")).toBeInTheDocument();
    });
  });

  describe("when multiselect == true", () => {
    it("should call onChange when clicking on multiple options and shouldn't close the dropdown", () => {
      const onChange = jest.fn();
      const { queryByDataCy, queryByText, rerender } = render(
        RenderSearchableDropdown({
          value: [],
          onChange,
          options: ["evergreen", "spruce"],
          allowMultiSelect: true,
        })
      );
      expect(
        queryByDataCy("searchable-dropdown-options")
      ).not.toBeInTheDocument();
      userEvent.click(queryByDataCy("searchable-dropdown"));
      expect(queryByDataCy("searchable-dropdown-options")).toBeInTheDocument();
      userEvent.click(queryByText("spruce"));
      expect(onChange).toHaveBeenCalledWith(["spruce"]);
      rerender(
        RenderSearchableDropdown({
          value: ["spruce"],
          onChange,
          options: ["evergreen", "spruce"],
          allowMultiSelect: true,
        })
      );
      expect(queryByDataCy("searchable-dropdown-options")).toBeInTheDocument();
      rerender(
        RenderSearchableDropdown({
          value: ["spruce"],
          onChange,
          options: ["evergreen", "spruce"],
          allowMultiSelect: true,
        })
      );
      userEvent.click(queryByText("evergreen"));
      expect(onChange).toHaveBeenCalledWith(["spruce", "evergreen"]);
    });
  });

  describe("when using custom render options", () => {
    it("should render custom options", () => {
      const onChange = jest.fn();
      const { queryByText, queryByDataCy } = render(
        RenderSearchableDropdown({
          value: "evergreen",
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
      userEvent.click(queryByDataCy("searchable-dropdown"));

      expect(queryByText("Evergreen")).toBeInTheDocument();
      expect(queryByText("Spruce")).toBeInTheDocument();
      expect(queryByText("Evergreen")).toBeInstanceOf(HTMLButtonElement);
      expect(queryByText("Spruce")).toBeInstanceOf(HTMLButtonElement);
    });

    it("should be able to click on custom elements", () => {
      const onChange = jest.fn();
      const { queryByText, queryByDataCy } = render(
        RenderSearchableDropdown({
          value: "evergreen",
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
      userEvent.click(queryByDataCy("searchable-dropdown"));

      expect(queryByText("Spruce")).toBeInTheDocument();
      userEvent.click(queryByText("Spruce"));
      expect(onChange).toHaveBeenCalledWith("spruce");
    });

    it("should render a custom button", () => {
      const onChange = jest.fn();
      const { queryByText } = render(
        RenderSearchableDropdown({
          value: "evergreen",
          onChange,
          options: ["evergreen", "spruce"],
          buttonRenderer: (option) => <b className="just-a-test">{option}</b>,
        })
      );
      expect(queryByText("evergreen")).toBeInTheDocument();
      expect(queryByText("evergreen")).toHaveAttribute("class", "just-a-test");
    });
  });
});
