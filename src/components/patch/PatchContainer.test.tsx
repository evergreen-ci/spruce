import { ExpansionPanel, InputBase } from '@material-ui/core';
import * as enzyme from "enzyme";
import { UIVersion } from 'evergreen.js/lib/models';
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

  const checkState = jest.fn(() => {
    wrapper.update();
    expect(wrapper.state("expandedPatches")).toEqual({ "5d1385720305b932b1d50d01": 1 });
    const patch = wrapper.findWhere(node => node.key() === "5d1385720305b932b1d50d01").find(Patch);
    expect(patch).toHaveLength(1);
    expect(patch.prop("expanded")).toBe(true);
    const expansionPanel = patch.find(ExpansionPanel);
    expect(expansionPanel).toHaveLength(1);
    expect(expansionPanel.prop("expanded")).toBe(true);
  })

  it("check that expanded state persists on re-render", () => {
    wrapper.setProps({ onFinishStateUpdate: checkState });
    expect(wrapper.state("expandedPatches")).toEqual({});
    const patch = wrapper.findWhere(node => node.key() === "5d1385720305b932b1d50d01").find(Patch);
    expect(patch).toHaveLength(1);
    expect(patch.prop("expanded")).toBe(false);
    const expansionPanel = patch.find(ExpansionPanel);
    expect(expansionPanel).toHaveLength(1);
    expect(expansionPanel.prop("expanded")).toBe(false);
    expect(expansionPanel.prop("onChange")).toBeDefined();
    expansionPanel.prop("onChange")({} as React.ChangeEvent, true);
  })

  it("check that patches loaded from mock data correctly", () => {
    expect(wrapper.find(Patch)).toHaveLength(4);
  })

  it("check that patch state and number of variants are correct", () => {
    const patch = wrapper.findWhere(node => node.key() === "5d138b6b61837d77f9dda2a1").find(Patch);
    const variants = wrapper.findWhere(node => node.key() === "5d138b6b61837d77f9dda2a1").find(Variant);
    expect(patch).toHaveLength(1);
    expect(variants).toHaveLength(3);
    expect(patch.state("description")).toBe("'evergreen-ci/evergreen' pull request #2428 by ablack12: EVG-6269 persist parserProject (https://github.com/evergreen-ci/evergreen/pull/2428)");
    expect(patch.state("author")).toBe("annie.black");
    expect(patch.state("project")).toBe("evergreen");
    expect(patch.state("builds")).toHaveLength(3);
    expect(patch.state("datetime")).toEqual(moment("2019-06-26T15:12:44.161Z"));
  })

  it("check that patch with no description has the correct default description", () => {
    const patch = wrapper.findWhere(node => node.key() === "5d126fa93627e070b33dbbc0").find(Patch);
    expect(patch).toHaveLength(1);
    expect(patch.state("description")).toBeDefined();
    expect(patch.state("description")).toContain("Patch from domino.weir at ");
  })

  it("check that variant state is correct", () => {
    const variant = wrapper.findWhere(node => node.key() === "5d1385720305b932b1d50d01").find(Variant);
    const failedBox = variant.findWhere(node => node.key() === "failed");
    const successBox = variant.findWhere(node => node.key() === "success");
    expect(variant).toHaveLength(1);
    expect(successBox).toHaveLength(1);
    expect(failedBox).toHaveLength(1);
    expect(variant.state("name")).toBe("Ubuntu 16.04");
    expect(variant.state("statusCount")).toEqual({ success: 2, failed: 1 });
    expect(variant.state("sortedStatus")).toEqual([{ "count": 1, "status": "failed" }, { "count": 2, "status": "success" }]);
  })

  it("check that search returns correct results", () => {
    const event = { currentTarget: { value: "pull request #2428" } };
    const expectedResults = ["5d138b6b61837d77f9dda2a1", "5d1391b63e8e860e458573a5"];
    const notInResults = ["5d1385720305b932b1d50d01", "5d126fa93627e070b33dbbc0"];
    const input = wrapper.find(InputBase);
    expect(input).toHaveLength(1);
    input.prop("onChange")(event as React.ChangeEvent<HTMLInputElement>);
    const visibleIds: string[] = [];
    (wrapper.state("visiblePatches") as UIVersion[]).map(patch => (
      visibleIds.push(patch.Version.id)
    ));
    for (const versionId of expectedResults) {
      expect(visibleIds).toContain(versionId);
    }
    for (const versionId of notInResults) {
      expect(visibleIds).not.toContain(versionId);
    }
  })
})