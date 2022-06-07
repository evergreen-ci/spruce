import axios from "axios";
import { getLoginDomain } from "./environmentalVariables";
import { reportError } from "./errorReporting";

type optionsType = {
  onFailure?: (e) => void;
};
export const post = async (
  url: string,
  body: unknown,
  options: optionsType = {}
) => {
  try {
    const response = await axios.post(getLoginDomain() + url, {
      body,
    });
    if (isBadResponse(response)) {
      throw new Error(getErrorMessage(response, "POST"));
    }
    return response;
  } catch (e) {
    if (options.onFailure) {
      options.onFailure(e);
    }
    handleError(e);
  }
};

const isBadResponse = (response) =>
  !response || (response && response.statusText !== "OK");

type responseType = {
  status: number;
  statusText: string;
};
const getErrorMessage = (response: responseType, method: string) =>
  response
    ? `${method} Error: ${response.status} - ${response.statusText}`
    : `${method} Error: Did not receive a response from the server`;

const handleError = (error: string) => {
  reportError(error).warning();
};
