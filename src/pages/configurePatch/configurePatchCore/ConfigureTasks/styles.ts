import styled from "@emotion/styled";
import { size } from "constants/tokens";

const Tasks = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto auto;
  grid-template-areas: "a a";
  grid-auto-rows: auto;
  column-gap: ${size.l};
  row-gap: ${size.xs};
  overflow: scroll;
  max-height: 60vh;
`;

const H4 = styled.h4`
  margin-top: ${size.s};
`;

export { Tasks, H4 };
