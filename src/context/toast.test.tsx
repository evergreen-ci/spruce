import { renderHook } from "@testing-library/react-hooks";
import { act, fireEvent, render, screen, waitFor } from "test_utils";
import { RequireAtMostOne } from "types/utils";
import { RenderFakeToastContext } from "./__mocks__/toast";
import { useToastContext, ToastProvider } from "./toast";

type useToastContextProps = ReturnType<typeof useToastContext>;

// This type requires that the component only accepts one of the props
type UseToastComponentProps = RequireAtMostOne<{
  [K in keyof useToastContextProps]: Parameters<useToastContextProps[K]>;
}>;

describe("real Toast", () => {
  // Since useToastContext relies on the toastProvider which in turn relies on the react.createPortal api we cannot test it directly
  // because the react.createPortal api is not available in the testing-library/react-hooks test environment. So we need to create a wrapper
  // component that will render the toastProvider and useToastContext and test the useToastContext hook internally.
  const UseToastComponent: React.VFC<UseToastComponentProps> = (props) => {
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

  it("should error when rendered outside of ToastProvider context", () => {
    // This test intentionally throws an error so lets mock out the error object so we don't flood the test runner with errors
    const errorObject = console.error; // store the state of the object
    jest.spyOn(console, "error").mockImplementation(); // mock the object
    expect(() => render(<UseToastComponent />)).toThrow(
      "useToastContext must be used within a ToastProvider"
    );
    console.error = errorObject;
  });

  it("should not display a toast by default", () => {
    const { queryByDataCy } = render(renderContainer(<div />));
    expect(queryByDataCy("toast")).toBeNull();
  });

  describe("displays a toast which corresponds to the variant dispatched", () => {
    it("success", async () => {
      render(renderContainer(<UseToastComponent success={["test string"]} />));
      fireEvent.click(screen.queryByText("Click Me"));
      await waitFor(() => {
        expect(screen.getByDataCy("toast")).toBeInTheDocument();
      });
      expect(screen.getByText("Success!")).toBeInTheDocument();
      expect(screen.getByText("test string")).toBeInTheDocument();
    });
    it("error", async () => {
      render(renderContainer(<UseToastComponent error={["test string"]} />));
      fireEvent.click(screen.queryByText("Click Me"));
      await waitFor(() => {
        expect(screen.getByDataCy("toast")).toBeInTheDocument();
      });
      expect(screen.getByText("Error!")).toBeInTheDocument();
      expect(screen.getByText("test string")).toBeInTheDocument();
    });
    it("warning", async () => {
      render(renderContainer(<UseToastComponent warning={["test string"]} />));
      fireEvent.click(screen.queryByText("Click Me"));
      await waitFor(() => {
        expect(screen.getByDataCy("toast")).toBeInTheDocument();
      });
      expect(screen.getByText("Warning!")).toBeInTheDocument();
      expect(screen.getByText("test string")).toBeInTheDocument();
    });
    it("info", async () => {
      render(renderContainer(<UseToastComponent info={["test string"]} />));
      fireEvent.click(screen.queryByText("Click Me"));
      await waitFor(() => {
        expect(screen.getByDataCy("toast")).toBeInTheDocument();
      });
      expect(screen.getByText("Something Happened!")).toBeInTheDocument();
      expect(screen.getByText("test string")).toBeInTheDocument();
    });
  });
  it("should be able to set a custom title for a toast", async () => {
    render(
      renderContainer(
        <UseToastComponent
          info={["test string", true, { title: "Some Title" }]}
        />
      )
    );
    fireEvent.click(screen.queryByText("Click Me"));
    await waitFor(() => {
      expect(screen.queryByText("Something Happened!")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Some Title")).toBeInTheDocument();
    expect(screen.getByText("test string")).toBeInTheDocument();
  });
  describe("closing the toast", () => {
    it("should be able to close a toast by clicking the x by default", async () => {
      render(renderContainer(<UseToastComponent info={["test string"]} />));
      fireEvent.click(screen.queryByText("Click Me"));
      await waitFor(() => {
        expect(screen.getByDataCy("toast")).toBeInTheDocument();
      });
      expect(screen.getByLabelText("Close Message")).toBeInTheDocument();

      fireEvent.click(screen.queryByLabelText("Close Message"));
      await waitFor(() => {
        expect(screen.queryByDataCy("toast")).not.toBeInTheDocument();
      });
    });

    it("should not be able to close the toast when closable is false", async () => {
      render(
        renderContainer(<UseToastComponent info={["test string", false]} />)
      );
      fireEvent.click(screen.queryByText("Click Me"));
      await waitFor(() => {
        expect(screen.getByDataCy("toast")).toBeInTheDocument();
      });
      expect(screen.queryByLabelText("Close Message")).toBeNull();
    });
    it("should trigger a callback function onClose", async () => {
      const onClose = jest.fn();
      render(
        renderContainer(
          <UseToastComponent info={["test string", true, { onClose }]} />
        )
      );
      fireEvent.click(screen.queryByText("Click Me"));
      await waitFor(() => {
        expect(screen.getByDataCy("toast")).toBeInTheDocument();
      });
      expect(screen.getByLabelText("Close Message")).toBeInTheDocument();

      fireEvent.click(screen.queryByLabelText("Close Message"));
      await waitFor(() => {
        expect(screen.queryByDataCy("toast")).not.toBeInTheDocument();
      });
      expect(onClose).toHaveBeenCalledWith();
    });
  });

  it("should close on its own after a timeout has completed", async () => {
    jest.useFakeTimers();
    render(renderContainer(<UseToastComponent info={["test string", true]} />));
    fireEvent.click(screen.queryByText("Click Me"));
    await waitFor(() => {
      expect(screen.getByDataCy("toast")).toBeInTheDocument();
    });
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.queryByDataCy("toast")).not.toBeInTheDocument();
  });

  it("should hide the toast when hide() is called", async () => {
    const { rerender } = render(
      renderContainer(<UseToastComponent info={["test string", true]} />)
    );
    fireEvent.click(screen.queryByText("Click Me"));
    await waitFor(() => {
      expect(screen.getByDataCy("toast")).toBeInTheDocument();
    });
    rerender(renderContainer(<UseToastComponent hide={[]} />));
    fireEvent.click(screen.queryByText("Click Me"));
    await waitFor(() => {
      expect(screen.queryByDataCy("toast")).not.toBeInTheDocument();
    });
  });
});

describe("mocked Fake Toast", () => {
  const UseToastComponent: React.VFC = () => {
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
  it("should be able to mock the toast in a component test", () => {
    const {
      Component,
      useToastContext: useToastContextSpied,
      dispatchToast,
    } = RenderFakeToastContext(<UseToastComponent />);
    render(<Component />);
    fireEvent.click(screen.queryByText("Click Me"));
    expect(useToastContextSpied).toHaveBeenCalledTimes(1);
    expect(dispatchToast.success).toHaveBeenCalledWith("test");
  });

  it("should be able to mock the toast in a hook test", () => {
    const {
      HookWrapper,
      useToastContext: useToastContextSpied,
      dispatchToast,
    } = RenderFakeToastContext();
    renderHook(() => useUpdateToastTest(), { wrapper: HookWrapper });
    expect(useToastContextSpied).toHaveBeenCalledTimes(1);
    expect(dispatchToast.success).toHaveBeenCalledWith("test");
  });
});
