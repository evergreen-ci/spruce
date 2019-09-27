import { ExpansionPanel, InputBase, Select } from '@material-ui/core';
import * as enzyme from "enzyme";
import { PatchInfo } from 'evergreen.js/lib/models';
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
      "5d66d4aa97b1d3794298a82f": 1,
      "5d66f0fd9dbe32552f1c9166": 1,
      "5d66f2e89dbe32552f1c91f5": 1,
      "5d6fe06e9dbe3237b4cb7c15": 1,
      "5d6ff85e97b1d37d85dae045": 1,
      "5d6ffa6897b1d37d85dae0bd": 1,
      "5d700d89b237361b480b8488": 1,
      "5d700fcb97b1d30d193967d0": 1,
      "5d7018929dbe325975f6a049": 1,
    });
    const patch = wrapper.findWhere(node => node.key() === "5d7148f497b1d36cde6c995e").find(Patch);
    expect(patch).toHaveLength(1);
    expect(patch.prop("expanded")).toBe(false);
    const expansionPanel = patch.find(ExpansionPanel);
    expect(expansionPanel).toHaveLength(1);
    expect(expansionPanel.prop("expanded")).toBe(false);
  })

  it("check that expanded state persists on re-render", () => {
    wrapper.setProps({ onFinishStateUpdate: checkExpandedState });
    expect(wrapper.state("expandedPatches")).toEqual( {
      "5d66d4aa97b1d3794298a82f": 1,
      "5d66f0fd9dbe32552f1c9166": 1,
      "5d66f2e89dbe32552f1c91f5": 1,
      "5d6fe06e9dbe3237b4cb7c15": 1,
      "5d6ff85e97b1d37d85dae045": 1,
      "5d6ffa6897b1d37d85dae0bd": 1,
      "5d700d89b237361b480b8488": 1,
      "5d700fcb97b1d30d193967d0": 1,
      "5d7018929dbe325975f6a049": 1,
      "5d7148f497b1d36cde6c995e": 1,
    });
    const patch = wrapper.findWhere(node => node.key() === "5d7148f497b1d36cde6c995e").find(Patch);
    expect(patch).toHaveLength(1);
    expect(patch.prop("expanded")).toBe(true);
    const expansionPanel = patch.find(ExpansionPanel);
    expect(expansionPanel).toHaveLength(1);
    expect(expansionPanel.prop("expanded")).toBe(true);
    expect(expansionPanel.prop("onChange")).toBeDefined();
    expansionPanel.prop("onChange")({} as React.ChangeEvent, true);

    wrapper.setProps({ onFinishStateUpdate: null });
  })

  it("check that patches loaded from mock data correctly", () => {
    expect(wrapper.state("allPatches")).toHaveLength(10);
    expect(wrapper.find(Patch)).toHaveLength(10);
  })

  it("check that patch state and number of variants are correct", () => {
    const patch = wrapper.findWhere(node => node.key() === "5d7018929dbe325975f6a049").find(Patch);
    const variants = wrapper.findWhere(node => node.key() === "5d7018929dbe325975f6a049").find(Variant);
    expect(patch).toHaveLength(1);
    expect(variants).toHaveLength(2);
    expect(patch.state("description")).toBe("busyb");
    expect(patch.state("author")).toBe("baxter.hacker");
    expect(patch.state("project")).toBe("evergreen");
    expect(patch.prop("builds")).toHaveLength(2);
    expect(patch.state("datetime")).toEqual(moment("2019-09-04T20:03:31.122Z"));
  })

  it("check that patch with no description has the correct default description", () => {
    const patch = wrapper.findWhere(node => node.key() === "5d7148f497b1d36cde6c995e").find(Patch);
    expect(patch).toHaveLength(1);
    expect(patch.state("description")).toBeDefined();
    expect(patch.state("description")).toContain("Patch from baxter.hacker at ");
  })

  it("check that variant state is correct", () => {
    const variant = wrapper.findWhere(node => node.key() === "5d66f0fd9dbe32552f1c9166").find(Variant);
    const failedBox = variant.findWhere(node => node.key() === "failed");
    const successBox = variant.findWhere(node => node.key() === "success");
    expect(variant).toHaveLength(1);
    expect(successBox).toHaveLength(1);
    expect(failedBox).toHaveLength(1);
    expect(variant.state("name")).toBe("Ubuntu 16.04");
    expect(variant.state("sortedStatus")).toEqual([{ "count": 1, "status": "failed", "tasks": ["test-rest-client"] }, { "count": 5, "status": "success", "tasks": ["test-agent", "test-command", "test-rest-model", "test-rest-route", "test-auth"] }]);
  })

  it("check that search returns correct results", () => {
    const event = { currentTarget: { value: "change" } };
    const expectedResults = ["5d700d89b237361b480b8488", "5d6ffa6897b1d37d85dae0bd", "5d6ff85e97b1d37d85dae045", "5d66d4aa97b1d3794298a82f"];
    const notInResults = ["5d7148f497b1d36cde6c995e", "5d7018929dbe325975f6a049", "5d700fcb97b1d30d193967d0", 
    "5d6fe06e9dbe3237b4cb7c15", "5d66f2e89dbe32552f1c91f5", "5d66f0fd9dbe32552f1c9166"];
    const input = wrapper.find(".search-container").find(InputBase);
    expect(input).toHaveLength(1);
    input.prop("onChange")(event as React.ChangeEvent<HTMLInputElement>);
    const visibleIds: string[] = [];
    (wrapper.state("visiblePatches") as PatchInfo[]).map(patch => (
      visibleIds.push(patch.id)
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
    const notInResults = ["5d7148f497b1d36cde6c995e", "5d700fcb97b1d30d193967d0", "5d700d89b237361b480b8488", 
    "5d6ffa6897b1d37d85dae0bd", "5d6ff85e97b1d37d85dae045", "5d6fe06e9dbe3237b4cb7c15",
    "5d66f2e89dbe32552f1c91f5", "5d66f0fd9dbe32552f1c9166", "5d66d4aa97b1d3794298a82f"];
    const expectedResults = ["5d7018929dbe325975f6a049"];
    (wrapper.state("visiblePatches") as PatchInfo[]).map(patch => {
      visibleIds.push(patch.id);
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
    expect(wrapper.state("allProjects")).toEqual(["mci", "evergreen"]);
    expect(wrapper.state("allStatuses")).toEqual(["failed", "created", "succeeded"]);
    expect(wrapper.state("selectedProjects")).toEqual([]);
    expect(wrapper.state("selectedStatuses")).toEqual([]);
    const statusSelect = wrapper.findWhere(node => node.key() === "status").find(Select);
    expect(statusSelect).toHaveLength(1);
    statusSelect.prop("onChange")(event as unknown as React.ChangeEvent<HTMLInputElement>, null);
    expect(checkFilteredState).toHaveBeenCalled();
  })
})