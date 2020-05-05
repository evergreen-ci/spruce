import React from "react";
import styled from "@emotion/styled/macro";

export const FullPageLoad: React.FC = () => {
  return (
    <FullPage>
      <div>LOADING...</div>
    </FullPage>
  );
};

const FullPage = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
