// Helper to extract type T from an array of type T
export type Unpacked<T> = T extends (infer U)[] ? U : T;

// Create a record that optionally omits some fields when using an enum as a record's key
export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};
