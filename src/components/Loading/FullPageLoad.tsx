import styled from "@emotion/styled";

export const FullPageLoad: React.FC = () => (
  <FullPage>
    <div>LOADING...</div>
  </FullPage>
);

const FullPage = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
