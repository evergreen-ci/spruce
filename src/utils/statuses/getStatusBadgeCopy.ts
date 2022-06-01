// &#8209; is a non-breaking hyphen used so that statuses with a hyphen do not word break when the page width shrinks
export const getStatusBadgeCopy = (status: string) =>
  status
    ? status
        .split("-")
        .map((s) => `${s[0].toLocaleUpperCase()}${s.slice(1)}`)
        .join("-")
        .replace("/-/g", "#8209;")
    : "";
