// Device glyphs for topology and sequence diagrams.
// Each glyph is drawn in a 56×56 box centred on (0, 0). Colours come from CSS classes.

import type { DeviceKind } from "./types";

const Arrow = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 4.2;
  const p1 = `${x2 - h * Math.cos(a - 0.55)},${y2 - h * Math.sin(a - 0.55)}`;
  const p2 = `${x2 - h * Math.cos(a + 0.55)},${y2 - h * Math.sin(a + 0.55)}`;
  return (
    <g className="dev-mark">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <polygon points={`${x2},${y2} ${p1} ${p2}`} />
    </g>
  );
};

function Router() {
  return (
    <g>
      <path className="dev-body" d="M-24,-5 v11 a24,9 0 0 0 48,0 v-11" />
      <ellipse className="dev-body" cx="0" cy="-5" rx="24" ry="9" />
      <Arrow x1={-15} y1={-10} x2={-5} y2={-6.5} />
      <Arrow x1={15} y1={0} x2={5} y2={-3.5} />
      <Arrow x1={3} y1={-7.5} x2={14} y2={-11} />
      <Arrow x1={-3} y1={-2.5} x2={-14} y2={1} />
    </g>
  );
}

function SwitchBox({ l3 }: { l3?: boolean }) {
  return (
    <g>
      <rect className="dev-body" x="-27" y="-13" width="54" height="26" rx="4" />
      {l3 ? (
        <>
          <Arrow x1={-16} y1={-7} x2={-4} y2={-2} />
          <Arrow x1={16} y1={7} x2={4} y2={2} />
          <Arrow x1={4} y1={-2} x2={16} y2={-7} />
          <Arrow x1={-4} y1={2} x2={-16} y2={7} />
        </>
      ) : (
        <>
          <Arrow x1={-15} y1={-5} x2={15} y2={-5} />
          <Arrow x1={15} y1={5} x2={-15} y2={5} />
        </>
      )}
    </g>
  );
}

function Hub() {
  return (
    <g>
      <rect className="dev-body" x="-26" y="-10" width="52" height="20" rx="3" />
      {[-15, -5, 5, 15].map((x) => (
        <rect key={x} className="dev-fillmark" x={x - 3} y="-2" width="6" height="5" rx="1" />
      ))}
    </g>
  );
}

function Pc() {
  return (
    <g>
      <rect className="dev-body" x="-21" y="-21" width="42" height="29" rx="3" />
      <rect className="dev-screen" x="-17" y="-17" width="34" height="21" rx="1.5" />
      <path className="dev-body" d="M-5,8 L-7,15 H7 L5,8" />
      <line className="dev-line" x1="-12" y1="16" x2="12" y2="16" />
    </g>
  );
}

function Laptop() {
  return (
    <g>
      <rect className="dev-body" x="-17" y="-18" width="34" height="23" rx="2.5" />
      <rect className="dev-screen" x="-14" y="-15" width="28" height="17" rx="1" />
      <path className="dev-body" d="M-24,6 H24 L20,13 H-20 Z" />
    </g>
  );
}

function Phone() {
  return (
    <g>
      <rect className="dev-body" x="-12" y="-21" width="24" height="42" rx="5" />
      <rect className="dev-screen" x="-9" y="-16" width="18" height="27" rx="1.5" />
      <circle className="dev-fillmark" cx="0" cy="16" r="1.8" />
    </g>
  );
}

function IpPhone() {
  return (
    <g>
      <rect className="dev-body" x="-21" y="-18" width="42" height="10" rx="5" />
      <path className="dev-body" d="M-17,-4 H17 L22,17 H-22 Z" />
      {[-8, 0, 8].flatMap((x) => [2, 7, 12].map((y) => <circle key={`${x}${y}`} className="dev-fillmark" cx={x} cy={y} r="1.5" />))}
    </g>
  );
}

function Printer() {
  return (
    <g>
      <rect className="dev-body" x="-13" y="-19" width="26" height="12" rx="1" />
      <rect className="dev-body" x="-21" y="-8" width="42" height="18" rx="3" />
      <rect className="dev-body" x="-13" y="6" width="26" height="11" rx="1" />
      <line className="dev-line" x1="-8" y1="11" x2="8" y2="11" />
    </g>
  );
}

function Server() {
  return (
    <g>
      <rect className="dev-body" x="-16" y="-23" width="32" height="46" rx="3" />
      {[-13, -3, 7].map((y) => (
        <g key={y}>
          <line className="dev-line" x1="-10" y1={y} x2="4" y2={y} />
          <circle className="dev-led" cx="9" cy={y} r="1.8" />
        </g>
      ))}
      <line className="dev-line" x1="-10" y1="16" x2="10" y2="16" />
    </g>
  );
}

function Firewall() {
  const rows = [-16, -5.3, 5.3, 16];
  return (
    <g>
      <rect className="dev-body dev-fw" x="-25" y="-16" width="50" height="32" rx="2" />
      {rows.slice(1, 3).map((y) => (
        <line key={y} className="dev-line" x1="-25" y1={y} x2="25" y2={y} />
      ))}
      {[-8, 8].map((x) => (
        <line key={`a${x}`} className="dev-line" x1={x} y1="-16" x2={x} y2="-5.3" />
      ))}
      {[-16, 0, 16].map((x) => (
        <line key={`b${x}`} className="dev-line" x1={x} y1="-5.3" x2={x} y2="5.3" />
      ))}
      {[-8, 8].map((x) => (
        <line key={`c${x}`} className="dev-line" x1={x} y1="5.3" x2={x} y2="16" />
      ))}
    </g>
  );
}

function Ap() {
  return (
    <g>
      <path className="dev-wave" d="M-10,-9 A13,13 0 0 1 10,-9" />
      <path className="dev-wave" d="M-17,-15 A22,22 0 0 1 17,-15" />
      <ellipse className="dev-body" cx="0" cy="6" rx="21" ry="8" />
      <path className="dev-body" d="M-21,6 v4 a21,8 0 0 0 42,0 v-4" />
      <circle className="dev-led" cx="0" cy="6" r="2" />
    </g>
  );
}

function Wlc() {
  return (
    <g>
      <rect className="dev-body" x="-27" y="-13" width="54" height="26" rx="4" />
      <path className="dev-wave" d="M-19,-1 A7,7 0 0 1 -9,-1" />
      <path className="dev-wave" d="M-22,-5 A12,12 0 0 1 -6,-5" />
      <circle className="dev-led" cx="-14" cy="3" r="2" />
      {[-5, 0, 5].map((y) => (
        <line key={y} className="dev-line" x1="2" y1={y} x2="20" y2={y} />
      ))}
    </g>
  );
}

function Cloud() {
  return <path className="dev-body dev-cloud" d="M-17,13 C-28,13 -28,-2 -17,-2 C-17,-15 2,-19 7,-8 C15,-13 25,-5 21,3 C28,5 26,13 18,13 Z" />;
}

function Internet() {
  return (
    <g>
      <circle className="dev-body" cx="0" cy="0" r="21" />
      <ellipse className="dev-line-fill" cx="0" cy="0" rx="9" ry="21" />
      <line className="dev-line" x1="-21" y1="0" x2="21" y2="0" />
      <path className="dev-line-fill" d="M-18,-10 Q0,-5 18,-10 M-18,10 Q0,5 18,10" />
    </g>
  );
}

function Controller() {
  return (
    <g>
      <rect className="dev-body" x="-23" y="-19" width="46" height="38" rx="4" />
      <line className="dev-line" x1="0" y1="-8" x2="-11" y2="8" />
      <line className="dev-line" x1="0" y1="-8" x2="11" y2="8" />
      <line className="dev-line" x1="-11" y1="8" x2="11" y2="8" />
      <circle className="dev-node" cx="0" cy="-8" r="4.5" />
      <circle className="dev-node" cx="-11" cy="8" r="4.5" />
      <circle className="dev-node" cx="11" cy="8" r="4.5" />
    </g>
  );
}

function Attacker() {
  return (
    <g className="dev-attacker">
      <path className="dev-body" d="M-19,20 C-19,4 19,4 19,20 Z" />
      <circle className="dev-body" cx="0" cy="-8" r="10" />
      <path className="dev-line" d="M-6,-10 h4 M2,-10 h4" />
    </g>
  );
}

export function DeviceGlyph({ kind }: { kind: DeviceKind }) {
  switch (kind) {
    case "router":
      return <Router />;
    case "switch":
      return <SwitchBox />;
    case "l3switch":
      return <SwitchBox l3 />;
    case "hub":
      return <Hub />;
    case "pc":
      return <Pc />;
    case "laptop":
      return <Laptop />;
    case "phone":
      return <Phone />;
    case "ipphone":
      return <IpPhone />;
    case "printer":
      return <Printer />;
    case "server":
      return <Server />;
    case "firewall":
      return <Firewall />;
    case "ap":
      return <Ap />;
    case "wlc":
      return <Wlc />;
    case "cloud":
      return <Cloud />;
    case "internet":
      return <Internet />;
    case "controller":
      return <Controller />;
    case "attacker":
      return <Attacker />;
    default:
      return <circle className="dev-body" r="18" />;
  }
}
