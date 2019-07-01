import * as enzyme from "enzyme";
import * as moment from 'moment';
import * as React from "react";
import * as rest from "../../rest/interface";
import { Variant } from '../variant/Variant';
import { Patch } from './Patch';
import { PatchContainer } from "./PatchContainer";

describe("PatchContainer", () => {

  const wrapper = enzyme.mount(<PatchContainer client={rest.EvergreenClient("", "", "", "", true)} />);

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
    expect(patch.state("description")).toBe("Patch from domino.weir at Tuesday, June 25, 2019 3:02 PM on project spruce");
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
    expect(variant.state("sortedStatus")).toEqual([{"count": 1, "status": "failed"}, {"count": 2, "status": "success"}]);
  })
})