/** Helper to extract the type of a single element in an array of elements */
export type Unpacked<T> = T extends (infer U)[] ? U : T;

/** Helper to a record that optionally omits some fields when using an enum as a record's key */
export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

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

/** Helper that takes in an object of key/value pairs and returns an inverted object with the key/value pairs swapped */
export type InvertedObject<T extends Record<PropertyKey, PropertyKey>> = {
  [K in keyof T as T[K]]: K;
};

/** Helper to require either of two types - not both. */
export type OneOf<T1, T2> =
  | (T1 & Partial<Record<Exclude<keyof T2, keyof T1>, never>>)
  | (T2 & Partial<Record<Exclude<keyof T1, keyof T2>, never>>);

/** Helper to recursively require only a partial set of fields on a nested object */
export type Subset<K> = {
  [S in keyof K]?: K[S] extends object ? Subset<K[S]> : K[S];
};

/** Helper function that takes in a complex typescript type and evaluates it for easy debugging */
export type Evaluated<T> = {} & { [P in keyof T]: T[P] };
