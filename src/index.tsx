import * as React from "react";
import "./styles.css";
import * as ReactDOM from "react-dom";
import Evergreen from "./components/app/App";
import GQLWrapper from "./gql/GQLWrapper";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <GQLWrapper>
    <Evergreen />
  </GQLWrapper>,
  document.getElementById("root") as HTMLElement
);

registerServiceWorker();
