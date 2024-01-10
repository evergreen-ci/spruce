import { Errors } from "../errors";

/**
 * Returns true if a given value is null or undefined.
 * @param val - value to check
 * @returns true if the value is null or undefined
 */
export const isNullish = (val: any) => val === null || val === undefined;

/**
 * Processes errors by removing "invisible" and duplicate errors.
 * @param rawErrors - array of error messages
 * @returns an object containing:
 * - processed error messages array
 * - boolean indicating if the processed error messages array is non-empty
 */
export const processErrors = (
  rawErrors: string[],
): { errors: string[]; hasError: boolean } => {
  const errors = deduplicateErrors(filterInvisibleErrors(rawErrors));
  const hasError = !!errors.length;
  return { errors, hasError };
};

/**
 * "Invisible" errors are errors that we want to affect formState (e.g. preventing submission) but not show visibly on the UI. This function filters out invisible errors so that they do not affect the visual appearance of the form elements.
 *
 * Note that the reason we make use of "invisible" errors rather than overriding the error to be empty
 * is that empty errors do not work with the RJSF validate function. When JSON schema validation and
 * custom validation errors are merged internally in RJSF, empty error messages get ignored.
 * @param errors - array of error messages
 * @returns error messages array with "invisible" errors removed
 */
const filterInvisibleErrors = (errors: string[]) =>
  errors ? errors.filter((e) => e !== Errors.Invisible) : [];

/**
 * RJSF has a bug where errors can become duplicated when using oneOf dependencies.
 *
 * (https://github.com/rjsf-team/react-jsonschema-form/issues/1590)
 * This function removes duplicate error messages so that they don't appear on the UI.
 * @param errors - an array of error messages
 * @returns error messages array with duplicate errors removed
 */
const deduplicateErrors = (errors: string[]) =>
  errors ? Array.from(new Set(errors)) : [];
