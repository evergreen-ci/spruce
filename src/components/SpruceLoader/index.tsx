import { lazy, Suspense } from "react";

export const loadable = <
  C extends React.ComponentType<
    JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
  >
>(
  loadableComponent: () => Promise<{ default: C }>
): React.ComponentType<
  JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
> => {
  const LoadableComponent = lazy(() => loadableComponent());
  const Loadable = (props) => (
    <Suspense fallback="Loading...">
      <LoadableComponent {...props} />
    </Suspense>
  );
  return Loadable;
};
