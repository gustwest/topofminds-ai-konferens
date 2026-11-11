---
name: bygg-v02-fran-spec
description: >-
  Implementerar Store Operations & Rollout Studio v0.2 utifrån en godkänd SPEC_DELTA.md, uppdaterar alla
  berörda zoom-lager med kaskad-omplanering, Mån/Fre-kalendervakt, 70-butikers Batch-Readiness och 1-klicks
  Rollback till Catch-up, samt verifierar med tsc och vite build. Använd när styrgruppen har godkänt SPEC_DELTA.md!
---

# Bygg v0.2 från Godkänd Specifikation

När styrgruppen i konferensrummet har godkänt `SPEC_DELTA.md` bygger du **v0.2** snabbt, kirurgiskt och med 100 % typ- och byggsäkerhet så att demon sitter på första försöket direkt efter fikapausen.

## Genomförande

1. **Läs `SPEC_DELTA.md` samt `src/types/rollout.ts`, `src/data/rolloutData.ts`, `src/utils/dateUtils.ts` och `src/App.tsx`.**
2. **Skapa en ren regel- och konsekvensmotor (t.ex. `src/utils/conflictEngine.ts`):**
   * Validera aktuell plan mot `GOVERNANCE_POLICY`:
     * **Måndag/Fredag-spärr (`isRestrictedRolloutWeekday`):** Flagga alla butiker vars `goLiveDate` ligger på måndag, fredag eller helg.
     * **Frysperioder (`freezeWindows`):** Flagga butiker som skjuts in i Höstkampanjfrysen (`2027-10-25..2027-11-07` för `Large store` & `Feeder store`) eller Totalfrysen (`fr.o.m. 2027-11-08`).
     * **Train-the-Trainer & Våg-luft:** Kontrollera att regionala pilotbutiker (`isPilotTrainer`) är klara före `Våg 1` i samma land och räkna ut hur många butiker som befinner sig i `Pre-care + Cut-over + Hypercare` samtidigt per vecka.
     * **Ekonomisk effekt & Styrgrupps-Diff:** Räkna antal flyttade butiker jämfört med `baselineGoLiveDate`, utbrutna Catch-up-butiker samt beräknat förseningsvite efter `2027-10-22` (`95 000 SEK/vecka`).
3. **Uppdatera UI:t enligt `SPEC_DELTA.md`:**
   * Uppdatera versionsbadgen i headern från `v0.1 Baslinje` till `v0.2 Interaktiv Omplanering & 70-butikersstyrning`, spara state i `localStorage`, och lägg in en **"Återställ Baslinje (v0.1)"**-knapp i headern.
   * **Kaskad-omplanering & Snabbscenarier:** Gör det busenkelt att skjuta en hel våg (`±1 vecka`, `+3 veckor UAT-försening`) eller ett enskilt butiksdatum, plus en **"Smart Auto-planera (Tis–Tors & Undvik Frys)"**-knapp som automatiskt lägger Mån/Fre-butiker på giltiga tisdag–torsdag-datum!
   * **70-butikers Batch-Readiness & 1-klicks Rollback / Catch-up (Lager 2 & 3):**
     * Lägg till **Masskvittering per fas/våg** (t.ex. *"Kvittera Pre-care för alla gröna butiker i Våg 1"*).
     * Lägg till en tydlig **"Bryt ut till Catch-up (Våg 4)"**-knapp på butiker med avvikelse (t.ex. `W1-029` med restnoterade terminaler eller `W1-058` i Finland) så att övriga 68–69 butiker i vågen blir 100 % gröna och redo för Cut-over!
4. **Hård kvalitetsgrind (OBLIGATORISK):**
   * Kör `npm run typecheck` och `npm run build`.
   * Fixa eventuella TypeScript-varningar eller oanvända imports tills båda kommandona passerar med exitkod `0`.
5. **Presentera en kort "Release Note för Styrgruppen":**
   * Lista vad som nu är live i v0.2 och ge presentatören 3 konkreta klick-steg att demonstrera på storskärmen!
