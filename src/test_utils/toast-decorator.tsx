import { useMemo } from "react";
import { action } from "@storybook/addon-actions";
import { ToastContext } from "context/toast";

const WithToastContext = (Story) => (
  <MockToastProvider>
    <Story />
  </MockToastProvider>
);

const MockToastProvider: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toastContext = useMemo(
    () => ({
      error: (message: string, closable: boolean = true) =>
        action(`Toast Error`)({ closable, message }),
      hide: () => action(`Toast Hide`)(),
      info: (message: string, closable: boolean = true) =>
        action(`Toast Info`)({ closable, message }),
      progress: (
        message: string,
        progress: number = 0.5,
        closable: boolean = true
      ) => action(`Toast Info`)({ closable, message, progress }),
      success: (message: string, closable: boolean = true) =>
        action(`Toast Success`)({ closable, message }),
      warning: (message: string, closable: boolean = true) =>
        action(`Toast Warning`)({ closable, message }),
    }),
    []
  );

  return (
    <ToastContext.Provider value={toastContext}>
      {children}
    </ToastContext.Provider>
  );
};
export default WithToastContext;
