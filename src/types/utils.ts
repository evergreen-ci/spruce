/** Helper to extract the type of a single element in an array of elements */
export type Unpacked<T> = T extends (infer U)[] ? U : T;

/** Helper that takes in an object of key/value pairs and returns an object of key/value pairs where only one value is required */
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

/**  Helper that takes in an object of key/value pairs and returns an object of key/value pairs where at least one value is required */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**  Helper that takes in an object of key/value pairs and returns an object of key/value pairs where none or at most one value is required */
export type RequireAtMostOne<T, Keys extends keyof T = keyof T> = Partial<
  RequireOnlyOne<T, Keys>
>;
