import { BrowserRouter } from "react-router-dom";
import { InactiveCommits } from ".";

export default {
  title: "Inactive Commits",
  component: InactiveCommits,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export const Story = () => <InactiveCommits rolledUpVersions={versions} />;

const versions = [
  {
    id: "123",
    createTime: "2021-06-16T23:38:13Z",
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Mohamed Khelif",
  },
  {
    id: "123",
    createTime: "2021-06-16T23:38:13Z",
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Arjun Patel",
  },
];
