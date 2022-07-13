import { render, fireEvent, mockUUID, screen } from "test_utils";
import { UserTagsField, UserTagsData } from "./UserTagsField";

// Must mock uuid for this test since getRandomValues() is not supported in CI
jest.mock("uuid");
const instanceTags = [
  { key: "keyA", value: "valueA", canBeModified: true },
  {
    key: "keyB",
    value: "valueB",
    canBeModified: true,
  },
  {
    key: "keyC",
    value: "valueC",
    canBeModified: true,
  },
  {
    key: "hiddenField",
    value: "idk",
    canBeModified: false,
  },
];

const defaultData = {
  addedInstanceTags: [],
  deletedInstanceTags: [],
};

describe("useTagsField", () => {
  beforeAll(() => {
    mockUUID();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("renders only editable instance tags", async () => {
    let data = { ...defaultData };
    const updateData = jest.fn((x: UserTagsData) => {
      data = x;
    });

    render(<UserTagsField instanceTags={instanceTags} onChange={updateData} />);

    expect(screen.queryAllByDataCy("user-tag-row")).toHaveLength(3);
    expect(screen.queryByText("hiddenField")).toBeNull();
    expect(data).toStrictEqual(defaultData);
  });

  it("editing a tag value should add it to addedInstanceTags", async () => {
    let data = { ...defaultData };
    const updateData = jest.fn((x: UserTagsData) => {
      data = x;
    });

    render(<UserTagsField instanceTags={instanceTags} onChange={updateData} />);

    expect(data).toStrictEqual(defaultData);
    expect(screen.queryAllByDataCy("user-tag-trash-icon")[0]).toBeVisible();

    fireEvent.change(screen.queryAllByDataCy("user-tag-value-field")[0], {
      target: { value: "new value" },
    });

    expect(screen.queryAllByDataCy("user-tag-edit-icon")[0]).toBeVisible();

    fireEvent.click(screen.queryAllByDataCy("user-tag-edit-icon")[0]);

    expect(updateData).toHaveBeenCalledWith({
      ...defaultData,
      addedInstanceTags: [{ key: "keyA", value: "new value" }],
    });
    expect(data).toStrictEqual({
      ...defaultData,
      addedInstanceTags: [{ key: "keyA", value: "new value" }],
    });
  });

  it("deleting a tag value should add it to deletedInstanceTags", async () => {
    let data = { ...defaultData };
    const updateData = jest.fn((x: UserTagsData) => {
      data = x;
    });

    render(<UserTagsField instanceTags={instanceTags} onChange={updateData} />);

    expect(data).toStrictEqual(defaultData);
    expect(screen.queryAllByDataCy("user-tag-trash-icon")[0]).toBeVisible();

    fireEvent.click(screen.queryAllByDataCy("user-tag-trash-icon")[0]);

    expect(updateData).toHaveBeenCalledWith({
      ...defaultData,
      deletedInstanceTags: [{ key: "keyA", value: "valueA" }],
    });
    expect(data).toStrictEqual({
      ...defaultData,
      deletedInstanceTags: [{ key: "keyA", value: "valueA" }],
    });
    expect(screen.queryByText("keyA")).toBeNull();
  });

  it("editing a tag key should add the new tag to addedInstanceTags and delete the old tag", async () => {
    let data = { ...defaultData };
    const updateData = jest.fn((x: UserTagsData) => {
      data = x;
    });

    render(<UserTagsField instanceTags={instanceTags} onChange={updateData} />);

    expect(data).toStrictEqual(defaultData);
    expect(screen.queryAllByDataCy("user-tag-trash-icon")[0]).toBeVisible();

    fireEvent.change(screen.queryAllByDataCy("user-tag-key-field")[0], {
      target: { value: "new key" },
    });

    expect(screen.queryAllByDataCy("user-tag-edit-icon")[0]).toBeVisible();

    fireEvent.click(screen.queryAllByDataCy("user-tag-edit-icon")[0]);

    expect(updateData).toHaveBeenCalledWith({
      ...defaultData,
      deletedInstanceTags: [{ key: "keyA", value: "valueA" }],
      addedInstanceTags: [{ key: "new key", value: "valueA" }],
    });
    expect(data).toStrictEqual({
      ...defaultData,
      deletedInstanceTags: [{ key: "keyA", value: "valueA" }],
      addedInstanceTags: [{ key: "new key", value: "valueA" }],
    });
  });

  it("should be able to add an new tag with the add tag button", async () => {
    let data = { ...defaultData };
    const updateData = jest.fn((x: UserTagsData) => {
      data = x;
    });

    render(<UserTagsField instanceTags={instanceTags} onChange={updateData} />);

    expect(data).toStrictEqual(defaultData);
    expect(screen.queryAllByDataCy("user-tag-row")).toHaveLength(3);
    expect(screen.queryByDataCy("add-tag-button")).toBeVisible();

    fireEvent.click(screen.queryByDataCy("add-tag-button"));

    expect(screen.queryByDataCy("add-tag-button")).toBeNull();
    expect(screen.queryAllByDataCy("user-tag-trash-icon")[3]).toBeVisible();
    expect(screen.queryAllByDataCy("user-tag-row")).toHaveLength(4);
    expect(screen.queryAllByDataCy("user-tag-key-field")[3]).toBeVisible();

    fireEvent.change(screen.queryAllByDataCy("user-tag-key-field")[3], {
      target: { value: "new key" },
    });

    expect(screen.queryAllByDataCy("user-tag-value-field")[3]).toBeVisible();

    fireEvent.change(screen.queryAllByDataCy("user-tag-value-field")[3], {
      target: { value: "new value" },
    });

    expect(screen.queryAllByDataCy("user-tag-edit-icon")).toHaveLength(1);

    fireEvent.click(screen.queryAllByDataCy("user-tag-edit-icon")[0]);

    expect(updateData).toHaveBeenCalledWith({
      ...defaultData,
      addedInstanceTags: [{ key: "new key", value: "new value" }],
    });
    expect(data).toStrictEqual({
      ...defaultData,
      addedInstanceTags: [{ key: "new key", value: "new value" }],
    });
  });
});
