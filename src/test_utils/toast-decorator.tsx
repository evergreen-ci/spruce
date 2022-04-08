import { action } from "@storybook/addon-actions";
import { ToastDispatchContext } from "context/toast";

const WithToastContext = (Story) => (
  <MockToastProvider>
    <Story />
  </MockToastProvider>
);

const MockToastProvider: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toastContext = {
    success: (message: string, closable: boolean = true) =>
      action(`Toast Success`)({ message, closable }),
    warning: (message: string, closable: boolean = true) =>
      action(`Toast Warning`)({ message, closable }),
    error: (message: string, closable: boolean = true) =>
      action(`Toast Error`)({ message, closable }),
    info: (message: string, closable: boolean = true) =>
      action(`Toast Info`)({ message, closable }),
    hide: () => action(`Toast Hide`)(),
  };
  return (
    <ToastDispatchContext.Provider value={toastContext}>
      {children}
    </ToastDispatchContext.Provider>
  );
};
export default WithToastContext;
