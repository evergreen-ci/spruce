import { screen, userEvent } from ".";

const mockEnvironmentVariables = () => {
  const restoreCalls = [];
  const mockEnv = (variable: string, value: string) => {
    const before = process.env[variable];
    process.env[variable] = value;

    const restore = () => {
      process.env[variable] = before;
    };
    restoreCalls.push(restore);
  };
  const cleanup = () => {
    restoreCalls.forEach((restore) => {
      restore();
    });
  };

  return { mockEnv, cleanup };
};

const selectLGOption = async (dataCy: string, option: string) => {
  expect(screen.queryByDataCy(dataCy)).not.toBeDisabled();
  userEvent.click(screen.queryByDataCy(dataCy));
  await screen.findByText(option);
  userEvent.click(screen.queryByText(option));
  expect(screen.queryByDataCy(dataCy)).toHaveTextContent(option);
};

export { mockEnvironmentVariables, selectLGOption };
