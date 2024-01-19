import { useEffect, useRef } from "react";

// This hook changes the page title to be the specified string passed in.
// When the component its called from is unmounted the page title will return
// to the default page title
export const usePageTitle = (title: string): void => {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(
    () => () => {
      document.title = defaultTitle.current;
    },
    [],
  );
};
