import { useMemo } from "react";
import { action } from "@storybook/addon-actions";
import { ToastContext } from "context/toast";

const WithToastContext = (Story) => (
  <MockToastProvider>
    <Story />
  </MockToastProvider>
);

const MockToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toastContext = useMemo(
    () => ({
      success: (message: string, closable: boolean = true) =>
        action(`Toast Success`)({ message, closable }),
      warning: (message: string, closable: boolean = true) =>
        action(`Toast Warning`)({ message, closable }),
      error: (message: string, closable: boolean = true) =>
        action(`Toast Error`)({ message, closable }),
      info: (message: string, closable: boolean = true) =>
        action(`Toast Info`)({ message, closable }),
      progress: (
        message: string,
        progress: number = 0.5,
        closable: boolean = true,
      ) => action(`Toast Info`)({ message, progress, closable }),
      hide: () => action(`Toast Hide`)(),
    }),
    [],
  );

  return (
    <ToastContext.Provider value={toastContext}>
      {children}
    </ToastContext.Provider>
  );
};
export default WithToastContext;
