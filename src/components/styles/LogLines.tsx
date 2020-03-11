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

export const DMessage = styled.div`
  color: #666;
`;

export const IMessage = styled.div`
  color: #333;
`;

export const WMessage = styled.div`
  color: #ffa500;
`;

export const EMessage = styled.div`
  color: #ff0000;
`;

export const getLogLineWrapper = (severity: string): React.FC => {
  switch (severity) {
    case "DEBUG":
      return DebugMessage;
    case "INFO":
      return InfoMessage;
    case "WARN":
      return WarnMessage;
    case "D":
      return DMessage;
    case "I":
      return IMessage;
    case "W":
      return WMessage;
    case "E":
      return EMessage;
    default:
      return styled.div``;
  }
};
