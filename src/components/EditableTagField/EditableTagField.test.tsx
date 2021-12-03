import React from "react";
import { render, fireEvent, mockUUID } from "test_utils/test-utils";
import { EditableTagField } from ".";

// Must mock uuid for this test since getRandomValues() is not supported in CI
jest.mock("uuid");

const editableTags = [
  { key: "keyA", value: "valueA" },
  {
    key: "keyB",
    value: "valueB",
  },
  {
    key: "keyC",
    value: "valueC",
  },
];

const defaultData = [...editableTags];
describe("editableTagField", () => {
  beforeAll(() => {
    mockUUID();
  });

  afterAll(() => jest.restoreAllMocks());

  it("renders editable tags", async () => {
    let data = [...defaultData];
    const updateData = jest.fn((x) => {
      data = x;
    });

    const { queryAllByDataCy, queryByText } = render(
      <EditableTagField
        inputTags={editableTags}
        onChange={updateData}
        buttonText="Add Tag"
      />
    );

    expect(queryAllByDataCy("user-tag-row")).toHaveLength(3);
    expect(queryByText("hiddenField")).toBeNull();
    expect(data).toStrictEqual(defaultData);
  });

  it("editing a tag value should update the tags", async () => {
    let data = [...defaultData];
    const updateData = jest.fn((x) => {
      data = x;
    });

    const { queryAllByDataCy } = render(
      <EditableTagField
        inputTags={editableTags}
        onChange={updateData}
        buttonText="Add Tag"
      />
    );

    expect(data).toStrictEqual(defaultData);
    expect(queryAllByDataCy("user-tag-trash-icon")[0]).toBeVisible();

    fireEvent.change(queryAllByDataCy("user-tag-value-field")[0], {
      target: { value: "new value" },
    });

    expect(queryAllByDataCy("user-tag-edit-icon")[0]).toBeVisible();

    fireEvent.click(queryAllByDataCy("user-tag-edit-icon")[0]);

    expect(updateData).toHaveBeenCalledWith([
      { key: "keyA", value: "new value" },
      ...defaultData.slice(1, 3),
    ]);
    expect(data).toStrictEqual([
      { key: "keyA", value: "new value" },
      ...defaultData.slice(1, 3),
    ]);
  });

  it("deleting a tag should remove it from the array", async () => {
    let data = [...defaultData];
    const updateData = jest.fn((x) => {
      data = x;
    });

    const { queryAllByDataCy, queryByText } = render(
      <EditableTagField
        inputTags={editableTags}
        onChange={updateData}
        buttonText="Add Tag"
      />
    );

    expect(data).toStrictEqual(defaultData);
    expect(queryAllByDataCy("user-tag-trash-icon")[0]).toBeVisible();

    fireEvent.click(queryAllByDataCy("user-tag-trash-icon")[0]);

    expect(updateData).toHaveBeenCalledWith([...defaultData.slice(1, 3)]);
    expect(data).toStrictEqual([...defaultData.slice(1, 3)]);
    expect(queryByText("keyA")).toBeNull();
  });

  it("editing a tag key should remove the old tag and replace it with a newer tag with the updated key", async () => {
    let data = [...defaultData];
    const updateData = jest.fn((x) => {
      data = x;
    });

    const { queryAllByDataCy } = render(
      <EditableTagField
        inputTags={editableTags}
        onChange={updateData}
        buttonText="Add Tag"
      />
    );

    expect(data).toStrictEqual(defaultData);
    expect(queryAllByDataCy("user-tag-trash-icon")[0]).toBeVisible();

    fireEvent.change(queryAllByDataCy("user-tag-key-field")[0], {
      target: { value: "new key" },
    });

    expect(queryAllByDataCy("user-tag-edit-icon")[0]).toBeVisible();

    fireEvent.click(queryAllByDataCy("user-tag-edit-icon")[0]);

    expect(updateData).toHaveBeenCalledWith([
      { ...defaultData[0], key: "new key" },
      ...defaultData.slice(1, 3),
    ]);
    expect(data).toStrictEqual([
      { ...defaultData[0], key: "new key" },
      ...defaultData.slice(1, 3),
    ]);
  });

  it("should be able to add an new tag with the add tag button", async () => {
    let data = [...defaultData];
    const updateData = jest.fn((x) => {
      data = x;
    });

    const { queryAllByDataCy, queryByDataCy } = render(
      <EditableTagField
        inputTags={editableTags}
        onChange={updateData}
        buttonText="Add Tag"
      />
    );

    expect(data).toStrictEqual(defaultData);
    expect(queryAllByDataCy("user-tag-row")).toHaveLength(3);
    expect(queryByDataCy("add-tag-button")).toBeVisible();

    fireEvent.click(queryByDataCy("add-tag-button"));

    expect(queryByDataCy("add-tag-button")).toBeNull();
    expect(queryAllByDataCy("user-tag-trash-icon")[3]).toBeVisible();
    expect(queryAllByDataCy("user-tag-row")).toHaveLength(4);
    expect(queryAllByDataCy("user-tag-key-field")[3]).toBeVisible();

    fireEvent.change(queryAllByDataCy("user-tag-key-field")[3], {
      target: { value: "new key" },
    });

    expect(queryAllByDataCy("user-tag-value-field")[3]).toBeVisible();

    fireEvent.change(queryAllByDataCy("user-tag-value-field")[3], {
      target: { value: "new value" },
    });

    expect(queryAllByDataCy("user-tag-edit-icon")).toHaveLength(1);

    fireEvent.click(queryAllByDataCy("user-tag-edit-icon")[0]);

    expect(updateData).toHaveBeenCalledTimes(1);
    expect(data).toStrictEqual([
      ...defaultData,
      { key: "new key", value: "new value" },
    ]);
  });
});
