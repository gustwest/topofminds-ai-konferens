---
name: atlas-coach
description: Interaktiv svensk start- och uppdateringscoach för Min-Atlas. Aktivera direkt när användaren skriver "Starta min Atlas", vill komma igång med sin kunskapsgraf, eller vill lägga till nya projekt, beslut, kontakter och bygga om sin visuella kunskapsgraf (graph.html).
---

# Atlas-Coach (Personlig & Professionell Kunskapsgraf)

Denna skill hjälper användaren att på 3–5 minuter bygga upp och underhålla sin personliga & professionella **Livs- och Konsult-Atlas** samt generera en interaktiv visuell **Kunskapsgraf (`graphify-out/graph.html`)**.

## Flöde när användaren skriver "Starta min Atlas" (Onboarding)

1. **Hälsa kort och varmt välkommen** (max 3 meningar) och ställ dessa **4 korta frågor på en gång** så användaren kan svara fritt i ett enda meddelande:
   - **1. Du & ditt bolag:** Vad heter du, vad är din roll på Top of Minds, och driver du eget konsult-AB (t.ex. något viktigt som revisor/månadsrutin du vill ha i minnet)?
   - **2. Pågående uppdrag / fokus på jobbet:** Vilka 1–2 uppdrag eller fokusområden jobbar du med nu? *(Beskriv kort utan hemlig kunddata, t.ex. ”Systemutrullning inom försäkring” eller ”Konsultchef & avropsmatchning”).*
   - **3. Privatliv & egna projekt:** Nämn 1–2 privata projekt eller hållpunkter som snurrar i huvudet (t.ex. renovering, BRF-styrelse, familjeresa, försäkrings-/avtalsdatum eller träning).
   - **4. Din värsta tidstjuv:** Vilket återkommande arbetsmoment äter mest onödig tid en vanlig vecka (t.ex. styrgruppsrapport, granska spretiga krav/tidplaner, förbereda tuffa möten eller matcha CV mot kundavrop)?

2. **Vänta på användarens svar!** Gissa aldrig innan användaren svarat.

3. **När användaren har svarat – utför alla 4 steg automatiskt:**
   - **Steg A (Fyll Atlas-filerna med korslänkar):**
     Uppdatera och skapa tydliga, luftiga Markdown-filer i:
     - `01-privat/oversikt.md`
     - `02-bolag-och-topofminds/mitt-bolag-och-profil.md`
     - `03-uppdrag/aktivt-uppdrag.md` (eller en fil per nämnt uppdrag)
     - `04-personer-och-natverk/kontakter.md` (inkludera användaren själv, nämnda kollegor/roller som Top of Minds, ev. revisor/samarbetspartners)
     *Viktigt:* Använd Markdown-länkar mellan filerna (t.ex. `[Top of Minds](../02-bolag-och-topofminds/mitt-bolag-och-profil.md)`) och nämn samma begrepp/personnamn konsekvent så kunskapsgrafen får rika kopplingar!
   - **Steg B (Skapa en skräddarsydd Skill för användarens #1 tidstjuv):**
     Skapa en ny skill i `.agents/skills/min-måndagshjälpare/SKILL.md` med ett skarpt **5-punkts uppdragskontrakt** (*1. Mandat & kritisk hållning, 2. Sanningshierarki, 3. Verktyg, 4. Hårda stoppregler, 5. Exakt leveransformat*) skräddarsytt för det användaren svarade på fråga 4.
   - **Steg C (Bygg den interaktiva Kunskapsgrafen!):**
     Kör det medföljande noll-beroende skriptet:
     ```bash
     python3 .agents/skills/atlas-coach/scripts/build_atlas_graph.py
     ```
     *(Det skapar omedelbart `graphify-out/graph.html`, `graphify-out/graph.json` och `graphify-out/GRAPH_REPORT.md` helt utan externa installationer).*
   - **Steg D (Öppna grafen visuellt för användaren!):**
     Öppna `graphify-out/graph.html` (antingen via `open graphify-out/graph.html` på Mac / `start graphify-out/graph.html` på Windows eller i den inbyggda webbläsaren) och ge användaren:
     1. Klickbara länkar till deras nya filer + deras nya skräddarsydda Skill.
     2. Ett konkret förslag på en första klurig tvärfråga de kan testa direkt mot sin nya Atlas!
