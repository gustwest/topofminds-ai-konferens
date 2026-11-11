---
name: styrgrupps-puls
description: >-
  Skapar ett exekutivt beslutsunderlag och lägesrapport (Styrgruppspuls) för Projekt OmniPOS.
  Använd denna skill när användaren ber om en styrgruppsrapport, statusuppdatering,
  beslutsunderlag för COO/sponsor eller sammanställning av projektets hälsoläge.
---

# Styrgruppspuls – Metodhandbok (Top of Minds Drive)

Denna skill paketerar vår standardmetodik för exekutiv rapportering till styrgrupp i komplexa utrullningsprojekt.

## Arbetsflöde (Utför i ordning)

1. **Samla in nuläget ur hela kontexten:**
   * Läs avtalsramarna i `projektfiler/01_SOW_Kundavtal_OmniPOS.md` och `projektfiler/02_Leverantorsavtal_TeliaNet.md`.
   * Läs senaste styrgruppsprotokollet (`03`), marknadschefens frysbeslut (`04`) och driftchefens kapacitetsnoteringar (`05`).
   * Kontrollera om det finns öppna eskaleringsärenden via MCP-verktyget `list_pmo_tickets` (om MCP-servern `nordic_retail_pmo` är aktiv).
2. **Korsgranska tidplanen:**
   * Jämför påståendena i den gamla PPT-planen (`06`) och butikslistan (`07_Excel1_Butiksutrullning_Veckor.csv`) mot de faktiska reglerna i dokument `01`–`05`.
3. **Leverera rapporten enligt exakt denna struktur:**

### Mall för utdata

1. **Exekutiv Sammanfattning (Max 4 meningar + Total RAG-status `🟢/🟡/🔴`)**
   * Säg rakt ut om nuvarande plan håller eller om vi har kritiska regelbrott som kräver omedelbart styrgruppsbeslut.
2. **Status per Dimension (Tabell)**
   * Kolumner: `Område` (*Tidplan & Vågor*, *Teknik & Pilot Gate G2*, *Resurs & Fältteam*, *Leverantör & Budget/Viten*), `Status (🟢/🟡/🔴)`, `Nuläge & Källa`.
3. **Topp 3 Kritiska Avvikelser & Finansiell Exponering**
   * Lista exakta `ButiksID`, veckor och kr-belopp i riskzonen (t.ex. ombokningsavgifter eller viten).
4. **Två tydliga Beslutsalternativ för Styrgruppen (Alternativ A vs. Alternativ B)**
   * Formulera två skarpa vägval med för- och nackdelar samt en tydlig PMO-rekommendation.
