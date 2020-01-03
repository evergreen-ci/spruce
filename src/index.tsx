import * as React from "react";
import "./styles.css";
import * as ReactDOM from "react-dom";
import Evergreen from "./components/app/App";
import GQLClientProvider from "./gql/GQLClientProvider";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <GQLClientProvider>
    <Evergreen />
  </GQLClientProvider>,
  document.getElementById("root") as HTMLElement
);

registerServiceWorker();
