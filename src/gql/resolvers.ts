export default {
  Query: {
    userPatches: (parent: any, { userId }: { userId: string }) => {
      return [
        {
          description: "foo",
          id: "58d05bc79dbe327e79000002"
        },
        {
          description: "foo",
          id: "58d05bc79dbe327e79000002"
        },
        {
          description: "foo",
          id: "58d05bc79dbe327e79000002"
        },
        {
          description: "foo",
          id: "58d05bc79dbe327e79000002"
        }
      ];
    }
  }
};
