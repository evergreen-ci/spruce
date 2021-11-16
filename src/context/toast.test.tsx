import { renderHook } from "@testing-library/react-hooks";
import { render, fireEvent, waitFor, act } from "test_utils/test-utils";
import { RequireAtMostOne } from "types/utils";
import { RenderFakeToastContext } from "./__tests__/toast";
import { useToastContext, ToastProvider } from "./toast";

type useToastContextProps = ReturnType<typeof useToastContext>;

// This type requires that the component only accepts one of the props
type UseToastComponentProps = RequireAtMostOne<
  {
    [K in keyof useToastContextProps]: Parameters<useToastContextProps[K]>;
  }
>;

describe("Real Toast", () => {
  // Since useToastContext relies on the toastProvider which in turn relies on the react.createPortal api we cannot test it directly
  // because the react.createPortal api is not available in the testing-library/react-hooks test environment. So we need to create a wrapper
  // component that will render the toastProvider and useToastContext and test the useToastContext hook internally.
  const UseToastComponent: React.FC<UseToastComponentProps> = (props) => {
    const type = Object.keys(props)[0];
    const params = Object.values(props)[0] as [];
    const dispatchToast = useToastContext();
    return (
      <button type="button" onClick={() => dispatchToast[type](...params)}>
        Click Me
      </button>
    );
  };
  const renderContainer = (children: React.ReactElement) => (
    <ToastProvider>{children}</ToastProvider>
  );

  afterEach(() => {
    jest.useRealTimers();
  });

  test("Should error when rendered outside of ToastProvider context", () => {
    // This test intentionally throws an error so lets mock out the error object so we don't flood the test runner with errors
    const errorObject = console.error; // store the state of the object
    console.error = jest.fn(); // mock the object
    expect(() => render(<UseToastComponent />)).toThrow(
      "useToastContext must be used within a ToastProvider"
    );
    console.error = errorObject;
  });

  test("Should not display a toast by default", () => {
    const { queryByDataCy } = render(renderContainer(<div />));
    expect(queryByDataCy("toast")).toBeNull();
  });

  describe("Displays a toast which corresponds to the variant dispatched", () => {
    test("success", async () => {
      const { queryByText, queryByDataCy } = render(
        renderContainer(<UseToastComponent warning={["test string"]} />)
      );
      fireEvent.click(queryByText("Click Me"));
      await waitFor(() => {
        expect(queryByDataCy("toast")).toBeInTheDocument();
        expect(queryByText("Warning!")).toBeInTheDocument();
        expect(queryByText("test string")).toBeInTheDocument();
      });
    });
    test("error", async () => {
      const { queryByText, queryByDataCy } = render(
        renderContainer(<UseToastComponent error={["test string"]} />)
      );
      fireEvent.click(queryByText("Click Me"));
      await waitFor(() => {
        expect(queryByDataCy("toast")).toBeInTheDocument();
        expect(queryByText("Error!")).toBeInTheDocument();
        expect(queryByText("test string")).toBeInTheDocument();
      });
    });
    test("warning", async () => {
      const { queryByText, queryByDataCy } = render(
        renderContainer(<UseToastComponent warning={["test string"]} />)
      );
      fireEvent.click(queryByText("Click Me"));
      await waitFor(() => {
        expect(queryByDataCy("toast")).toBeInTheDocument();
        expect(queryByText("Warning!")).toBeInTheDocument();
        expect(queryByText("test string")).toBeInTheDocument();
      });
    });
    test("info", async () => {
      const { queryByText, queryByDataCy } = render(
        renderContainer(<UseToastComponent info={["test string"]} />)
      );
      fireEvent.click(queryByText("Click Me"));
      await waitFor(() => {
        expect(queryByDataCy("toast")).toBeInTheDocument();
        expect(queryByText("Something Happened!")).toBeInTheDocument();
        expect(queryByText("test string")).toBeInTheDocument();
      });
    });
  });
  test("Should be able to set a custom title for a toast", async () => {
    const { queryByText } = render(
      renderContainer(
        <UseToastComponent
          info={["test string", true, { title: "Some Title" }]}
        />
      )
    );
    fireEvent.click(queryByText("Click Me"));
    await waitFor(() => {
      expect(queryByText("Something Happened!")).not.toBeInTheDocument();
      expect(queryByText("Some Title")).toBeInTheDocument();
      expect(queryByText("test string")).toBeInTheDocument();
    });
  });
  describe("Closing the toast", () => {
    test("Should be able to close a toast by clicking the x by default", async () => {
      const { queryByLabelText, queryByText, queryByDataCy } = render(
        renderContainer(<UseToastComponent info={["test string"]} />)
      );
      fireEvent.click(queryByText("Click Me"));
      await waitFor(() => {
        expect(queryByDataCy("toast")).toBeInTheDocument();
      });
      expect(queryByLabelText("Close Message")).toBeInTheDocument();

      fireEvent.click(queryByLabelText("Close Message"));
      await waitFor(() => {
        expect(queryByDataCy("toast")).not.toBeInTheDocument();
      });
    });

    test("Should not be able to close the toast when closable is false", async () => {
      const { queryByLabelText, queryByText, queryByDataCy } = render(
        renderContainer(<UseToastComponent info={["test string", false]} />)
      );
      fireEvent.click(queryByText("Click Me"));
      await waitFor(() => {
        expect(queryByDataCy("toast")).toBeInTheDocument();
      });
      expect(queryByLabelText("Close Message")).toBeNull();
    });
    test("Should trigger a callback function onClose", async () => {
      const onClose = jest.fn();
      const { queryByLabelText, queryByText, queryByDataCy } = render(
        renderContainer(
          <UseToastComponent info={["test string", true, { onClose }]} />
        )
      );
      fireEvent.click(queryByText("Click Me"));
      await waitFor(() => {
        expect(queryByDataCy("toast")).toBeInTheDocument();
      });
      expect(queryByLabelText("Close Message")).toBeInTheDocument();

      fireEvent.click(queryByLabelText("Close Message"));
      await waitFor(() => {
        expect(queryByDataCy("toast")).not.toBeInTheDocument();
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("Should close on its own after a timeout has completed", async () => {
    jest.useFakeTimers();
    const { queryByText, queryByDataCy } = render(
      renderContainer(<UseToastComponent info={["test string", true]} />)
    );
    fireEvent.click(queryByText("Click Me"));
    await waitFor(() => {
      expect(queryByDataCy("toast")).toBeInTheDocument();
    });
    act(() => {
      jest.runAllTimers();
    });
    expect(queryByDataCy("toast")).not.toBeInTheDocument();
  });

  test("Should hide the toast when hide() is called", async () => {
    const { queryByText, queryByDataCy, rerender } = render(
      renderContainer(<UseToastComponent info={["test string", true]} />)
    );
    fireEvent.click(queryByText("Click Me"));
    await waitFor(() => {
      expect(queryByDataCy("toast")).toBeInTheDocument();
    });
    rerender(renderContainer(<UseToastComponent hide={[]} />));
    fireEvent.click(queryByText("Click Me"));
    await waitFor(() => {
      expect(queryByDataCy("toast")).not.toBeInTheDocument();
    });
  });
});

describe("Mocked Fake Toast", () => {
  const UseToastComponent: React.FC = () => {
    const dispatchToast = useToastContext();
    return (
      <button type="button" onClick={() => dispatchToast.success("test")}>
        Click Me
      </button>
    );
  };
  const useUpdateToastTest = () => {
    const dispatchToast = useToastContext();
    dispatchToast.success("test");
  };
  test("Should be able to mock the toast in a component test", () => {
    const {
      Component,
      useToastContext: useToastContextSpied,
      dispatchToast,
    } = RenderFakeToastContext(<UseToastComponent />);
    const { queryByText } = render(<Component />);
    fireEvent.click(queryByText("Click Me"));
    expect(useToastContextSpied).toHaveBeenCalledTimes(1);
    expect(dispatchToast.success).toHaveBeenCalled();
  });

  test("Should be able to mock the toast in a hook test", () => {
    const {
      HookWrapper,
      useToastContext: useToastContextSpied,
      dispatchToast,
    } = RenderFakeToastContext();
    renderHook(() => useUpdateToastTest(), { wrapper: HookWrapper });
    expect(useToastContextSpied).toHaveBeenCalledTimes(1);
    expect(dispatchToast.success).toHaveBeenCalled();
  });
});
