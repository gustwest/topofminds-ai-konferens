# Bilaga till Projektplan: Nyckelbutiker och Cutover-kopplingar (Utdrag ur Excel 1 & 2)

*Automatiskt utdrag ur `07_Excel1_Butiksutrullning_Veckor.csv` och `08_Excel2_Cutover_Runbook_Timmar.csv` för system- och beroendekartläggning.*

## 1. Utvalda Nyckelbutiker och Planerade Go-Live-datum

* **`NR-001 Nordic Retail Uppsala City`** (Format: `City`, Våg: `Pilot`, Go-Live: `2026-10-21` i `v.43`, Team: `Team Nord/Öst`) – Referensbutik för kedjans centrala **Adyen Terminal API**-profil och **SAP S/4HANA IDoc**-avstämning.
* **`NR-002 Nordic Retail Västerås Erikslund`** (Format: `Handelspark`, Våg: `Pilot`, Go-Live: `2026-10-22` i `v.43`, Team: `Team Nord/Öst`) – Verifierar Click & Collect-flödet inför Gate G2.
* **`NR-003 Nordic Retail Södertälje Centrum`** (Format: `City`, Våg: `Våg 1`, Go-Live: `2026-10-27` i `v.44`, Team: `Team Nord/Öst`) – Första butik i Våg 1.
* **`NR-009 Nacka Forum` & `NR-010 Kungens Kurva`** (Våg: `Våg 1`, Go-Live: `2026-11-10` i `v.46`) – Båda tilldelade `Team Nord/Öst` samma morgon, under en vecka (`v.46`) med totalt 6 planerade butiker.
* **`NR-025 Stockholm Sergels Torg` & `NR-026 Göteborg Nordstan`** (Format: `Flagship`, Våg: `Våg 3`, Go-Live: `2026-11-17` respektive `2026-11-19` i `v.47`).
* **`NR-027 Mall of Scandinavia` & `NR-028 Malmö Triangeln`** (Format: `Flagship`, Våg: `Våg 3`, Go-Live: `2026-11-24` respektive `2026-11-26` i `v.48`).
* **`NR-033 Helsingborg Väla` (Flagship) & `NR-034 Lund Nova` (City)** (Våg: `Våg 3`, Go-Live: `2026-12-15` respektive `2026-12-17` i `v.51`).
* **`NR-042 Östersund Lillänge`** (Format: `Outlet`, Våg: `Våg 4`, Go-Live: `2027-02-04` i `v.05`) – Sista butik i utrullningsplanen före avveckling av *LegacyCash 2014*.

## 2. Kritiska Cutover-steg per Butik (Relativ tid mot Go-Live `T-0`)

* **`CUT-01 (T-21 dagar)`:** TeliaNet fjärrkonfigurerar SD-WAN och brandvägg mot Adyen Cloud.
* **`CUT-02 (T-15 dagar)`:** PMO slutbekräftar nattjour hos TeliaNet för VLAN-omkoppling (notering i gammal mall: *"3 dagar före"*, se dock avtal `SLA-TN-8841`).
* **`CUT-03 (T-14 dagar)`:** Centrallagret i Örebro levererar kassahårdvara via SAP Logistik.
* **`CUT-04 (T-7 dagar)`:** Butikschef kvitterar minst 80 % genomförd personalutbildning i *OmniPOS Academy*.
* **`CUT-08 (T-0 kl. 05:30)`:** TeliaNet Nattjour kopplar om kassaportar till `VLAN-POS-40` (bryter *LegacyCash 2014*).
* **`CUT-10 (T-0 kl. 07:30)`:** Fältteamet parar Adyen-kortterminaler och kör skarpt röktest (Kort, Swish, Presentkort samt WAN-avbrott).
* **`CUT-12 (T-0 kl. 08:45)`:** Formellt Go/No-Go mellan PMO och Butikschef (senast kl. 09:15 krävs besked till TeliaNet vid Rollback).
* **`CUT-15 (T+1 kl. 09:00)`:** Ekonomi och Central IT stämmer av första skarpa nattkörningen (`SAP S/4HANA IDoc` mot Adyen settlement).
