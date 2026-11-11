# Anteckningar från Arbetspass med Driftchef & Fält-IT

**Datum:** 2026-10-20  
**Deltagare:** Marcus Berg (IT- & Driftchef), Karin Holm (Teamledare Fältutrullning), PMO  
**Syfte:** Kartlägga praktiska begränsningar för utrullningsvågorna och Go-Live-nätterna (AP-303).

---

## 1. Fältteamens faktiska kapacitet (Hård gräns!)
Vi har totalt **två (2) certifierade utrullningsteam** som reser runt till butikerna för fysisk installation, omkoppling och Go-Live-stöd på morgonen:
* **Team Nord/Öst** (baserat i Stockholm, leds av Karin Holm)
* **Team Väst/Syd** (baserat i Göteborg, leds av Patrik Ström)

### Kapacitetsregel per vecka:
* Eftersom varje Go-Live kräver kvällsförberedelse (`T-1`), natt-/morgonpass (`T-0 kl. 05:30–12:00`) samt restid och Hypercare dagen efter (`T+1`), klarar **varje team max 2 butiker per vecka** (vanligtvis tisdag + torsdag).
* **Det totala taket för hela projektet är därmed MAX 4 BUTIKER PER KALENDERVECKA.**
* *Karins kommentar:* "Jag såg ett gammalt utkast av Excel-planen där någon hade klämt in 6 butiker samma vecka i november. Det går fysiskt inte – vi har varken extra kassatekniker eller reservhårdvara i bilarna för fler än 4 butiker i veckan!"

---

## 2. Kritiska tekniska beroenden ("Single Points of Failure")
1. **Adyen Betalväxel-certifiering (från Pilot `NR-001 Uppsala City`):**
   * Adyen-profilen för hela Nordic Retail låses och signeras på kedjenivå utifrån utfallet i pilotbutiken i Uppsala (`NR-001`). Om piloten i Uppsala stöter på problem i dagsavslutet (`SAP IDoc WPUBON`) eller offline-kortbetalning måste Våg 1 hållas tillbaka tills patchen är verifierad.
2. **Hårdvaruleverans (`T-14d`):**
   * Kassaskärmar, kvittoskrivare och streckkodsläsare skeppas från centrallagret i Örebro exakt `14 dagar` före butikens Go-Live-datum. Om en butik flyttas framåt i tiden måste även logistikordern i SAP uppdateras så att inte 8 pallar kassahårdvara står och blockerar butikens trånga baklager i en månad.
3. **Butikschefens E-learning & Övningskassa (`T-7d`):**
   * Minst 80 % av butikens kassapersonal måste ha genomfört 45 minuters övningspass i träningsläget senast 7 dagar före Go-Live.

---

## 3. Observation om Tim-körschemat (`08_Excel2_Cutover_Runbook_Timmar.csv`)
Marcus flaggade för att mallen som kopierades från ett gammalt projekt 2023 kan innehålla utdaterade antaganden om nätverksleverantörens ledtider. **Måste kontrolleras mot vårt nya TeliaNet-avtal (`SLA-TN-8841`)!**
