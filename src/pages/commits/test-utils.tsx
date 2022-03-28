import { MockedProvider, MockedProviderProps } from "@apollo/client/testing";
import { CommitsProvider, CommitsReducerState } from "./CommitsContext";

const initialState: CommitsReducerState = {
  hoveredTaskIcon: null,
};

interface ProviderProps {
  mocks?: MockedProviderProps["mocks"];
  state?: Partial<CommitsReducerState>;
}
const ProviderWrapper: React.FC<ProviderProps> = ({
  children,
  state = {},
  mocks = [],
}) => (
  <MockedProvider mocks={mocks}>
    <CommitsProvider initialState={{ ...initialState, ...state }}>
      {children}
    </CommitsProvider>
  </MockedProvider>
);

export { ProviderWrapper };
