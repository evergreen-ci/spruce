import { post, fetchWithRetry } from "./request";

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

  describe("fetchWithRetry", () => {
    beforeEach(() => {
      jest.spyOn(global, "fetch").mockImplementation();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("successfully fetches data on the first try", async () => {
      const mockData = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockData),
      });

      const result = await fetchWithRetry<{ success: boolean }>(
        "https://example.com",
        {},
      );
      expect(result).toStrictEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("retries the specified number of times on failure, then succeeds", async () => {
      const mockData = { success: true };
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error("Network failure"))
        .mockRejectedValueOnce(new Error("Network failure"))
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockData),
        });

      const result = await fetchWithRetry<{ success: boolean }>(
        "https://example.com",
        {},
        2,
      );
      expect(result).toStrictEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it("fails after the specified number of retries", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(
        new Error("Network failure"),
      );

      await expect(
        fetchWithRetry("https://example.com", {}, 2),
      ).rejects.toThrow("Network failure");
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });
});
