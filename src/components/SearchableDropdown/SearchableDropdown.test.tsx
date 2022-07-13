import userEvent from "@testing-library/user-event";
import { render, screen } from "test_utils";
import SearchableDropdown from ".";

const RenderSearchableDropdown = (
  props: Omit<React.ComponentProps<typeof SearchableDropdown>, "label">
) => <SearchableDropdown label="Just a test" {...props} />;

describe("searchableDropdown", () => {
  it("sets the label to what ever the current value is", () => {
    const onChange = jest.fn();
    render(
      RenderSearchableDropdown({
        value: "evergreen",
        onChange,
        options: ["evergreen", "spruce"],
      })
    );
    expect(screen.getByText("evergreen")).toBeInTheDocument();
  });

  it("should toggle dropdown when clicking on it", () => {
    const onChange = jest.fn();
    render(
      RenderSearchableDropdown({
        value: "evergreen",
        onChange,
        options: ["evergreen", "spruce"],
      })
    );
    expect(
      screen.queryByDataCy("searchable-dropdown-options")
    ).not.toBeInTheDocument();
    userEvent.click(screen.queryByDataCy("searchable-dropdown"));
    expect(
      screen.getByDataCy("searchable-dropdown-options")
    ).toBeInTheDocument();
    userEvent.click(screen.queryByDataCy("searchable-dropdown"));
    expect(
      screen.queryByDataCy("searchable-dropdown-options")
    ).not.toBeInTheDocument();
  });

  it("should narrow down search results when filtering", () => {
    const onChange = jest.fn();
    render(
      RenderSearchableDropdown({
        value: "evergreen",
        onChange,
        options: ["evergreen", "spruce"],
      })
    );
    expect(
      screen.queryByDataCy("searchable-dropdown-options")
    ).not.toBeInTheDocument();
    userEvent.click(screen.queryByDataCy("searchable-dropdown"));
    expect(
      screen.getByDataCy("searchable-dropdown-options")
    ).toBeInTheDocument();
    expect(
      screen.getByDataCy("searchable-dropdown-search-input")
    ).toBeInTheDocument();
    expect(screen.queryAllByDataCy("searchable-dropdown-option")).toHaveLength(
      2
    );
    userEvent.type(
      screen.queryByDataCy("searchable-dropdown-search-input"),
      "spru"
    );
    expect(screen.queryAllByDataCy("searchable-dropdown-option")).toHaveLength(
      1
    );
  });

  it("should reset the search input and options after SearchableDropdown closes", () => {
    const onChange = jest.fn();
    render(
      RenderSearchableDropdown({
        value: "evergreen",
        onChange,
        options: ["evergreen", "spruce"],
      })
    );
    // use text input to filter and click on document body (which closes the dropdown).
    userEvent.click(screen.queryByDataCy("searchable-dropdown"));
    expect(screen.queryAllByDataCy("searchable-dropdown-option")).toHaveLength(
      2
    );
    userEvent.type(
      screen.queryByDataCy("searchable-dropdown-search-input"),
      "spru"
    );
    expect(screen.queryAllByDataCy("searchable-dropdown-option")).toHaveLength(
      1
    );
    userEvent.click(screen.queryByText("spruce"));

    // when reopening the dropdown, the text input should be cleared and all options should be visible.
    userEvent.click(screen.queryByDataCy("searchable-dropdown"));
    expect(screen.queryAllByDataCy("searchable-dropdown-option")).toHaveLength(
      2
    );
    expect(
      screen.queryByDataCy("searchable-dropdown-search-input")
    ).toHaveValue("");
  });

  it("should use custom search function when passed in", () => {
    const onChange = jest.fn();
    const searchFunc = jest.fn((options, match) =>
      options.filter((o) => o === match)
    );
    render(
      RenderSearchableDropdown({
        value: ["evergreen"],
        onChange,
        options: ["evergreen", "spruce"],
        searchFunc,
      })
    );
    userEvent.click(screen.queryByDataCy("searchable-dropdown"));

    expect(
      screen.getByDataCy("searchable-dropdown-search-input")
    ).toBeInTheDocument();
    userEvent.type(
      screen.queryByDataCy("searchable-dropdown-search-input"),
      "spruce"
    );
    expect(searchFunc).toHaveBeenLastCalledWith(
      ["evergreen", "spruce"],
      "spruce"
    );
    expect(screen.getByText("spruce")).toBeInTheDocument();
  });

  describe("when multiselect == false", () => {
    it("should call onChange when clicking on an option and should close the option list", () => {
      const onChange = jest.fn();
      const { rerender } = render(
        RenderSearchableDropdown({
          value: "evergreen",
          onChange,
          options: ["evergreen", "spruce"],
        })
      );
      expect(
        screen.queryByDataCy("searchable-dropdown-options")
      ).not.toBeInTheDocument();
      userEvent.click(screen.queryByDataCy("searchable-dropdown"));
      expect(
        screen.getByDataCy("searchable-dropdown-options")
      ).toBeInTheDocument();
      userEvent.click(screen.queryByText("spruce"));
      expect(onChange).toHaveBeenCalledWith("spruce");
      expect(
        screen.queryByDataCy("searchable-dropdown-options")
      ).not.toBeInTheDocument();

      rerender(
        RenderSearchableDropdown({
          value: "spruce",
          onChange,
          options: ["evergreen", "spruce"],
        })
      );
      expect(screen.getByText("spruce")).toBeInTheDocument();
    });

    it("should reset the search input and options after user selects an option", () => {
      const onChange = jest.fn();
      render(
        RenderSearchableDropdown({
          value: "evergreen",
          onChange,
          options: ["evergreen", "spruce"],
        })
      );
      // use text input to filter and select an option.
      userEvent.click(screen.queryByDataCy("searchable-dropdown"));
      expect(
        screen.queryAllByDataCy("searchable-dropdown-option")
      ).toHaveLength(2);
      userEvent.type(
        screen.queryByDataCy("searchable-dropdown-search-input"),
        "spru"
      );
      expect(
        screen.queryAllByDataCy("searchable-dropdown-option")
      ).toHaveLength(1);
      userEvent.click(screen.queryByText("spruce"));

      // when reopening the dropdown, the text input should be cleared and all options should be visible.
      userEvent.click(screen.queryByDataCy("searchable-dropdown"));
      expect(
        screen.queryAllByDataCy("searchable-dropdown-option")
      ).toHaveLength(2);
      expect(
        screen.queryByDataCy("searchable-dropdown-search-input")
      ).toHaveValue("");
    });
  });

  describe("when multiselect == true", () => {
    it("should call onChange when clicking on multiple options and shouldn't close the dropdown", () => {
      const onChange = jest.fn();
      const { rerender } = render(
        RenderSearchableDropdown({
          value: [],
          onChange,
          options: ["evergreen", "spruce"],
          allowMultiSelect: true,
        })
      );
      expect(
        screen.queryByDataCy("searchable-dropdown-options")
      ).not.toBeInTheDocument();
      userEvent.click(screen.queryByDataCy("searchable-dropdown"));
      expect(
        screen.getByDataCy("searchable-dropdown-options")
      ).toBeInTheDocument();
      userEvent.click(screen.queryByText("spruce"));
      expect(onChange).toHaveBeenCalledWith(["spruce"]);

      rerender(
        RenderSearchableDropdown({
          value: ["spruce"],
          onChange,
          options: ["evergreen", "spruce"],
          allowMultiSelect: true,
        })
      );
      expect(
        screen.getByDataCy("searchable-dropdown-options")
      ).toBeInTheDocument();

      rerender(
        RenderSearchableDropdown({
          value: ["spruce"],
          onChange,
          options: ["evergreen", "spruce"],
          allowMultiSelect: true,
        })
      );
      userEvent.click(screen.queryByText("evergreen"));
      expect(onChange).toHaveBeenCalledWith(["spruce", "evergreen"]);
    });

    it("should NOT reset the search input and options after user selects an option", () => {
      const onChange = jest.fn();
      render(
        RenderSearchableDropdown({
          value: "evergreen",
          onChange,
          options: ["evergreen", "spruce", "sandbox"],
          allowMultiSelect: true,
        })
      );
      // use text input to filter and select an option.
      userEvent.click(screen.queryByDataCy("searchable-dropdown"));
      expect(
        screen.queryAllByDataCy("searchable-dropdown-option")
      ).toHaveLength(3);
      userEvent.type(
        screen.queryByDataCy("searchable-dropdown-search-input"),
        "s"
      );
      expect(
        screen.queryAllByDataCy("searchable-dropdown-option")
      ).toHaveLength(2);
      userEvent.click(screen.queryByText("spruce"));

      // the dropdown should not be closed and the search state should not be reset.
      expect(
        screen.queryByDataCy("searchable-dropdown-search-input")
      ).toHaveValue("s");
      expect(
        screen.queryAllByDataCy("searchable-dropdown-option")
      ).toHaveLength(2);
    });
  });

  describe("when using custom render options", () => {
    it("should render custom options", () => {
      const onChange = jest.fn();
      render(
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
      userEvent.click(screen.queryByDataCy("searchable-dropdown"));
      expect(screen.getByText("Evergreen")).toBeInTheDocument();
      expect(screen.getByText("Spruce")).toBeInTheDocument();
      expect(screen.queryByText("Evergreen")).toBeInstanceOf(HTMLButtonElement);
      expect(screen.queryByText("Spruce")).toBeInstanceOf(HTMLButtonElement);
    });

    it("should be able to click on custom elements", () => {
      const onChange = jest.fn();
      render(
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
      userEvent.click(screen.queryByDataCy("searchable-dropdown"));

      expect(screen.getByText("Spruce")).toBeInTheDocument();
      userEvent.click(screen.queryByText("Spruce"));
      expect(onChange).toHaveBeenCalledWith("spruce");
    });

    it("should render a custom button", () => {
      const onChange = jest.fn();
      render(
        RenderSearchableDropdown({
          value: "evergreen",
          onChange,
          options: ["evergreen", "spruce"],
          buttonRenderer: (option) => <b className="just-a-test">{option}</b>,
        })
      );
      expect(screen.getByText("evergreen")).toBeInTheDocument();
      expect(screen.queryByText("evergreen")).toHaveAttribute(
        "class",
        "just-a-test"
      );
    });
  });
});
