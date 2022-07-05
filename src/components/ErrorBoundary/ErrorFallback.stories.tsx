import ErrorFallback from "./ErrorFallback";

export default {
  title: "Components/Error Fallback",
  component: ErrorFallback,
};

export const DefaultError = () => (
  <div style={{ height: "100%", width: "100%" }}>
    <ErrorFallback />
  </div>
);
