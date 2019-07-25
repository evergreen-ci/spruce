import { Button } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import * as enzyme from "enzyme";
import { APITask, APITest, ConvertToAPITasks, ConvertToBuild } from 'evergreen.js/lib/models';
import * as React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import * as rest from "../../rest/interface";
import { LogContainer, LogType } from '../log/LogContainer';
import { StyledExpansionPanel, TaskPanel } from '../task/TaskPanel';
import { BuildSidebar } from './BuildSidebar';
import { BuildView } from "./BuildView";

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

  it("clicking LogContainer toggle button changes state", () => {
    const logWrapper = enzyme.mount(<LogContainer client={rest.EvergreenClient("", "", "", "", true)} task={new APITask} test={new APITest} shouldShowTestLogs={false} onFinishStateUpdate={null} />);
    expect(logWrapper).toHaveLength(1);
    const buttonGroup = logWrapper.find(ToggleButtonGroup);
    expect(buttonGroup).toHaveLength(1);
    expect(buttonGroup.prop("value")).toBe(LogType.task);
    expect(buttonGroup.find(ToggleButton)).toHaveLength(4);
    const allButton = buttonGroup.find({ value: LogType.all }).find(ToggleButton);
    expect(allButton).toHaveLength(1);
    const checkState = jest.fn(() => {
      expect(logWrapper).toHaveLength(1);
      expect(logWrapper.state("logType")).toBe(LogType.all);
      expect(buttonGroup).toHaveLength(1);
    })
    logWrapper.setProps({ onFinishStateUpdate: checkState });
    buttonGroup.prop("onChange")({} as React.MouseEvent<HTMLElement>, LogType.all);
  })

  it("clicking on task panel loads new logs and updates state", () => {
    const mockClient = rest.EvergreenClient("", "", "", "", true);
    let build = null;
    let tasks: APITask[] = [];
    let currentTask = new APITask;
    mockClient.getBuild((err, resp, body) => {
      build = ConvertToBuild(body);
    }, "someId");
    mockClient.getTasksForBuild((err, resp, body) => {
      tasks = ConvertToAPITasks(body) as unknown as APITask[];
      currentTask = tasks[0];
    }, "someId");

    const buildSidebar = enzyme.mount(<BuildSidebar client={mockClient} build={build} tasks={tasks} switchTask={null} switchTest={null} currentTask={currentTask} onFinishStateUpdate={null} />);
    expect(buildSidebar).toHaveLength(1);
    expect(buildSidebar.prop("currentTask").task_id).toBe("spruce_ubuntu1604_compile_patch_e44b6da8831497cdd4621daf4c62985f0c1c9ca9_5d28cfa05623434037b0294c_19_07_12_18_21_22");
    const compilePanel = buildSidebar.findWhere(node => node.key() === "spruce_ubuntu1604_compile_patch_e44b6da8831497cdd4621daf4c62985f0c1c9ca9_5d28cfa05623434037b0294c_19_07_12_18_21_22").find(TaskPanel);
    expect(compilePanel).toHaveLength(1);
    expect(compilePanel.prop("isCurrentTask")).toBe(true);
    const testPanel = buildSidebar.findWhere(node => node.key() === "spruce_ubuntu1604_test_patch_e44b6da8831497cdd4621daf4c62985f0c1c9ca9_5d28cfa05623434037b0294c_19_07_12_18_21_22").find(TaskPanel);
    expect(testPanel).toHaveLength(1);
    expect(testPanel.prop("isCurrentTask")).toBe(false);

    const switchTask = jest.fn(() => {
      buildSidebar.setProps({
        currentTask: tasks[2]
      })
    });
    const checkState = jest.fn(() => {
      buildSidebar.update();
      expect(buildSidebar.prop("currentTask").task_id).toBe("spruce_ubuntu1604_test_patch_e44b6da8831497cdd4621daf4c62985f0c1c9ca9_5d28cfa05623434037b0294c_19_07_12_18_21_22");
      const checkTestPanel = buildSidebar.findWhere(node => node.key() === "spruce_ubuntu1604_test_patch_e44b6da8831497cdd4621daf4c62985f0c1c9ca9_5d28cfa05623434037b0294c_19_07_12_18_21_22").find(TaskPanel);
      expect(checkTestPanel).toHaveLength(1);
      expect(checkTestPanel.prop("isCurrentTask")).toBe(true);
      const checkCompilePanel = buildSidebar.findWhere(node => node.key() === "spruce_ubuntu1604_compile_patch_e44b6da8831497cdd4621daf4c62985f0c1c9ca9_5d28cfa05623434037b0294c_19_07_12_18_21_22").find(TaskPanel);
      expect(checkCompilePanel.prop("isCurrentTask")).toBe(false);
      expect(checkCompilePanel).toHaveLength(1);
    });
    buildSidebar.setProps({ 
      onFinishStateUpdate: checkState, 
      switchTask: switchTask
    });

    const expansionPanel = testPanel.find(StyledExpansionPanel);
    expect(expansionPanel).toHaveLength(1);
    expansionPanel.prop("onClick")({} as React.MouseEvent<HTMLDivElement, MouseEvent>);
  })

  it("clicking back button returns to patches page", () => {
    const buildSidebar = wrapper.find(BuildSidebar);
    expect(buildSidebar).toHaveLength(1);
    const backButton = buildSidebar.find(Button);
    expect(backButton).toHaveLength(1);
    backButton.simulate("click");
    expect(window.location.pathname).toBe('/patches');
  })
})