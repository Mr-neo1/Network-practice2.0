# Roadmap

Audit of 2026-10-30, written from the point of view of a working network engineer. Items are in the order we work on them.

## Where the platform stands

- **CCNA 200-301 v1.1 blueprint: every objective has a lesson.** 75 lessons, 6 quiz questions each, 300 bank questions weighted by domain, 210 flashcards, 30 CLI labs, 43 Packet Tracer labs, a 56-day plan.
- **Strong:** subnetting/VLSM, switching, STP, OSPF, ACLs, NAT, the life-of-a-packet and troubleshooting lessons, the simulator labs for domains 2, 3 and 5.
- **Thin for the exam:** IPv6 is configure-level on the blueprint (1.8, 3.3) but the simulator has no IPv6, so there is no hands-on. Domain 6 has 5 flashcards out of 210 and no lab of any kind.
- **Thin for the job:** nothing on reading packet captures, ping/traceroute internals, device lifecycle (boot, ROMMON, password recovery, IOS upgrade, config rollback), NetFlow/IP SLA/SPAN, firewalls, model-driven automation (YANG, NETCONF, RESTCONF), hands-on Ansible, NetDevOps (Git, source of truth, pre/post checks), cloud networking.

## Checklist

### Phase 1: platform and phone app
- [ ] 1. Supabase: restore the paused project, confirm "Confirm email" is off, add a keep-alive job so the free project never pauses again
- [ ] 2. Work offline: bundle the fonts instead of loading them from Google
- [ ] 3. Android app with Capacitor: back button, status bar and safe areas, icon and splash, videos and links open in YouTube/the browser
- [ ] 4. Build the APK on GitHub Actions on every push and publish it as a downloadable release

### Phase 2: exam gaps
- [ ] 5. IPv6 in the simulator (addresses, link-local, `ipv6 unicast-routing`, static and default routes, `ping`, `show ipv6 interface brief`, `show ipv6 route`) plus two labs
- [ ] 6. Domain 6 flashcards: +30 cards (SDN planes, APIs, HTTP codes, JSON, Ansible/Terraform, AI/ML)
- [ ] 7. Exam blueprint map: every v1.1 objective, the lessons and labs that cover it, and your mastery of each
- [ ] 8. REST API playground: a mock controller in the browser to practise verbs, auth, headers, status codes and JSON (domain 6 hands-on)

### Phase 3: engineer foundations (new lessons)
- [ ] 9. ping, traceroute and ICMP in depth (TTL, unreachable codes, MTU and PMTUD, extended ping)
- [ ] 10. Reading packet captures: Wireshark and tcpdump, filters, following ARP, DHCP, DNS and a TCP session, SPAN
- [ ] 11. Device lifecycle: boot sequence, ROMMON, config register, password recovery, IOS upgrade, backups, archive and `configure replace`
- [ ] 12. Network monitoring: NetFlow/IPFIX, IP SLA, SPAN/RSPAN, baselines and alerting

### Phase 4: industry track
- [ ] 13. Ansible hands-on for network engineers: inventory, group_vars, `cisco.ios` resource modules, Jinja2 templates, backups, check/diff mode, vault
- [ ] 14. Model-driven programmability: YANG, NETCONF, RESTCONF, streaming telemetry
- [ ] 15. NetDevOps: Git for configs, source of truth (NetBox), pre/post-change validation (pyATS/Genie, Batfish), CI
- [ ] 16. Firewalls in practice: stateful inspection, zones, NGFW policy, NAT and HA on a firewall
- [ ] 17. Cloud networking: VPC/VNet, route tables, security groups, transit, hybrid VPN and direct connect
- [ ] 18. Data centre fabrics: VXLAN and EVPN basics
- [ ] 19. Career: home lab options (Packet Tracer, CML, EVE-NG, containerlab), interview questions, what to study after the CCNA
