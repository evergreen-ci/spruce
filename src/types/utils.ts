// Helper to extract type T from an array of type T
export type Unpacked<T> = T extends (infer U)[] ? U : T;
