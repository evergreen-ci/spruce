import { NodeList } from "pages/preferences/preferencesTabs/cliTab/NodeList";
import { Node } from "pages/preferences/preferencesTabs/cliTab/nodeList/Node";

export default {
  title: "Pages/Preferences/Node List",
  component: NodeList,
};

export const NodeElement = () => (
  <Node
    title="Download the Command-Line Client."
    child={<Child />}
    stepNumber={1}
  />
);

const Child = () => (
  <div style={{ width: 500, height: 300, backgroundColor: "red" }}>Test</div>
);

const list = [
  {
    title: "Download the Command-Line Client.",
    child: <Child />,
  },
  {
    title:
      "Move the command-line client to somewhere in your PATH. On many systems this will be /usr/local/bin.",
    child: <Child />,
  },
];
export const NodeListFull = () => (
  <div style={{ position: "relative" }}>
    <NodeList list={list} />
  </div>
);
