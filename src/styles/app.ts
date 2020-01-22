/** @jsx jsx */
import { keyframes } from "@emotion/core";
import styled from "@emotion/styled/macro";

const colorTransition = keyframes`
0% {
        
  color: blue;
}

10% {
  
  color: #8e44ad;
}

20% {
  
  color: #1abc9c;
}

30% {
  
  color: #d35400;
}

40% {
  
  color: blue;
}

50% {
  
  color: #34495e;
}

60% {
  
  color: blue;
}

70% {
  
  color: #2980b9;
}
80% {

  color: #f1c40f;
}

90% {

  color: #2980b9;
}

100% {
  
  color: pink;
}
`;

export const HelloSpruceText = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100vh",
  fontSize: "50px",
  animation: `${colorTransition} 20s infinite alternate`
});
