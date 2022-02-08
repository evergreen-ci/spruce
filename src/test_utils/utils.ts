const mockEnvironmentalVariables = () => {
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

export { mockEnvironmentalVariables };
