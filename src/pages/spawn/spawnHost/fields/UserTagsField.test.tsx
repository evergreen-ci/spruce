import React from "react";
import { v4 as uuid } from "uuid";
import { render, fireEvent } from "test_utils/test-utils";
import { UserTagsField } from "./UserTagsField";

// Must mock uuid for this test since getRandomValues() is not supported in CI
jest.mock("uuid");

beforeAll(() => {
  const MAX_INT = Number.MAX_SAFE_INTEGER;
  uuid.mockImplementation(() =>
    Math.floor(Math.random() * Math.floor(MAX_INT))
  );
});

afterAll(() => jest.restoreAllMocks());

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

test("Renders only editable instance tags", async () => {
  let data = { ...defaultData };
  const updateData = jest.fn((x) => {
    data = x;
  });

  const { queryAllByDataCy, queryByText } = render(
    <UserTagsField instanceTags={instanceTags} onChange={updateData} />
  );

  expect(queryAllByDataCy("user-tag-row")).toHaveLength(3);
  expect(queryByText("hiddenField")).toBeNull();
  expect(data).toStrictEqual(defaultData);
});

test("Editing a tag value should add it to addedInstanceTags", async () => {
  let data = { ...defaultData };
  const updateData = jest.fn((x) => {
    data = x;
  });

  const { queryAllByDataCy } = render(
    <UserTagsField instanceTags={instanceTags} onChange={updateData} />
  );

  expect(data).toEqual(defaultData);
  expect(queryAllByDataCy("user-tag-trash-icon")[0]).toBeVisible();

  fireEvent.change(queryAllByDataCy("user-tag-value-field")[0], {
    target: { value: "new value" },
  });

  expect(queryAllByDataCy("user-tag-edit-icon")[0]).toBeVisible();

  fireEvent.click(queryAllByDataCy("user-tag-edit-icon")[0]);

  expect(updateData).toBeCalledTimes(2);
  expect(data).toEqual({
    ...defaultData,
    addedInstanceTags: [{ key: "keyA", value: "new value" }],
  });
});

test("Deleting a tag value should add it to deletedInstanceTags", async () => {
  let data = { ...defaultData };
  const updateData = jest.fn((x) => {
    data = x;
  });

  const { queryAllByDataCy, queryByText } = render(
    <UserTagsField instanceTags={instanceTags} onChange={updateData} />
  );

  expect(data).toEqual(defaultData);
  expect(queryAllByDataCy("user-tag-trash-icon")[0]).toBeVisible();

  fireEvent.click(queryAllByDataCy("user-tag-trash-icon")[0]);

  expect(updateData).toBeCalledTimes(2);
  expect(data).toEqual({
    ...defaultData,
    deletedInstanceTags: [{ key: "keyA", value: "valueA" }],
  });
  expect(queryByText("keyA")).toBeNull();
});

test("Editing a tag key should add the new tag to addedInstanceTags and delete the old tag", async () => {
  let data = { ...defaultData };
  const updateData = jest.fn((x) => {
    data = x;
  });

  const { queryAllByDataCy } = render(
    <UserTagsField instanceTags={instanceTags} onChange={updateData} />
  );

  expect(data).toEqual(defaultData);
  expect(queryAllByDataCy("user-tag-trash-icon")[0]).toBeVisible();

  fireEvent.change(queryAllByDataCy("user-tag-key-field")[0], {
    target: { value: "new key" },
  });

  expect(queryAllByDataCy("user-tag-edit-icon")[0]).toBeVisible();

  fireEvent.click(queryAllByDataCy("user-tag-edit-icon")[0]);

  expect(updateData).toBeCalledTimes(2);
  expect(data).toEqual({
    ...defaultData,
    deletedInstanceTags: [{ key: "keyA", value: "valueA" }],
    addedInstanceTags: [{ key: "new key", value: "valueA" }],
  });
});

test("Should be able to add an new tag with the add tag button", async () => {
  let data = { ...defaultData };
  const updateData = jest.fn((x) => {
    data = x;
  });

  const { queryAllByDataCy, queryByDataCy } = render(
    <UserTagsField instanceTags={instanceTags} onChange={updateData} />
  );

  expect(data).toEqual(defaultData);
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

  expect(updateData).toBeCalledTimes(2);
  expect(data).toEqual({
    ...defaultData,
    addedInstanceTags: [{ key: "new key", value: "new value" }],
  });
});
