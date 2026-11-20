---
name: skapa-egen-skill
description: Interaktiv svensk ”Skill-fabrik” som hjälper användaren att bygga nya återanvändbara Agent Skills (.agents/skills/<namn>/SKILL.md) utifrån deras egna arbetsmoment, mallar eller rutiner. Aktivera direkt när användaren skriver "Bygg en ny Skill", "Skapa en Skill", "Gör en Skill för..." eller vill paketera ett arbetssätt.
---

# Skill-Fabriken – Bygg dina egna återanvändbara Agent Skills

Denna skill förvandlar vilket återkommande arbetsmoment som helst (t.ex. veckovis styrgruppspuls, kundavrop/CV-anpassning, avtals- & SLA-granskning, kravextraktion från möten eller privat ekonomi-/årsavstämning) till en skarp, återanvändbar `SKILL.md` som fungerar i både **Google Antigravity**, **Claude (Cowork/Code)**, **VS Code** och **Cursor**.

## Arbetsflöde steg för steg

### Steg 1: Ställ 3 snabba fokusfrågor (om användaren inte redan angett allt)
Håll det kort och konkret på vanlig svenska:
1. **Vilket moment ska Skillen lösa?** *(T.ex. ”Skriva fredagens statusrapport till styrgruppen”, ”Matcha mitt CV mot ett kundavrop” eller ”Granska en tidplan mot avtal”).*
2. **Vilket underlag ska den utgå från?** *(T.ex. filer i `03-uppdrag/`, mötesanteckningar, Excel/CSV eller inklistrad text).*
3. **Vad är ett ”perfekt resultat” och vad får den absolut INTE göra?** *(T.ex. max 1 sida med Röd/Gul/Grön status, gissa aldrig datum, räkna alltid med skript).*

Vänta in svaret innan du bygger filen!

### Steg 2: Skapa en produktionsklar `SKILL.md` med 5-punkts uppdragskontrakt
Skapa `.agents/skills/<kebab-case-namn>/SKILL.md` med:
1. **Tydlig YAML-frontmatter (`name` + `description`):** Beskriv exakt *när* agenten ska plocka fram denna Skill automatiskt.
2. **5-punkts uppdragskontrakt (istället för luddigt rollspel):**
   - **1. Mandat & kritisk hållning:** Vilka specialistglasögon har rollen, och hur ska den utmana otydligheter?
   - **2. Sanningshierarki (Källor):** Vilka filer i `Min-Atlas` eller uppladdade dokument trumfar vad vid konflikt?
   - **3. Verktyg & beräkning:** Kräv Python-skript vid siffer-/datumräkning och läsning i Kunskapsgrafen vid beroendefrågor.
   - **4. Hårda stoppregler:** Vad får den *aldrig* gissa, sluta sig till eller skicka iväg utan godkännande (`SAKNAS I UNDERLAG`)?
   - **5. Leveranskontrakt (Definition of Done):** Exakt rubrikstruktur, tabellformat och längd på leveransen + en kort självkontrolllista som agenten ska bocka av innan den svarar.
3. **(Valfritt men starkt):** Om momentet vinner på en fast mall eller ett litet kontrollskript, skapa även `templates/mall.md` eller `scripts/` inne i Skill-mappen!

### Steg 3: Uppdatera Kunskapsgrafen & låt användaren provköra direkt
1. Kör grafbyggaren så att den nya Skillen syns som en nod i användarens Kunskapsgraf:
   ```bash
   python3 .agents/skills/atlas-coach/scripts/build_atlas_graph.py
   ```
2. Visa en klickbar länk till den nya `SKILL.md`-filen och ge användaren **en kopieringsklar testmening** för att provköra sin nya Skill direkt!
