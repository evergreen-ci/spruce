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
