import styled from "@emotion/styled";
import { size } from "constants/tokens";

const TaskLayoutGrid = styled.div`
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

export { TaskLayoutGrid };
