import { post } from "./request";

describe("post", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should make a POST request and return the response for a successful request", async () => {
    const url = "/api/resource";
    const body = { key: "value" };
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
    });

    jest.spyOn(global, "fetch").mockImplementation(fetchMock);

    const response = await post(url, body);

    expect(response).toStrictEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith("/api/resource", {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
    });
  });

  it("should handle and report an error for a failed request", async () => {
    const url = "/api/resource";
    const body = { key: "value" };
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });
    const errorReportingMock = jest.fn();
    jest.spyOn(console, "error").mockImplementation(errorReportingMock);
    jest.spyOn(global, "fetch").mockImplementation(fetchMock);

    await post(url, body);

    expect(fetchMock).toHaveBeenCalledWith("/api/resource", {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
    });
    expect(errorReportingMock).toHaveBeenCalledTimes(1);
  });
});
