import * as toast from "../toast";

const { useToastContext } = toast;
type DispatchToast = ReturnType<typeof useToastContext>;

/** RenderFakeToastContext is a utility that takes a React Component which implements useToastContext
 *  and returns a React Component which renders the component with the context mocked out.
 *  This is useful for testing components that use the useToastContext hook.
 *  It also exposes some methods to assert that the toast context was called with the correct parameters.
 * @param {React.FC} Component - A React Component which implements useToastContext
 * @returns {Object} response - An object with the following properties:
 * @returns {React.FC} response.Component - A React Component which renders the component with the context mocked out
 * @returns {Object} response.dispatchToast - A series of jest.fn() methods which can be used to assert that the toast context was called with the correct parameters
 * @returns {Function} response.dispatchToast.success - A jest.fn() method which can be used to assert that the success toast context was called
 * @returns {Function} response.dispatchToast.error - A jest.fn() method which can be used to assert that the error toast context was called
 * @returns {Function} response.dispatchToast.info - A jest.fn() method which can be used to assert that the info toast context was called
 * @returns {Function} response.dispatchToast.warning - A jest.fn() method which can be used to assert that the warning toast context was called
 * @returns {Function} response.dispatchToast.hide - A jest.fn() method which can be used to assert that the hide toast context was called
 * @returns {React.FC} response.HookWrapper - A React Component which wraps a hook and has the useToastContext mocked out but utilizes the same methods
 * @returns {Function} response.useToastContext - A jest.fn() method which can be used to assert that the useToastContext hook was called
 */
const RenderFakeToastContext = (Component?: React.ReactElement) => {
  const dispatchToast: DispatchToast = {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    hide: jest.fn(),
  };

  const useToastContextSpied = jest
    .spyOn(toast, "useToastContext")
    .mockImplementation(() => ({
      ...dispatchToast,
    }));

  const HookWrapper = (props: any) => {
    const { children } = props;
    return <>{children}</>;
  };
  return {
    Component: () => Component,
    HookWrapper,
    useToastContext: useToastContextSpied,
    dispatchToast,
  };
};

export { RenderFakeToastContext };
