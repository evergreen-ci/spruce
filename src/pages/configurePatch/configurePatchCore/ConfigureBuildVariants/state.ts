interface State {
  numButtonsPressed: number;
}
type Action = { type: "increment" } | { type: "decrement" };
const buttonPressedReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "increment":
      return {
        numButtonsPressed: state.numButtonsPressed + 1,
      };
    case "decrement":
      return {
        numButtonsPressed: state.numButtonsPressed - 1,
      };
    default:
      throw new Error();
  }
};

export { buttonPressedReducer };
