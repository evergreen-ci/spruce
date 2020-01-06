import * as React from "react";
import "./styles.css";
import * as ReactDOM from "react-dom";
import Evergreen from "./components/app/App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<Evergreen />, document.getElementById("root") as HTMLElement);

registerServiceWorker();
