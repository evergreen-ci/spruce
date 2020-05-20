export const validateSlack = (v: string): boolean => {
  console.log(v);
  return v.match("(#|@).+") !== null;
};
