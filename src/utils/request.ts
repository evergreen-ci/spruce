import { getUiUrl } from "./environmentVariables";
import { reportError } from "./errorReporting";

export const post = async (url: string, body: unknown) => {
  try {
    const response = await fetch(`${getUiUrl()}${url}`, {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "POST"));
    }
    return response;
  } catch (e: any) {
    handleError(e);
  }
};

const getErrorMessage = async (response: Response, method: string) => {
  const { status, statusText } = response;
  return `${method} Error: ${status} - ${statusText}`;
};

const handleError = (error: string) => {
  reportError(new Error(error)).warning();
};

export const fetchWithRetry = <T = any>(
  url: string,
  options: RequestInit,
  retries: number = 3,
  backoff: number = 150,
): Promise<T> =>
  new Promise((resolve, reject) => {
    const attemptFetch = (attempt: number): void => {
      fetch(url, options)
        .then((res) => res.json())
        .then((data) => resolve(data))
        .catch((err) => {
          if (attempt <= retries) {
            setTimeout(() => attemptFetch(attempt + 1), backoff * attempt);
          } else {
            reject(err);
          }
        });
    };
    attemptFetch(1);
  });
