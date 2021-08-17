import React from "react";
import userEvent from "@testing-library/user-event";
import { render } from "test_utils/test-utils";
import SearchableDropdown from ".";

const RenderSearchableDropdown = (props: any) => (
  <SearchableDropdown label="Just a test" {...props} />
);

describe("SearchableDropdown", () => {
  test("Sets the label to what ever the current value is", async () => {
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

  test("Should toggle dropdown when clicking on it ", async () => {
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
  test("Should narrow down search results when filtering", async () => {
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
    expect(queryByDataCy("search-input")).toBeInTheDocument();
    expect(queryAllByDataCy("searchable-dropdown-option")).toHaveLength(2);
    userEvent.type(queryByDataCy("search-input"), "spru");
    expect(queryAllByDataCy("searchable-dropdown-option")).toHaveLength(1);
  });

  test("Should use custom search function when passed in", () => {
    const onChange = jest.fn();
    const searchFunc = jest.fn((params, match) => match === params);
    const { queryByDataCy, queryByText } = render(
      RenderSearchableDropdown({
        value: ["evergreen"],
        onChange,
        options: ["evergreen", "spruce"],
        searchFunc,
      })
    );
    userEvent.click(queryByDataCy("searchable-dropdown"));

    expect(queryByDataCy("search-input")).toBeInTheDocument();
    userEvent.type(queryByDataCy("search-input"), "spruce");
    expect(searchFunc).toHaveBeenCalled();
    expect(queryByText("spruce")).toBeInTheDocument();
  });
  describe("When multiselect == false", () => {
    test("Should call onChange when clicking on an option and should close the option list ", () => {
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
      expect(onChange).toBeCalledWith("spruce");
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
  describe("When multiselect == true", () => {
    test("Should call onChange when clicking on multiple options and shouldn't close the dropdown ", () => {
      const onChange = jest.fn();
      const { queryByDataCy, queryByText, rerender } = render(
        RenderSearchableDropdown({
          value: [],
          onChange,
          options: ["evergreen", "spruce"],
          allowMultiselect: true,
        })
      );
      expect(
        queryByDataCy("searchable-dropdown-options")
      ).not.toBeInTheDocument();
      userEvent.click(queryByDataCy("searchable-dropdown"));
      expect(queryByDataCy("searchable-dropdown-options")).toBeInTheDocument();
      userEvent.click(queryByText("spruce"));
      expect(onChange).toBeCalledWith(["spruce"]);
      rerender(
        RenderSearchableDropdown({
          value: ["spruce"],
          onChange,
          options: ["evergreen", "spruce"],
          allowMultiselect: true,
        })
      );
      expect(queryByDataCy("searchable-dropdown-options")).toBeInTheDocument();
      rerender(
        RenderSearchableDropdown({
          value: ["spruce"],
          onChange,
          options: ["evergreen", "spruce"],
          allowMultiselect: true,
        })
      );
      userEvent.click(queryByText("evergreen"));
      expect(onChange).toBeCalledWith(["spruce", "evergreen"]);
    });
  });
});
