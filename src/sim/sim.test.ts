import { describe, expect, it } from "vitest";
import { parseIp } from "../lib/subnet";
import { newSession, run, tab, prompt, type Session } from "./cli";
import { makeHost, makeL3Switch, makeRouter, makeSwitch, type Device } from "./model";
import { ping, routingTables, spanningTree, type Net } from "./net";

const IP = (s: string) => parseIp(s)!;

function net(devs: Device[], links: [string, string, string, string][]): Net {
  return { devices: Object.fromEntries(devs.map((d) => [d.id, d])), links: links.map(([a, ai, b, bi]) => ({ a: [a, ai], b: [b, bi] })) };
}

function cli(n: Net, dev: string, lines: string[]) {
  const s = newSession(n, dev);
  const outs = lines.map((l) => run(s, l).output);
  return { s, outs };
}

function pc(id: string, ip: string, prefix: number, gw?: string) {
  const d = makeHost(id, "pc", id);
  d.host!.ip = IP(ip);
  d.host!.prefix = prefix;
  if (gw) d.host!.gateway = IP(gw);
  return d;
}

describe("CLI basics", () => {
  it("moves between modes with abbreviations and changes the prompt", () => {
    const n = net([makeRouter("r1")], []);
    const s = newSession(n, "r1");
    expect(prompt(s)).toBe("Router>");
    run(s, "en");
    expect(prompt(s)).toBe("Router#");
    run(s, "conf t");
    run(s, "hostname R1");
    expect(prompt(s)).toBe("R1(config)#");
    run(s, "int g0/0");
    expect(prompt(s)).toBe("R1(config-if)#");
    run(s, "end");
    expect(prompt(s)).toBe("R1#");
  });

  it("reports ambiguous, incomplete and invalid input like IOS", () => {
    const n = net([makeRouter("r1")], []);
    const { outs } = cli(n, "r1", ["enable", "conf t", "s", "ip route 10.0.0.0", "hostnam R1", "ip adress 1.1.1.1 255.0.0.0"]);
    expect(outs[2]).toMatch(/Ambiguous command/);
    expect(outs[3]).toBe("% Incomplete command.");
    expect(outs[4]).toBe("");
    expect(outs[5]).toMatch(/\^\n% Invalid input detected at '\^' marker\./);
  });

  it("gives ? help and tab completion", () => {
    const n = net([makeRouter("r1")], []);
    const s = newSession(n, "r1");
    run(s, "enable");
    const h = run(s, "show ip ?");
    expect(h.output).toMatch(/interface/);
    expect(h.output).toMatch(/route/);
    expect(h.keep).toBe("show ip ");
    expect(run(s, "sh?").output).toMatch(/show/);
    expect(tab(s, "conf")).toBe("configure ");
  });

  it("asks for the enable secret once it is set, and do runs exec commands", () => {
    const n = net([makeRouter("r1")], []);
    const s = newSession(n, "r1");
    ["enable", "conf t", "hostname R1", "enable secret Cisco123", "end", "disable"].forEach((l) => run(s, l));
    run(s, "enable");
    expect(prompt(s)).toBe("Password: ");
    run(s, "Cisco123");
    expect(prompt(s)).toBe("R1#");
    run(s, "conf t");
    expect(run(s, "do show run | include hostname").output).toBe("hostname R1");
  });
});

describe("network engine", () => {
  it("pings a gateway once the router interface is up", () => {
    const n = net([makeRouter("r1"), makeSwitch("sw1"), pc("pc1", "192.168.1.10", 24, "192.168.1.1")], [
      ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
      ["r1", "GigabitEthernet0/0", "sw1", "FastEthernet0/24"],
    ]);
    expect(ping(n, "pc1", IP("192.168.1.1"), false).ok).toBe(false);
    const { outs } = cli(n, "r1", ["en", "conf t", "int g0/0", "ip add 192.168.1.1 255.255.255.0", "no shut"]);
    expect(outs[4]).toMatch(/changed state to up/);
    expect(ping(n, "pc1", IP("192.168.1.1"), false).ok).toBe(true);
  });

  it("keeps VLANs apart and routes between them on a stick", () => {
    const n = net([makeRouter("r1"), makeSwitch("sw1"), pc("pc10", "192.168.10.10", 24, "192.168.10.1"), pc("pc20", "192.168.20.10", 24, "192.168.20.1")], [
      ["pc10", "FastEthernet0", "sw1", "FastEthernet0/1"],
      ["pc20", "FastEthernet0", "sw1", "FastEthernet0/2"],
      ["r1", "GigabitEthernet0/0", "sw1", "GigabitEthernet0/1"],
    ]);
    cli(n, "sw1", ["en", "conf t", "vlan 10", "name SALES", "vlan 20", "name HR", "int f0/1", "sw mode acc", "sw acc vlan 10", "int f0/2", "switchport mode access", "switchport access vlan 20", "int g0/1", "switchport mode trunk"]);
    cli(n, "r1", ["en", "conf t", "int g0/0", "no shut", "int g0/0.10", "encapsulation dot1Q 10", "ip address 192.168.10.1 255.255.255.0", "int g0/0.20", "encapsulation dot1Q 20", "ip address 192.168.20.1 255.255.255.0"]);
    expect(ping(n, "pc10", IP("192.168.20.10"), false).ok).toBe(true);
    // Remove VLAN 20 from the trunk: VLAN 20 loses its gateway.
    cli(n, "sw1", ["en", "conf t", "int g0/1", "switchport trunk allowed vlan 1,10"]);
    const r = ping(n, "pc10", IP("192.168.20.10"), false);
    expect(r.ok).toBe(false);
  });

  it("builds OSPF adjacencies and routes across three routers", () => {
    const r1 = makeRouter("r1", "R1"), r2 = makeRouter("r2", "R2"), r3 = makeRouter("r3", "R3");
    const n = net([r1, r2, r3], [
      ["r1", "GigabitEthernet0/0", "r2", "GigabitEthernet0/0"],
      ["r2", "GigabitEthernet0/1", "r3", "GigabitEthernet0/0"],
    ]);
    cli(n, "r1", ["en", "conf t", "int g0/0", "ip add 10.0.12.1 255.255.255.252", "no shut", "int lo0", "ip add 1.1.1.1 255.255.255.255", "router ospf 1", "network 10.0.12.0 0.0.0.3 area 0", "network 1.1.1.1 0.0.0.0 area 0"]);
    cli(n, "r2", ["en", "conf t", "int g0/0", "ip add 10.0.12.2 255.255.255.252", "no shut", "int g0/1", "ip add 10.0.23.1 255.255.255.252", "no shut", "router ospf 1", "network 10.0.0.0 0.255.255.255 area 0"]);
    const { outs } = cli(n, "r3", ["en", "conf t", "int g0/0", "ip add 10.0.23.2 255.255.255.252", "no shut", "int lo0", "ip add 3.3.3.3 255.255.255.255", "router ospf 1", "network 0.0.0.0 255.255.255.255 area 0"]);
    expect(outs.join("\n")).toMatch(/OSPF-5-ADJCHG/);
    const t = routingTables(n);
    expect(t.r1.some((r) => r.code === "O" && r.prefix === IP("3.3.3.3") && r.len === 32 && r.metric === 3)).toBe(true);
    expect(ping(n, "r1", IP("3.3.3.3"), false, IP("1.1.1.1")).ok).toBe(true);
    const sh = cli(n, "r2", ["en", "show ip ospf neighbor"]).outs[1];
    expect(sh).toMatch(/1\.1\.1\.1\s+1\s+FULL\//);
  });

  it("needs PAT for private hosts to reach the internet", () => {
    const isp = makeRouter("isp", "ISP");
    const n = net([makeRouter("r1"), isp, makeSwitch("sw1"), pc("pc1", "192.168.1.10", 24, "192.168.1.1")], [
      ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
      ["r1", "GigabitEthernet0/0", "sw1", "FastEthernet0/24"],
      ["r1", "GigabitEthernet0/1", "isp", "GigabitEthernet0/0"],
    ]);
    cli(n, "isp", ["en", "conf t", "int g0/0", "ip add 203.0.113.2 255.255.255.252", "no shut", "int lo0", "ip add 198.51.100.1 255.255.255.255"]);
    cli(n, "r1", ["en", "conf t", "int g0/0", "ip add 192.168.1.1 255.255.255.0", "no shut", "int g0/1", "ip add 203.0.113.1 255.255.255.252", "no shut", "ip route 0.0.0.0 0.0.0.0 203.0.113.2"]);
    expect(ping(n, "pc1", IP("198.51.100.1"), false).ok).toBe(false);
    cli(n, "r1", ["en", "conf t", "access-list 1 permit 192.168.1.0 0.0.0.255", "ip nat inside source list 1 interface g0/1 overload", "int g0/0", "ip nat inside", "int g0/1", "ip nat outside"]);
    expect(ping(n, "pc1", IP("198.51.100.1"), true).ok).toBe(true);
    expect(cli(n, "r1", ["en", "show ip nat translations"]).outs[1]).toMatch(/icmp\s+203\.0\.113\.1:\d+\s+192\.168\.1\.10:\d+/);
  });

  it("filters with a standard ACL and counts matches", () => {
    const n = net([makeRouter("r1"), pc("a", "10.1.1.10", 24, "10.1.1.1"), pc("b", "10.1.1.20", 24, "10.1.1.1"), pc("srv", "10.2.2.10", 24, "10.2.2.1"), makeSwitch("sw1")], [
      ["a", "FastEthernet0", "sw1", "FastEthernet0/1"],
      ["b", "FastEthernet0", "sw1", "FastEthernet0/2"],
      ["r1", "GigabitEthernet0/0", "sw1", "FastEthernet0/24"],
      ["r1", "GigabitEthernet0/1", "srv", "FastEthernet0"],
    ]);
    cli(n, "r1", ["en", "conf t", "int g0/0", "ip add 10.1.1.1 255.255.255.0", "no shut", "int g0/1", "ip add 10.2.2.1 255.255.255.0", "no shut", "access-list 10 deny host 10.1.1.10", "access-list 10 permit any", "int g0/1", "ip access-group 10 out"]);
    expect(ping(n, "a", IP("10.2.2.10"), true).ok).toBe(false);
    expect(ping(n, "b", IP("10.2.2.10"), true).ok).toBe(true);
    expect(cli(n, "r1", ["en", "show access-lists"]).outs[1]).toMatch(/10 deny\s+10\.1\.1\.10 \(1 match\)/);
  });

  it("hands out addresses through a DHCP relay", () => {
    const client = makeHost("pc1", "pc", "PC1");
    const n = net([makeRouter("r1"), makeRouter("r2"), client], [
      ["pc1", "FastEthernet0", "r1", "GigabitEthernet0/0"],
      ["r1", "GigabitEthernet0/1", "r2", "GigabitEthernet0/0"],
    ]);
    cli(n, "r2", ["en", "conf t", "int g0/0", "ip add 10.0.0.2 255.255.255.252", "no shut", "ip route 192.168.5.0 255.255.255.0 10.0.0.1", "ip dhcp excluded-address 192.168.5.1 192.168.5.10", "ip dhcp pool LAN5", "network 192.168.5.0 255.255.255.0", "default-router 192.168.5.1"]);
    cli(n, "r1", ["en", "conf t", "int g0/1", "ip add 10.0.0.1 255.255.255.252", "no shut", "int g0/0", "ip add 192.168.5.1 255.255.255.0", "no shut"]);
    const s = newSession(n, "pc1");
    expect(run(s, "ipconfig /renew").output).toMatch(/failed/);
    cli(n, "r1", ["en", "conf t", "int g0/0", "ip helper-address 10.0.0.2"]);
    const out = run(s, "ipconfig /renew").output;
    expect(out).toMatch(/192\.168\.5\.11/);
    expect(run(s, "ping 10.0.0.2").output).toMatch(/Received = [34]/);
  });

  it("negotiates trunks with DTP and elects a root bridge", () => {
    const n = net([makeSwitch("a"), makeSwitch("b"), makeSwitch("c")], [
      ["a", "GigabitEthernet0/1", "b", "GigabitEthernet0/1"],
      ["b", "GigabitEthernet0/2", "c", "GigabitEthernet0/1"],
      ["c", "GigabitEthernet0/2", "a", "GigabitEthernet0/2"],
    ]);
    cli(n, "b", ["en", "conf t", "spanning-tree vlan 1 root primary"]);
    const st = spanningTree(n, 1);
    expect(st.b.rootDev).toBe("b");
    const blocked = Object.values(st).flatMap((x) => x.ports).filter((p) => p.state === "BLK");
    expect(blocked.length).toBe(1);
    // auto + auto stays access, so no trunk shows
    expect(cli(n, "a", ["en", "show interfaces trunk"]).outs[1]).toBe("");
    cli(n, "a", ["en", "conf t", "int g0/1", "switchport mode dynamic desirable"]);
    expect(cli(n, "a", ["en", "show interfaces trunk"]).outs[1]).toMatch(/Gi0\/1\s+desirable/);
  });

  it("supports SVIs on a Layer 3 switch once ip routing is on", () => {
    const n = net([makeL3Switch("l3"), pc("p1", "10.10.10.10", 24, "10.10.10.1"), pc("p2", "10.20.20.10", 24, "10.20.20.1")], [
      ["p1", "FastEthernet0", "l3", "GigabitEthernet1/0/1"],
      ["p2", "FastEthernet0", "l3", "GigabitEthernet1/0/2"],
    ]);
    cli(n, "l3", ["en", "conf t", "vlan 10", "vlan 20", "int g1/0/1", "sw mode access", "sw access vlan 10", "int g1/0/2", "sw mode access", "sw access vlan 20", "int vlan 10", "ip add 10.10.10.1 255.255.255.0", "no shut", "int vlan 20", "ip add 10.20.20.1 255.255.255.0", "no shut"]);
    expect(ping(n, "p1", IP("10.20.20.10"), false).ok).toBe(false);
    cli(n, "l3", ["en", "conf t", "ip routing"]);
    expect(ping(n, "p1", IP("10.20.20.10"), false).ok).toBe(true);
  });

  it("accepts SSH logins only after SSH is set up", () => {
    const n = net([makeRouter("r1"), pc("pc", "10.0.0.10", 24, "10.0.0.1")], [["pc", "FastEthernet0", "r1", "GigabitEthernet0/0"]]);
    cli(n, "r1", ["en", "conf t", "int g0/0", "ip add 10.0.0.1 255.255.255.0", "no shut"]);
    const s: Session = newSession(n, "pc");
    expect(run(s, "ssh -l admin 10.0.0.1").output).toMatch(/refused/);
    cli(n, "r1", ["en", "conf t", "hostname R1", "ip domain-name lab.local", "crypto key generate rsa modulus 2048", "ip ssh version 2", "username admin secret Str0ng!", "line vty 0 4", "login local", "transport input ssh"]);
    run(s, "ssh -l admin 10.0.0.1");
    expect(prompt(s)).toBe("Password: ");
    run(s, "Str0ng!");
    expect(prompt(s)).toBe("R1>");
    run(s, "exit");
    expect(prompt(s)).toBe("C:\\>");
  });
});
