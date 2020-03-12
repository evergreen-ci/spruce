import styled from "@emotion/styled/macro";

export const DebugMessage = styled.div`
  color: #666;
`;

export const InfoMessage = styled.div`
  color: #333;
`;

export const WarnMessage = styled.div`
  color: #ffa500;
`;

export const ErrorMessage = styled.div`
  color: #ff0000;
`;

export const getLogLineWrapper = (severity: string): React.FC => {
  switch (severity) {
    case "D":
    case "DEBUG":
      return DebugMessage;
    case "W":
    case "WARN":
      return WarnMessage;
    case "I":
    case "INFO":
      return InfoMessage;
    case "E":
    case "ERROR":
      return ErrorMessage;
    default:
      return styled.div``;
  }
};
