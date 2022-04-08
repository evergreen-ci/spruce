import styled from "@emotion/styled";

const getLogLineComp = (
  color: string
): React.VFC<{ children: React.ReactNode }> => styled.div`
  color: ${color};
`;

export const getLogLineWrapper = (
  severity: string
): React.VFC<{ children: React.ReactNode }> => {
  switch (severity) {
    case "D":
    case "DEBUG":
      return getLogLineComp("#666");
    case "W":
    case "WARN":
      return getLogLineComp("#ffa500");
    case "I":
    case "INFO":
      return getLogLineComp("#333");
    case "E":
    case "ERROR":
      return getLogLineComp("#ff0000");
    default:
      return styled.div``;
  }
};
