# Styrgruppsprotokoll #3 – Projekt OmniPOS

**Datum:** 2026-10-15  
**Närvarande:**
* Anna Lindqvist – COO & Projektsponsor, Nordic Retail AB (Ordförande)
* Marcus Berg – IT- & Driftchef, Nordic Retail AB
* Sofia Ekström – Marknads- & Försäljningschef, Nordic Retail AB
* Johan Nilsson – Leveransansvarig, RetailCore Nordic AB (OmniPOS)
* Konsult PMO – Projektledare (Top of Minds)

---

## § 1. Lägesrapport inför Pilotstart (Vecka 43)
Projektledaren visade den övergripande PowerPoint-tidslinjen för hösten och vintern:
* **Pilot (2 butiker):** Vecka 43 (`NR-001 Uppsala City` 2026-10-21 och `NR-002 Västerås Erikslund` 2026-10-22).
* **Våg 1 – Mälardalen (10 butiker):** Planerad start vecka 44–46.
* **Våg 2 – Väst & Syd (12 butiker):** Planerad vecka 46–49.
* **Våg 3 – Storstad & Flagship (10 butiker):** Planerad vecka 47–51.
* **Våg 4 – Norr & Outlet (8 butiker):** Planerad vecka 02–06 (jan–feb 2027).

Anna Lindqvist betonade att styrelsen följer projektet noga men att **driftsäkerhet i kassan aldrig får äventyras för att jaga datum** – SOW:ns krav på godkänd pilot (§ 2.1) ligger fast utan undantag.

---

## § 2. Status Adyen Betalväxel & SAP-koppling
Johan Nilsson (RetailCore) rapporterade att grundkassan fungerar väl i testmiljö, men att **Adyen Terminal API v4.2.3 (offline-fallback vid internetavbrott samt presentkortskombinationer)** har visat intermittenta låsningar under stresstest.
* En hotfix (`v4.2.4`) levereras precis i tid till Pilotstart i Uppsala (`NR-001`), men har ännu inte verifierats mot riktig Swish- och presentkortstrafik i butik.
* Marcus Berg påpekade att **Adyen-certifieringen i pilotbutiken i Uppsala är en absolut flaskhals**: ingen utrullningsbutik i Våg 1–4 kan driftsättas med gammal firmware.

---

## § 3. Marknads- och Kampanjkalender under Q4
Sofia Ekström flaggade för att marknadsavdelningen slutför årets kampanjplan för **Black Week** och **Julhandeln** och återkommer via mejl med exakta frysdatum under veckan. Hon underströk att en stängd eller krånglande kassa i en Flagship-butik under Black Friday kostar bolaget uppemot **450 000 SEK i timmen** i tappad försäljning.

---

## § 4. Beslut och Åtgärdspunkter
1. **AP-301 (Sofia Ekström):** Skicka skriftliga regler för kampanj- och utrullningsfrys under nov–dec till PMO senast 18 oktober.
2. **AP-302 (PMO):** Stäm av den detaljerade Excel-planen (`07_Excel1_Butiksutrullning_Veckor.csv`) och tim-körschemat (`08_Excel2_Cutover_Runbook_Timmar.csv`) mot leverantörsavtal, fältteamskapacitet och marknadsfrysen före nästa styrgrupp! *(Status 2026-11-04: EJ GENOMFÖRD ÄNNU)*
3. **AP-303 (Marcus Berg & PMO):** Dokumentera fältteamens faktiska maxkapacitet per vecka.
