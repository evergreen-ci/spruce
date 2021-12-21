import { render, fireEvent, waitFor } from "test_utils/test-utils";
import { FilesIgnoredFromCacheField } from "./FilesIgnoredFromCacheField";

describe("filesIgnoredFromCacheField", () => {
  it("does not render radio boxes when repo settings are not in use", async () => {
    const { queryByDataCy } = render(
      <FilesIgnoredFromCacheField
        formData={null}
        onChange={() => {}}
        schema={{}}
        uiSchema={{
          options: { useRepoSettings: false },
        }}
      />
    );
    expect(queryByDataCy("file-patterns-radio")).not.toBeInTheDocument();
  });

  it("renders radio boxes when repo settings are in use", async () => {
    const { queryByDataCy } = render(
      <FilesIgnoredFromCacheField
        formData={null}
        onChange={() => {}}
        schema={{}}
        uiSchema={{
          options: { useRepoSettings: true },
        }}
      />
    );
    expect(queryByDataCy("file-patterns-radio")).toBeInTheDocument();
  });

  it("shows a button when 'Override repo file pattern' is selected", async () => {
    const { queryByDataCy } = render(
      <FilesIgnoredFromCacheField
        formData={null}
        onChange={() => {}}
        schema={{
          type: "array",
          items: {
            type: "object",
            properties: {
              filePattern: {
                type: "string",
                title: "File Pattern",
              },
            },
          },
        }}
        uiSchema={{ options: { useRepoSettings: true } }}
      />
    );
    const overrideButton = queryByDataCy("file-patterns-radio")
      .firstElementChild.firstElementChild;
    expect(overrideButton.getAttribute("aria-checked")).toBe("false");
    await fireEvent.click(overrideButton);
    await waitFor(() =>
      expect(overrideButton.getAttribute("aria-checked")).toBe("true")
    );
    await waitFor(() =>
      expect(queryByDataCy("add-button")).toBeInTheDocument()
    );
  });

  it("shows the first radio box as selected when form data exists", async () => {
    const { queryByDataCy } = render(
      <FilesIgnoredFromCacheField
        formData={["test"]}
        onChange={() => {}}
        schema={{}}
        uiSchema={{ options: { useRepoSettings: true } }}
      />
    );
    const overrideButton = queryByDataCy("file-patterns-radio")
      .firstElementChild.firstElementChild;
    expect(overrideButton.getAttribute("aria-checked")).toBe("true");
  });
});
