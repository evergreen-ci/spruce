import { Button } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import * as enzyme from "enzyme";
import * as React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import * as rest from "../../rest/interface";
import { BuildSidebar } from './BuildSidebar';
import { BuildView } from "./BuildView";
import { LogContainer, LogType } from './LogContainer';

describe("BuildView", () => {

  const wrapper = enzyme.mount(
    <Router>
      <BuildView client={rest.EvergreenClient("", "", "", "", true)} buildId={"spruce_ubuntu1604_compile_patch_e44b6da8831497cdd4621daf4c62985f0c1c9ca9_5d28cfa05623434037b0294c_19_07_12_18_21_22"} />
    </Router>
  );

  it("BuildView was constructed correctly", () => {
    const buildView = wrapper.find(BuildView);
    expect(buildView.state("buildId")).toBe("spruce_ubuntu1604_compile_patch_e44b6da8831497cdd4621daf4c62985f0c1c9ca9_5d28cfa05623434037b0294c_19_07_12_18_21_22");
    expect(buildView.state("apiTasks")).toHaveLength(3);
    expect(buildView.state("currentTask")).toBeDefined();
    const logContainer = wrapper.find(LogContainer);
    expect(logContainer).toHaveLength(1);
    expect(logContainer.prop("task")).toBeDefined();
    expect(logContainer.state("logText")).toBe("\"I'm a log!\"");
    expect(logContainer.state("logType")).toBe(LogType.task);
    const buildSidebar = wrapper.find(BuildSidebar);
    expect(buildSidebar).toHaveLength(1);
    expect(buildSidebar.prop("build")).toBeDefined();
  })

  it("clicking back button returns to patches page", () => {
    const buildSidebar = wrapper.find(BuildSidebar);
    expect(buildSidebar).toHaveLength(1);
    const backButton = buildSidebar.find(Button);
    expect(backButton).toHaveLength(1);
    backButton.simulate("click");
    expect(window.location.pathname).toBe('/patches');
  })

  const checkState = jest.fn(() => {
    const logContainer = wrapper.find(LogContainer);
    expect(logContainer).toHaveLength(1);
    expect(logContainer.state("logType")).toBe(LogType.all);
    const buttonGroup = logContainer.find(ToggleButtonGroup);
    expect(buttonGroup).toHaveLength(1);
    expect(buttonGroup.prop("value")).toBe(LogType.all);
  })

  it("clicking LogContainer toggle button changes state", () => {
    const logContainer = wrapper.find(LogContainer);
    expect(logContainer).toHaveLength(1);
    wrapper.setProps({ children: <LogContainer client={rest.EvergreenClient("", "", "", "", true)} task={null} onFinishStateUpdate={checkState}/> })
    const buttonGroup = logContainer.find(ToggleButtonGroup);
    expect(buttonGroup).toHaveLength(1);
    expect(buttonGroup.prop("value")).toBe(LogType.task);
    expect(buttonGroup.find(ToggleButton)).toHaveLength(4);
    const allButton = buttonGroup.find({ value: LogType.all }).find(ToggleButton);
    expect(allButton).toHaveLength(1);
    buttonGroup.prop("onChange")({} as React.MouseEvent<HTMLElement>, LogType.all)
  })
})