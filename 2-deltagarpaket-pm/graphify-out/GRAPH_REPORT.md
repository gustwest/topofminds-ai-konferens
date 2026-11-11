# Graph Report - projektfiler  (2026-11-04)

## Corpus Check
- Corpus is ~2,218 words - fits in a single context window. You may not need a graph.

## Summary
- 49 nodes · 117 edges · 6 communities
- Extraction: 74% EXTRACTED · 24% INFERRED · 3% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.9)
- Token cost: 28,627 input · 4,200 output

## Community Hubs (Navigation)
- Pilot, Adyen & SAP Go-Live
- Kampanjfrys Q4 & Ombokningsrisk
- Kundavtal SOW & Pilot Gate G2
- Utrullningsvågor & Slutdatum
- Fältteams- & Jourkapacitet
- Nätverks-Cutover & VLAN

## God Nodes (most connected - your core abstractions)
1. `Operativ Plan: Excel 1 (Veckoplan) & Excel 2 (Cutover Runbook)` - 17 edges
2. `Gate G2: 14 dagars felfri Pilot före Våg 1 (SOW § 2.1)` - 10 edges
3. `Marcus Berg (IT- & Driftchef) – Driftintervju AP-303` - 9 edges
4. `TeliaNet Låst Bokningsfönster 15 arb.dgr / Avgift 35 000 kr` - 7 edges
5. `Styrgruppsprotokoll #3 (2026-10-15)` - 7 edges
6. `NR-001 Uppsala City (Pilot, Go-Live 2026-10-21 v.43)` - 7 edges
7. `Kundavtal SOW OmniPOS (SOW-NR-2026-09)` - 6 edges
8. `Adyen Terminal API (Central Betalväxel)` - 6 edges
9. `TeliaNet Leveransavtal SLA-TN-8841 (Henrik Sjöberg)` - 6 edges
10. `Change Freeze Black Week v.47–48: Förbud Flagship (16–29 nov)` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Change Freeze Jul & Nyår v.51–v.01: 100 % Stopp alla butiker` --conceptually_related_to--> `Slutdatum 2027-02-26 (v.08) & Vite 75 000 kr/vecka`  [AMBIGUOUS]
  04_Mejl_Marknadschef_Kampanjplan.md → 01_SOW_Kundavtal_OmniPOS.md
- `Våg 2: Väst & Syd (12 butiker, plan v.46–49)` --conceptually_related_to--> `Change Freeze Black Week v.47–48: Förbud Flagship (16–29 nov)`  [AMBIGUOUS]
  06_Gammal_PPT_Roadmap_Sammanfattning.md → 04_Mejl_Marknadschef_Kampanjplan.md
- `Våg 4: Norrland & Outlets (8 butiker, plan v.02–06 2027)` --conceptually_related_to--> `Change Freeze Jul & Nyår v.51–v.01: 100 % Stopp alla butiker`  [AMBIGUOUS]
  06_Gammal_PPT_Roadmap_Sammanfattning.md → 04_Mejl_Marknadschef_Kampanjplan.md
- `Flaskhals: Adyen-certifiering i Pilot NR-001 låser Våg 1–4` --rationale_for--> `Gate G2: 14 dagars felfri Pilot före Våg 1 (SOW § 2.1)`  [INFERRED]
  03_Styrgruppsprotokoll_2026-10-15.md → 01_SOW_Kundavtal_OmniPOS.md
- `Våg 1: Mälardalen (10 butiker, plan v.44–46)` --conceptually_related_to--> `Gate G2: 14 dagars felfri Pilot före Våg 1 (SOW § 2.1)`  [INFERRED]
  06_Gammal_PPT_Roadmap_Sammanfattning.md → 01_SOW_Kundavtal_OmniPOS.md

## Hyperedges (group relationships)
- **Kritiska Schemakrockar i Excel-planen (Gate G2, v.46 Kapacitet, Black Week & Julhandel)** — 09_bilaga_nyckelbutiker_och_systemkopplingar_nr_003_sodertalje, 09_bilaga_nyckelbutiker_och_systemkopplingar_nr_009_010_v46_krock, 09_bilaga_nyckelbutiker_och_systemkopplingar_nr_025_026_v47_flagship, 09_bilaga_nyckelbutiker_och_systemkopplingar_nr_027_028_v48_flagship, 09_bilaga_nyckelbutiker_och_systemkopplingar_nr_033_034_v51_jul, 01_sow_kundavtal_omnipos_gate_g2_pilotkrav, 05_intervju_driftchef_butiksit_kapacitetstak_4_butiker, 04_mejl_marknadschef_kampanjplan_frys_black_week, 04_mejl_marknadschef_kampanjplan_frys_julhandel [INFERRED 0.95]
- **Kritisk Kedja Go-Live-morgon T-0 (VLAN-omkoppling, Adyen Röktest, Go/No-Go & Rollback)** — 02_leverantorsavtal_telianet_vlan_pos_40, 09_bilaga_nyckelbutiker_och_systemkopplingar_cut_08_vlan_t0, 09_bilaga_nyckelbutiker_och_systemkopplingar_cut_10_12_roktest_gonogo, 02_leverantorsavtal_telianet_rollback_beredskap, 01_sow_kundavtal_omnipos_legacycash_2014 [EXTRACTED 1.00]
- **Godkännandekedja för Gate G2 (Pilot NR-001/002, Adyen v4.2.4, SAP IDoc & Sponsor)** — 01_sow_kundavtal_omnipos_gate_g2_pilotkrav, 09_bilaga_nyckelbutiker_och_systemkopplingar_nr_001_uppsala, 09_bilaga_nyckelbutiker_och_systemkopplingar_nr_002_vasteras, 03_styrgruppsprotokoll_2026_10_15_johan_nilsson_hotfix, 01_sow_kundavtal_omnipos_sap_s4hana, 01_sow_kundavtal_omnipos_anna_lindqvist_coo [EXTRACTED 1.00]

## Communities (6 total, 0 thin omitted)

### Community 0 - "Pilot, Adyen & SAP Go-Live"
Cohesion: 0.25
Nodes (9): Adyen Terminal API (Central Betalväxel), Anna Lindqvist (COO & Projektsponsor), OmniPOS v4.2 (RetailCore Kassaplattform), SAP S/4HANA ERP (Lager, Logistik & Z-rapport/IDoc), Adyen Hotfix v4.2.4 (Johan Nilsson, RetailCore), Styrgruppsprotokoll #3 (2026-10-15), Cutover CUT-10 & CUT-12 (T-0 kl. 07:30–08:45): Röktest & Go/No-Go, Cutover CUT-15 (T+1 kl. 09:00): SAP IDoc & Adyen Avstämning (+1 more)

### Community 1 - "Kampanjfrys Q4 & Ombokningsrisk"
Cohesion: 0.35
Nodes (6): Sofia Ekström (Marknadschef) – Mejl Beslutade Frysperioder, Centrallager Örebro Hårdvaruleverans (T-14d, 8 pallar/butik), Våg 3: Storstad & 8 Flagship (10 butiker, plan v.47–51), NR-025 Sergels Torg & NR-026 Nordstan (Flagship v.47: 17 & 19 nov), NR-027 Mall of Scandinavia & NR-028 Triangeln (Flagship v.48: 24 & 26 nov), NR-033 Helsingborg Väla & NR-034 Lund Nova (v.51: 15 & 17 dec)

### Community 2 - "Kundavtal SOW & Pilot Gate G2"
Cohesion: 0.48
Nodes (5): Kundavtal SOW OmniPOS (SOW-NR-2026-09), Nordic Retail AB (Beställare, 42 butiker), Top of Minds PMO (Projektledningspartner), NR-002 Västerås Erikslund (Pilot, Go-Live 2026-10-22 v.43), NR-003 Södertälje Centrum (Våg 1, Go-Live 2026-10-27 v.44)

### Community 3 - "Utrullningsvågor & Slutdatum"
Cohesion: 0.33
Nodes (6): LegacyCash 2014 (Äldre Kassasystem), Gammal PPT Executive Roadmap v1.0 (Utdaterat septemberutkast), Våg 1: Mälardalen (10 butiker, plan v.44–46), Våg 2: Väst & Syd (12 butiker, plan v.46–49), Våg 4: Norrland & Outlets (8 butiker, plan v.02–06 2027), NR-042 Östersund Lillänge (Sista butik Våg 4, Go-Live 2027-02-04 v.05)

### Community 4 - "Fältteams- & Jourkapacitet"
Cohesion: 0.52
Nodes (5): TeliaNet Leveransavtal SLA-TN-8841 (Henrik Sjöberg), Marcus Berg (IT- & Driftchef) – Driftintervju AP-303, Fältteam Nord/Öst (Karin Holm) – Max 2 butiker/vecka, Fältteam Väst/Syd (Patrik Ström) – Max 2 butiker/vecka, NR-009 Nacka Forum & NR-010 Kungens Kurva (v.46: 6 butiker & dubbelbokat team)

### Community 5 - "Nätverks-Cutover & VLAN"
Cohesion: 0.47
Nodes (6): Segregerat Betal-VLAN (VLAN-POS-40 & SD-WAN), Åtgärd AP-302: EJ GENOMFÖRD granskning av Excel 1 & 2, Cutover CUT-01 (T-21d): TeliaNet SD-WAN & Brandvägg mot Adyen, Cutover CUT-02 (T-15d vs gammal mallnotis '3 dagar före'), Cutover CUT-08 (T-0 kl. 05:30): Omkoppling VLAN-POS-40, Operativ Plan: Excel 1 (Veckoplan) & Excel 2 (Cutover Runbook)

## Ambiguous Edges - Review These
- `Slutdatum 2027-02-26 (v.08) & Vite 75 000 kr/vecka` → `Change Freeze Jul & Nyår v.51–v.01: 100 % Stopp alla butiker`  [AMBIGUOUS]
  01_SOW_Kundavtal_OmniPOS.md · relation: conceptually_related_to
- `Change Freeze Black Week v.47–48: Förbud Flagship (16–29 nov)` → `Våg 2: Väst & Syd (12 butiker, plan v.46–49)`  [AMBIGUOUS]
  04_Mejl_Marknadschef_Kampanjplan.md · relation: conceptually_related_to
- `Change Freeze Jul & Nyår v.51–v.01: 100 % Stopp alla butiker` → `Våg 4: Norrland & Outlets (8 butiker, plan v.02–06 2027)`  [AMBIGUOUS]
  04_Mejl_Marknadschef_Kampanjplan.md · relation: conceptually_related_to

## Knowledge Gaps
- **1 isolated node(s):** `Nordic Retail AB (Beställare, 42 butiker)`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Operativ Plan: Excel 1 (Veckoplan) & Excel 2 (Cutover Runbook)` connect `Nätverks-Cutover & VLAN` to `Pilot, Adyen & SAP Go-Live`, `Kampanjfrys Q4 & Ombokningsrisk`, `Kundavtal SOW & Pilot Gate G2`, `Utrullningsvågor & Slutdatum`, `Fältteams- & Jourkapacitet`?**
  _High betweenness centrality (0.336) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Gate G2: 14 dagars felfri Pilot före Våg 1 (SOW § 2.1)` (e.g. with `Flaskhals: Adyen-certifiering i Pilot NR-001 låser Våg 1–4` and `Våg 1: Mälardalen (10 butiker, plan v.44–46)`) actually correct?**
  _`Gate G2: 14 dagars felfri Pilot före Våg 1 (SOW § 2.1)` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Nordic Retail AB (Beställare, 42 butiker)` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Why does `Gate G2: 14 dagars felfri Pilot före Våg 1 (SOW § 2.1)` connect `Kundavtal SOW & Pilot Gate G2` to `Pilot, Adyen & SAP Go-Live`, `Utrullningsvågor & Slutdatum`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `TeliaNet Låst Bokningsfönster 15 arb.dgr / Avgift 35 000 kr` (e.g. with `Centrallager Örebro Hårdvaruleverans (T-14d, 8 pallar/butik)` and `Cutover CUT-02 (T-15d vs gammal mallnotis '3 dagar före')`) actually correct?**
  _`TeliaNet Låst Bokningsfönster 15 arb.dgr / Avgift 35 000 kr` has 5 INFERRED edges - model-reasoned connections that need verification._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Slutdatum 2027-02-26 (v.08) & Vite 75 000 kr/vecka` and `Change Freeze Jul & Nyår v.51–v.01: 100 % Stopp alla butiker`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Change Freeze Black Week v.47–48: Förbud Flagship (16–29 nov)` and `Våg 2: Väst & Syd (12 butiker, plan v.46–49)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._