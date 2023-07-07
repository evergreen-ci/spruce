import ReactDOM from "react-dom";
import App from "App";
import { initializeErrorHandling } from "components/ErrorHandling";

initializeErrorHandling();

ReactDOM.render(<App />, document.getElementById("root"));
