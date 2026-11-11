---
name: krav-konsoliderare
description: >-
  Konsoliderar inspelade ljudfiler, röstmemon eller mötestranskriberingar från projektledarnas
  krav- och prioriteringsmöte till en skarp, beslutsklar kravspecifikation (SPEC_DELTA.md) för
  Store Operations & Rollout Studio v0.2. Använd alltid denna skill INNAN du börjar koda efter en inspelning!
---

# Kravkonsoliderare – Från Inspelat Diskussion till Styrgruppsbeslut (`SPEC_DELTA.md`)

Denna skill omvandlar ett muntligt resonemang mellan projektledare och chefer till en kristallklar, exekverbar specifikation utan att börja skriva kod i blindo.

## Steg-för-steg

1. **Läs in både möteskontexten och befintlig arkitektur:**
   * Lyssna på / läs det bifogade ljudklippet eller transkriptet noga.
   * Läs `AGENTS.md`, `src/types/rollout.ts` och `src/data/rolloutData.ts` för att se vad som redan finns i **v0.1** (Master Plan `SO-*`, `Hypotes A/B`, 70-butikersvåg i `Våg 1`, de `23 aktiviteterna i 4 faser` och `GOVERNANCE_POLICY`).
2. **Separera kärnbehov från spretiga idéer (Kritisk arkitektblick):**
   * Identifiera de viktigaste funktionerna som löser projektledarens verkliga smärta:
     1. **Interaktiv Kaskad-omplanering & What-If för Styrgruppen:** Flytta Pilot eller en hel våg (eller enskild butik) och se direkt konsekvensen på överlappande vågor (`Pre-care / Cut-over / Hypercare`), luft mellan vågor och frysperioder.
     2. **Automatisk Regel- & Kalendervakt:** Flagga/rätta till Måndag/Fredag-brott (*No rollout on Mondays or Fridays!*), kampanj-/julfrys och saknad regional *Train-the-Trainer*-pilot.
     3. **Avvikelsestyrning för 70-butikersvågor (*Management by Exception*):** Masskvittera en hel fas/aktivitet för alla gröna butiker i en våg/ett land (slipp 1 610 klick!) samt **1-klicks Rollback / "Bryt ut butik till Catch-up (Våg 4)"** så att 1 strulande butik inte stoppar övriga 69!
   * Om någon i inspelningen föreslog sådant som inte hör hemma i en 5-minuters v0.2-sprint (t.ex. företags-SSO/BankID eller live-koppling mot kundens skarpa ERP/GL2), lägg det snyggt under **Avgränsat till Backlog (v0.3)** med tydlig motivering!
3. **Skapa filen `SPEC_DELTA.md` i projektroten (`3-live-rollout-app/SPEC_DELTA.md`) med exakt dessa avsnitt:**
   * **1. Fångad Problembild ur Samtalet:** 3–4 skarpa punkter som sammanfattar vad gruppen prioriterade.
   * **2. Must-Have i v0.2 (Byggs nu under fikapausen):** Konkreta, numrerade funktioner i Lager 1, Lager 2 och Lager 3 + `localStorage`-persistens och CSV/Excel-export för styrgruppen.
   * **3. Hanterade Målkonflikter & Avgränsningar (Backlog v0.3):** Vad vi medvetet inte bygger nu och varför.
   * **4. Påverkade Filer i Kodbasen:** Exakt vilka TypeScript/React-filer som ska skapas/uppdateras.
4. **Stanna och be om Styrgruppens "Go!" i rummet:**
   * Skriv **ingen** applikationskod ännu! Presentera en kort sammanfattning av `SPEC_DELTA.md` i chatten och fråga: *"Styrgruppen – godkänner ni SPEC_DELTA.md så att vi kan bygga v0.2?"*
