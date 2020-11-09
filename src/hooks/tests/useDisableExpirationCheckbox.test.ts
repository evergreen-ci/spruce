import { renderHook } from "@testing-library/react-hooks";
import { useDisableExpirationCheckbox } from "..";

test("Disable No Expiration checkbox when allItems and maxUnexpirable are undefined.", async () => {
  const { result } = renderHook(() =>
    useDisableExpirationCheckbox({
      allItems: undefined,
      maxUnexpireable: undefined,
    })
  );
  expect(result.current).toEqual(true);
});

const twoUnexpireableVolumesOneExpireable = [
  {
    id: "vol-0228202a15111023c",
    displayName: "",
    createdBy: "arjrsatun.psratatel",
    type: "gp2",
    availabilityZone: "us-east-1d",
    size: 200,
    expiration: new Date("2020-11-12T18:19:39Z"),
    deviceName: null,
    hostID: "i-0d5d29bf2e7ee342d",
    host: {
      displayName: "hai",
      id: "i-0d5d29bf2e7ee342d",
    },
    noExpiration: true,
    homeVolume: false,
    creationTime: new Date("2020-11-05T18:19:39Z"),
  },
  {
    id: "vol-0d7b1973c71a7cccb",
    displayName: "ramen",
    createdBy: "arrastrjun.prastatel",
    type: "gp2",
    availabilityZone: "us-east-1d",
    size: 100,
    expiration: new Date("2020-11-12T18:24:09Z"),
    deviceName: null,
    hostID: "i-0d5d29bf2e7ee342d",
    host: {
      displayName: "hai",
      id: "i-0d5d29bf2e7ee342d",
    },
    noExpiration: true,
    homeVolume: false,
    creationTime: new Date("2020-11-05T18:18:36Z"),
  },
  {
    id: "vol-0arstsrtd7b1973c71a7cccb",
    displayName: "ramen",
    createdBy: "arrastrjun.prastatel",
    type: "gp2",
    availabilityZone: "us-east-1d",
    size: 100,
    expiration: new Date("2020-11-12T18:24:09Z"),
    deviceName: null,
    hostID: "i-0d5d29bf2e7ee342d",
    host: {
      displayName: "hai",
      id: "i-0d5d29bf2e7ee342d",
    },
    noExpiration: false,
    homeVolume: false,
    creationTime: new Date("2020-11-05T18:18:36Z"),
  },
];

test("Disable the No Expiration checkbox when the max number of expireable items is 2, there are 2 expireable items in the allItems array and the target item is undefined.", async () => {
  const { result } = renderHook(() =>
    useDisableExpirationCheckbox({
      allItems: twoUnexpireableVolumesOneExpireable,
      maxUnexpireable: 2,
      targetItem: twoUnexpireableVolumesOneExpireable[2],
    })
  );
  expect(result.current).toEqual(true);
});

test("Disable the No Expiration checkbox when the max number of expireable items is 2, there are 2 expireable items in the allItems array and the target item is expirable.", async () => {
  const { result } = renderHook(() =>
    useDisableExpirationCheckbox({
      allItems: twoUnexpireableVolumesOneExpireable,
      maxUnexpireable: 2,
    })
  );
  expect(result.current).toEqual(true);
});

test("Enable the No Expiration checkbox when the max number of expireable items is 2, there are 2 expireable items in the allItems array and the target item is unexpireable.", async () => {
  const { result } = renderHook(() =>
    useDisableExpirationCheckbox({
      allItems: twoUnexpireableVolumesOneExpireable,
      maxUnexpireable: 3,
      targetItem: twoUnexpireableVolumesOneExpireable[0],
    })
  );
  expect(result.current).toEqual(false);
});

test("Enable the No Expiration checkbox when the max number of expireable items is 3, there are 2 expireable items in the allItems array and the targetItem is undefined.", async () => {
  const { result } = renderHook(() =>
    useDisableExpirationCheckbox({
      allItems: twoUnexpireableVolumesOneExpireable,
      maxUnexpireable: 3,
    })
  );
  expect(result.current).toEqual(false);
});

test("Disable the No Expiration checkbox when the max number of unexpireable items is undefined but the allItems array is defined.", async () => {
  const { result } = renderHook(() =>
    useDisableExpirationCheckbox({
      allItems: twoUnexpireableVolumesOneExpireable,
      maxUnexpireable: undefined,
    })
  );
  expect(result.current).toEqual(true);
});

test("Enable the No Expiration checkbox when the allItems array is undefined but maxUnexpireable is defined.", async () => {
  const { result } = renderHook(() =>
    useDisableExpirationCheckbox({
      allItems: undefined,
      maxUnexpireable: 3,
    })
  );
  expect(result.current).toEqual(true);
});
