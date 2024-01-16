import { lazy, Suspense } from "react";
import { FullPageLoad } from "components/Loading/FullPageLoad";

export const loadable = <
  C extends React.ComponentType<
    JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
  >,
>(
  loadableComponent: () => Promise<{ default: C }>,
): React.ComponentType<
  JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
> => {
  const LoadableComponent = lazy(() => loadableComponent());
  const Loadable = (props) => (
    <Suspense fallback={<FullPageLoad />}>
      <LoadableComponent {...props} />
    </Suspense>
  );
  return Loadable;
};
