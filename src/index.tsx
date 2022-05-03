import ReactDOM from "react-dom";
import { initializeBugsnag } from "components/ErrorBoundary";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

initializeBugsnag();
ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
