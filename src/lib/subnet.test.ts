import { describe, expect, it } from "vitest";
import { parseCidr, subnetInfo } from "./subnet";

const info = (s: string) => {
  const p = parseCidr(s)!;
  return subnetInfo(p.ip, p.prefix);
};

describe("subnet math", () => {
  it("solves a /27 in the fourth octet", () => {
    const r = info("192.168.10.77/27");
    expect(r).toMatchObject({ network: "192.168.10.64", broadcast: "192.168.10.95", first: "192.168.10.65", last: "192.168.10.94", usable: 30, mask: "255.255.255.224", blockSize: 32, interestingOctet: 4 });
  });

  it("solves a /20 in the third octet", () => {
    const r = info("172.16.45.200/20");
    expect(r).toMatchObject({ network: "172.16.32.0", broadcast: "172.16.47.255", first: "172.16.32.1", last: "172.16.47.254", usable: 4094, blockSize: 16, interestingOctet: 3 });
  });

  it("accepts a dotted mask", () => {
    expect(info("10.1.1.5 255.255.255.252")).toMatchObject({ prefix: 30, network: "10.1.1.4", usable: 2 });
  });

  it("handles /31 and /32", () => {
    expect(info("10.0.0.1/31")).toMatchObject({ first: "10.0.0.0", last: "10.0.0.1", usable: 2 });
    expect(info("10.0.0.1/32")).toMatchObject({ first: "10.0.0.1", last: "10.0.0.1", usable: 1 });
  });

  it("rejects bad input", () => {
    expect(parseCidr("300.1.1.1/24")).toBeNull();
    expect(parseCidr("10.1.1.1/33")).toBeNull();
    expect(parseCidr("10.1.1.1 255.0.255.0")).toBeNull();
  });

  it("knows private ranges and classes", () => {
    expect(info("172.31.0.1/16")).toMatchObject({ isPrivate: true, cls: "B" });
    expect(info("172.32.0.1/16")).toMatchObject({ isPrivate: false });
    expect(info("224.0.0.5/32").cls).toBe("D");
  });
});
