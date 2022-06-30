import ReactDOM from "react-dom";
import App from "App";
import { initializeBugsnag } from "components/ErrorBoundary";

initializeBugsnag();
ReactDOM.render(<App />, document.getElementById("root"));
