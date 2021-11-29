import axios from "axios";
import { post, get } from "./request";

const API_URL = "/some/endpoint";
const BASE_URL = "http://localhost:3000";
const jsonMessage = "got JSON response";

const mockApi = {
  statusText: "OK",
  data: jsonMessage,
};

const mockError = {
  statusText: "ERROR",
  data: "some error",
};

jest.mock("axios");
const OLD_ENV = process.env;

beforeEach(() => {
  jest.resetModules(); // Most important - it clears the cache
  process.env = { ...OLD_ENV }; // Make a copy
  process.env.REACT_APP_SPRUCE_URL = BASE_URL;
});

afterEach(() => {
  process.env = OLD_ENV; // Restore old environment
});

const mockAxiosPost = (shouldError = false) => {
  const expectedRequest = jest.fn();
  axios.post.mockImplementationOnce((url, body) => {
    expectedRequest(url, body);
    return shouldError ? Promise.reject(mockError) : Promise.resolve(mockApi);
  });
  return expectedRequest;
};

const mockAxiosGet = (shouldError = false) => {
  const expectedRequest = jest.fn();
  axios.get.mockImplementationOnce((url) => {
    expectedRequest(url);
    return shouldError ? Promise.reject(mockError) : Promise.resolve(mockApi);
  });
  return expectedRequest;
};

describe("post", () => {
  test("normal request", async () => {
    const expectedRequest = mockAxiosPost();
    const response = await post(API_URL, {});
    expect(response.data).toBe(jsonMessage);
    expect(expectedRequest).toHaveBeenCalledWith(BASE_URL + API_URL, {
      body: {},
    });
  });
  test("should handle a bad response", async () => {
    const expectedRequest = mockAxiosPost(true);
    const errorCallback = jest.fn();
    expect(await post(API_URL, {}, { onFailure: errorCallback })).toBe(
      undefined
    );
    expect(expectedRequest).toHaveBeenCalledWith(BASE_URL + API_URL, {
      body: {},
    });
    expect(errorCallback).toHaveBeenCalledTimes(1);
  });
  test("different baseURL", async () => {
    const expectedRequest = mockAxiosPost();
    const response = await post(
      "https://mongodb.com",
      {},
      { sameDomain: false }
    );
    expect(response.data).toBe(jsonMessage);
    expect(expectedRequest).toHaveBeenCalledWith("https://mongodb.com", {
      body: {},
    });
  });
});

describe("get", () => {
  test("normal request", async () => {
    const expectedRequest = mockAxiosGet();
    const response = await get(API_URL, {});
    expect(response.data).toBe(jsonMessage);
    expect(expectedRequest).toHaveBeenCalledWith(BASE_URL + API_URL);
  });
  test("should handle a bad response", async () => {
    const expectedRequest = mockAxiosGet(true);
    const errorCallback = jest.fn();
    expect(await get(API_URL, { onFailure: errorCallback })).toBe(undefined);
    expect(expectedRequest).toHaveBeenCalledWith(BASE_URL + API_URL);
    expect(errorCallback).toHaveBeenCalledTimes(1);
  });
  test("different baseURL", async () => {
    const expectedRequest = mockAxiosGet();
    const response = await get("https://mongodb.com", { sameDomain: false });
    expect(response.data).toBe(jsonMessage);
    expect(expectedRequest).toHaveBeenCalledWith("https://mongodb.com");
  });
});
