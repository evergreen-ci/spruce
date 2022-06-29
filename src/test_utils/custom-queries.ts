import {
  queryHelpers,
  buildQueries,
  AllByAttribute,
  GetErrorFunction,
} from "@testing-library/react";

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;

// The queryAllByAttribute is a shortcut for attribute-based matchers
// You can also use document.querySelector or a combination of existing
// testing library utilities to find matching nodes for your query
const queryAllByDataCy: OmitFirstArg<AllByAttribute> = (...args) =>
  queryHelpers.queryAllByAttribute("data-cy", ...args);

const getMultipleError: GetErrorFunction = (_, dataCyValue) =>
  `Found multiple elements with the data-cy attribute of: ${dataCyValue}`;
const getMissingError: GetErrorFunction = (_, dataCyValue) =>
  `Unable to find an element with the data-cy attribute of: ${dataCyValue}`;

const [
  queryByDataCy,
  getAllByDataCy,
  getByDataCy,
  findAllByDataCy,
  findByDataCy,
] = buildQueries(queryAllByDataCy, getMultipleError, getMissingError);

export {
  queryByDataCy,
  queryAllByDataCy,
  getByDataCy,
  getAllByDataCy,
  findAllByDataCy,
  findByDataCy,
};
