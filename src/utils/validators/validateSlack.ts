export const validateSlack = (v: string): boolean =>
  v.match("(#|@).+") !== null;
