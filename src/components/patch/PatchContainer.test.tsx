import { ExpansionPanel, InputBase, Select } from '@material-ui/core';
import * as enzyme from "enzyme";
import { UIPatch } from 'evergreen.js/lib/models';
import * as moment from 'moment';
import * as React from "react";
import * as InfiniteScroll from 'react-infinite-scroller';
import * as rest from "../../rest/interface";
import { Variant } from '../variant/Variant';
import { Patch } from './Patch';
import { PatchContainer } from "./PatchContainer";

describe("PatchContainer", () => {

  const wrapper = enzyme.mount(<PatchContainer client={rest.EvergreenClient("", "", "", "", true)} username={"admin"} onFinishStateUpdate={null} />);
  const infiniteScroll = wrapper.find(InfiniteScroll);
  infiniteScroll.prop("loadMore")(0);

  const checkExpandedState = jest.fn(() => {
    wrapper.update();
    expect(wrapper.state("expandedPatches")).toEqual( {
      "5d4306f33e8e863bf3bfa63c": 1,
      "5d4325c961837d1fdf407a4e": 1,
      "5d432ecbe3c3317db456ac59": 1,
      "5d432fc1e3c3317db456be9f": 1,
    });
    const patch = wrapper.findWhere(node => node.key() === "5d430370850e6177128e0b11").find(Patch);
    expect(patch).toHaveLength(1);
    expect(patch.prop("expanded")).toBe(false);
    const expansionPanel = patch.find(ExpansionPanel);
    expect(expansionPanel).toHaveLength(1);
    expect(expansionPanel.prop("expanded")).toBe(false);
  })

  it("check that expanded state persists on re-render", () => {
    wrapper.setProps({ onFinishStateUpdate: checkExpandedState });
    expect(wrapper.state("expandedPatches")).toEqual( {
      "5d430370850e6177128e0b11": 1,
      "5d4306f33e8e863bf3bfa63c": 1,
      "5d4325c961837d1fdf407a4e": 1,
      "5d432ecbe3c3317db456ac59": 1,
      "5d432fc1e3c3317db456be9f": 1,
    });
    const patch = wrapper.findWhere(node => node.key() === "5d430370850e6177128e0b11").find(Patch);
    expect(patch).toHaveLength(1);
    expect(patch.prop("expanded")).toBe(true);
    const expansionPanel = patch.find(ExpansionPanel);
    expect(expansionPanel).toHaveLength(1);
    expect(expansionPanel.prop("expanded")).toBe(true);
    expect(expansionPanel.prop("onChange")).toBeDefined();
    expansionPanel.prop("onChange")({} as React.ChangeEvent, true);
  })

  it("check that patches loaded from mock data correctly", () => {
    expect(wrapper.state("allPatches")).toHaveLength(5);
    expect(wrapper.find(Patch)).toHaveLength(5);
  })

  it("check that patch state and number of variants are correct", () => {
    const patch = wrapper.findWhere(node => node.key() === "5d4325c961837d1fdf407a4e").find(Patch);
    const variants = wrapper.findWhere(node => node.key() === "5d4325c961837d1fdf407a4e").find(Variant);
    expect(patch).toHaveLength(1);
    expect(variants).toHaveLength(1);
    expect(patch.state("description")).toBe("'evergreen-ci/spruce' pull request #18 by dominoweir: EVG-6407: add searching by patch attribute (https://github.com/evergreen-ci/spruce/pull/18)");
    expect(patch.state("author")).toBe("domino.weir");
    expect(patch.state("project")).toBe("spruce");
    expect(patch.prop("builds")).toHaveLength(1);
    expect(patch.state("datetime")).toEqual(moment("2019-08-01T17:47:52Z"));
  })

  it("check that patch with no description has the correct default description", () => {
    const patch = wrapper.findWhere(node => node.key() === "5d432ecbe3c3317db456ac59").find(Patch);
    expect(patch).toHaveLength(1);
    expect(patch.state("description")).toBeDefined();
    expect(patch.state("description")).toContain("Patch from domino.weir at ");
  })

  it("check that variant state is correct", () => {
    const variant = wrapper.findWhere(node => node.key() === "5d4325c961837d1fdf407a4e").find(Variant);
    const failedBox = variant.findWhere(node => node.key() === "failed");
    const successBox = variant.findWhere(node => node.key() === "success");
    expect(variant).toHaveLength(1);
    expect(successBox).toHaveLength(1);
    expect(failedBox).toHaveLength(1);
    expect(variant.state("name")).toBe("Ubuntu 16.04");
    expect(variant.state("sortedStatus")).toEqual([{ "count": 1, "status": "failed", "tasks": ["test"] }, { "count": 2, "status": "success", "tasks": ["compile", "lint"] }]);
  })

  it("check that search returns correct results", () => {
    const event = { currentTarget: { value: "pull request #18" } };
    const expectedResults = ["5d432fc1e3c3317db456be9f", "5d4325c961837d1fdf407a4e", "5d4306f33e8e863bf3bfa63c", "5d430370850e6177128e0b11"];
    const notInResults = ["5d432ecbe3c3317db456ac59"];
    const input = wrapper.find(".search-container").find(InputBase);
    expect(input).toHaveLength(1);
    input.prop("onChange")(event as React.ChangeEvent<HTMLInputElement>);
    const visibleIds: string[] = [];
    (wrapper.state("visiblePatches") as UIPatch[]).map(patch => (
      visibleIds.push(patch.Patch.Id)
    ));
    for (const versionId of expectedResults) {
      expect(visibleIds).toContain(versionId);
    }
    for (const versionId of notInResults) {
      expect(visibleIds).not.toContain(versionId);
    }
    wrapper.setState({searchText: ""});
  })

  const checkFilteredState = jest.fn(() => {
    expect(wrapper.state("selectedProjects")).toEqual([]);
    expect(wrapper.state("selectedStatuses")).toEqual(["created"]);
    const visibleIds: string[] = [];
    const notInResults = ["5d432fc1e3c3317db456be9f", "5d4325c961837d1fdf407a4e", "5d4306f33e8e863bf3bfa63c", "5d430370850e6177128e0b11"];
    const expectedResults = ["5d432ecbe3c3317db456ac59"];
    (wrapper.state("visiblePatches") as UIPatch[]).map(patch => {
      visibleIds.push(patch.Patch.Id);
    });
    for (const versionId of expectedResults) {
      expect(visibleIds).toContain(versionId);
    }
    for (const versionId of notInResults) {
      expect(visibleIds).not.toContain(versionId);
    }
  })

  it("check that filtering patches displays correct results", () => {
    const event = { target: { value: ["created"] } };
    wrapper.setProps({ onFinishStateUpdate: checkFilteredState });
    expect(wrapper.state("allProjects")).toEqual(["spruce"]);
    expect(wrapper.state("allStatuses")).toEqual(["failed", "created"]);
    expect(wrapper.state("selectedProjects")).toEqual([]);
    expect(wrapper.state("selectedStatuses")).toEqual([]);
    const statusSelect = wrapper.findWhere(node => node.key() === "status").find(Select);
    expect(statusSelect).toHaveLength(1);
    statusSelect.prop("onChange")(event as unknown as React.ChangeEvent<HTMLInputElement>, null);
    expect(checkFilteredState).toHaveBeenCalled();
  })
})