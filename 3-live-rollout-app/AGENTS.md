# Arkitektur- & Kodstyrning – Store Operations & Rollout Studio (Live-Case Top of Minds)

Detta är den sammanhållna 3-lagersapplikationen för **Nordic Home & Retail (SE / NO / FI) – utrullning av nytt butikssystem (`RetailCore POS`)**. Applikationen är i förarbete levererad som **v0.1 Baslinje (Från Excel & PPT)** utifrån kollegans tre verkliga mallar (`Master Plan`, `Tidplan Hypotes A/B` samt `Utkast utrullningsplan`), och byggs under konferensen vidare till **v0.2** utifrån projektledarnas inspelade kravmöte.

## 1. Domänmodell & Single Source of Truth (`src/types/rollout.ts` & `src/data/rolloutData.ts`)
* **Lager 1 – Master Plan (`SO-BP-001`..`SO-ROLL-003`) & Styrgruppshypoteser (`HYP_A` vs `HYP_B`):**
  * `MASTER_PLAN_DELIVERABLES`, `ACTIVITY_PLAN_ITEMS` och `RAID_LOG_ITEMS` speglar Excel-kedjan *Skogen → Grenarna → RAID*.
  * `ROLLOUT_HYPOTHESES` innehåller `HYP_A` (5 pilotbutiker + 6 vågor à 60 butiker) och `HYP_B` (37 pilotbutiker + Catch-up `v.34` + 3 megavågor à 70–80 butiker). Varje våg har 3 överlappande veckor: `1v Pre-care`, `1v Cut-over`, `1v Hyper-care` (*0 veckors luft mellan vågorna!*).
* **Lager 2 – Vågor, Länder (`SE / NO / FI`) & 70-butikersplan (`INITIAL_STORES`):**
  * Varje butik (`StoreRollout`) har ett aktuellt `goLiveDate` (`YYYY-MM-DD`), sitt ursprungliga `baselineGoLiveDate`, `country` (`SE (Land A) | NO (Land B) | FI (Land C)`) samt `format` (`Easy store | Large store | Feeder store`).
  * `Våg 1` innehåller en full skala om **70 butiker** (`W1-001`..`W1-070`) inklusive 5 planterade avvikelser/regelbrott för att demonstrera *Management by Exception*.
* **Lager 3 – De 23 aktiviteterna i 4 faser (`CUTOVER_TEMPLATE_STEPS`):**
  * Alla 23 steg (`1. Innan Go-Live (Pre-care)` 8 steg, `2. Cut-over (Go-Live)` 6 steg, `3. Hypercare` 5 steg, `4. Exit (Överlämning till linjen)` 4 steg) beräknas **dynamiskt** via `addDaysIso(store.goLiveDate, offset)` med UTC-säker matematik i `src/utils/dateUtils.ts`. Ändra aldrig till manuella hårdkodade datumsträngar!
* **Förberedda styrningsregler (`GOVERNANCE_POLICY`):**
  * **Ingen utrullning på Måndagar eller Fredagar (`disallowMondaysAndFridays: true`):** Kontrolleras via `isRestrictedRolloutWeekday(isoDate)` i `src/utils/dateUtils.ts`. Endast tisdag, onsdag och torsdag är tillåtna Go-Live-dagar!
  * **Regional Train-the-Trainer:** Pilotbutiker med `isPilotTrainer: true` måste vara klara i respektive land/region minst 14 dagar före `Våg 1`.
  * **Frysperioder (`freezeWindows`):** Höstkampanj (`2027-10-25..2027-11-07`, spärr för `Large store` & `Feeder store`) och Black Month/Julhandel (`2027-11-08..2027-12-31`, 100 % Change Freeze för alla butikstyper).
  * **Ekonomiska effekter:** Sen ombokning `< 14 dagar` kostar `25 000 SEK/butik`; försening efter `2027-10-22` kostar `95 000 SEK/vecka`.

## 2. Tekniska krav vid Live-utbyggnad (v0.2)
* Stack: **React 19 + TypeScript (strict) + Tailwind CSS v4 + `lucide-react`**. Installera inga externa tunga paket.
* Spara gärna användarens interaktiva ändringar i `localStorage` (med en tydlig **"Återställ Baslinje (v0.1)"**-knapp i headern) så att sidan minns omplaneringar även när den visas på GitHub Pages!
* Behåll semantisk `<table>` med `role="region"` i Lager 2 och native `<dialog>` med `showModal()` i `CutoverQuickDialog.tsx`.
* **Obligatorisk verifiering före klarrapport:** Kör alltid `npm run typecheck` och `npm run build` med 0 fel!
