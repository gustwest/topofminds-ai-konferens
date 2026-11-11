---
name: go-live-readiness
description: >-
  Genomför en strikt Go-Live- och utrullningsrevision (Readiness Audit) av butiksplanen och
  tim-körschemat mot SOW, leverantörsavtal, frysperioder och fältteamskapacitet. Använd när
  användaren vill granska tidplanen, hitta krockar i Excel-filerna eller säkra Go-Live.
---

# Go-Live Readiness & Tidplansrevision

Använd denna skill för att systematiskt revidera `07_Excel1_Butiksutrullning_Veckor.csv` och `08_Excel2_Cutover_Runbook_Timmar.csv` mot projektets styrande regler.

## Revisionschecklista (Kontrollera samtliga 5 punkter!)

1. **Kontroll 1 – Pilot Gate G2 (14-dagarsregeln i SOW § 2.1):**
   * Räkna antalet kalenderdagar mellan sista pilotbutikens Go-Live (`NR-002`) och första butiken i Våg 1 (`NR-003`). Är det färre än 14 dagar är det ett direkt avtalsbrott.
2. **Kontroll 2 – Frysperioder (Black Week & Julhandel i dokument `04`):**
   * Lista alla `Flagship`-butiker som har Go-Live under `2026-v47` eller `2026-v48`.
   * Lista *alla* butiker (oavsett format) som har Go-Live under `2026-v51`, `2026-v52` eller `2027-v01`.
3. **Kontroll 3 – Fältteamens veckokapacitet & dubbelbokningar (dokument `05`):**
   * Summera antal butiker per vecka i `07_Excel1_Butiksutrullning_Veckor.csv`. Flagga alla veckor med `> 4` butiker totalt eller `> 2` butiker på samma team, samt om samma fältteam är bokat på två butiker *samma datum*!
4. **Kontroll 4 – TeliaNet 15 arbetsdagars ombokningsfönster (`02_Leverantorsavtal_TeliaNet.md`):**
   * Jämför dagens datum mot de butiker som måste flyttas p.g.a. Kontroll 1–3. Beräkna hur många butiker som ligger inom 21 kalenderdagar (15 arbetsdagar) och multiplicera med straffavgiften `35 000 SEK`.
   * Kontrollera även om någon rad i `08_Excel2_Cutover_Runbook_Timmar.csv` innehåller felaktiga ombokningsregler!
5. **Åtgärd i PMO-systemet (MCP):**
   * Om MCP-verktyget `create_escalation_ticket` finns tillgängligt: fråga användaren (eller utför direkt om användaren bad om det) om du ska registrera de funna avvikelserna som skarpa eskaleringar i PMO-systemet.
