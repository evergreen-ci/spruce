import ReactDOM from "react-dom/client";
import { initializeErrorHandling } from "components/ErrorHandling";
import App from "./App";

initializeErrorHandling();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
