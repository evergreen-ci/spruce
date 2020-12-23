import { bucketByCommit } from "./bucketByCommit";

test("Returns an empty array given an empty array", () => {
  expect(bucketByCommit([])).toStrictEqual([]);
});
