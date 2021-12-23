import axios from "axios";
import { post } from "./request";

const API_URL = "/some/endpoint";

const jsonMessage = "got JSON response";

const mockApi = {
  statusText: "OK",
  data: jsonMessage,
};

jest.mock("axios");

test("posts", async () => {
  axios.post.mockImplementationOnce(() => Promise.resolve(mockApi));
  const response = await post(API_URL, {});
  expect(response.data).toBe(jsonMessage);
});

test("should handle a bad response", async () => {
  const errorCallback = jest.fn();
  axios.post.mockImplementationOnce(() => Promise.resolve(jsonMessage));

  expect(await post(API_URL, {}, { onFailure: errorCallback })).toBe(undefined);
  expect(errorCallback).toHaveBeenCalledTimes(1);
});
