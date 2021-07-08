import { Grid } from "pages/commits/ActiveCommits/Grid";
import { ProjectHealthWrapper } from "pages/commits/CommitsWrapper";

export default {
  title: "Commit Charts Grid",
  component: Grid,
};

export const GridLines = () => (
  <ProjectHealthWrapper>
    <Grid numDashedLine={5} />
  </ProjectHealthWrapper>
);
