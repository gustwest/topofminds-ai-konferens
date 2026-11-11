# Konferenspaket: AI-Agenter i Praktiken – Top of Minds Drive

Välkommen till ditt kompletta konferens- och demopaket! Allt i detta repo är byggt för en grupp på **~10 projektledare och chefer med olåsta datorer** under **4,5 timmar**, sammanhållet av en röd tråd baserad på er kollegas verkliga utrullningsutmaning: **Från Excel Master Plan & PowerPoint-hypoteser till 70-butikersvågor och 23 checkpunkter i 4 faser**.

---

## Så hämtar deltagarna projektet via Git (Noll inloggningsstrul!)

Alla deltagare kan klona repot direkt in i **Google Antigravity 2.0** (eller via terminalen) utan lösenord/SSH-nycklar:

```bash
git clone https://github.com/gustwest/topofminds-ai-konferens.git
```
*(Om någon deltagares dator saknar `git` klickar de bara på **Code -> Download ZIP** på samma GitHub-sida!)*

**Gratis Online-demo (0 kr/mån via GitHub Pages):**  
👉 **Live-adress:** [https://gustwest.github.io/topofminds-ai-konferens/](https://gustwest.github.io/topofminds-ai-konferens/)  
Varje `git push` till `main` bygger automatiskt `3-live-rollout-app` via `.github/workflows/deploy.yml` och publicerar senaste versionen (inklusive **v0.2** direkt efter fikapausen!) på GitHub Pages.

> **NDA-skydd:** Mappen `underlag-fran-connie/` är hårt exkluderad i `.gitignore` och lämnar aldrig din lokala dator. All data i repot är 100 % anonymiserad (*Nordic Home & Retail – SE / NO / FI*).

---

## Mappstruktur & Vad som är vad

```text
topofminds-ai-konferens/
├── .gitignore                                # Låser ute underlag-fran-connie/ (NDA-spärr)
├── .github/workflows/deploy.yml              # Gratis auto-deploy av Rollout Studio till GitHub Pages (0 kr/mån)
├── README.md                                 # Denna moderator- & körguide
├── 1-pre-flight-guide/
│   └── FORBEREDELSE_INFOR_KONFERENSEN.md     # Mejlmall/Teams-post att skicka ut 3 dagar innan (10 min förberedelse)
├── 2-deltagarpaket-pm/                       # Deltagarnas övningsmapp under Pass 1 & Pass 2!
│   ├── OVNINGSGUIDE_DELTAGARE.md             # Steg-för-steg-labbguide
│   ├── AGENTS.md                             # Projektregler som styr agentens roll, källkritik och format
│   ├── .agents/
│   │   ├── skills/                           # 2 färdiga PM-Skills (styrgrupps-puls & go-live-readiness)
│   │   └── plugins/nordic-retail-pmo/        # Lokal, 100 % nyckelfri Ärende- & Portfölj-MCP
│   ├── projektfiler/                         # Avtal, protokoll, Master Plan & CSV-planer med dolda krockar
│   └── graphify-out/                         # Färdiggenererad interaktiv kunskapsgraf (graph.html)
└── 3-live-rollout-app/                       # Live-Case ("Store Operations & Rollout Studio" v0.1 -> v0.2)
    ├── AGENTS.md                             # Arkitekturregler för blixtsnabbt v0.2-bygge under fikapausen
    ├── .agents/skills/
    │   ├── krav-konsoliderare/SKILL.md       # Gör om er ljudinspelning/transkript -> skarp SPEC_DELTA.md
    │   └── bygg-v02-fran-spec/SKILL.md       # Bygger v0.2 (Kaskadflytt, Mån/Fre-vakt, Batch-readiness & Catch-up)
    └── exempel-transkript/
        └── backup_inspelning_styrgrupp.md    # Reservtranskript om mikrofonen i rummet skulle strula!
```

---

## Manus för Live-Finalen (Pass 5 & 6 – ca kl. 2:50 i körschemat)

1. **Visa igenkänningen i v0.1 (5 min):**
   Starta eller öppna **Store Operations & Rollout Studio v0.1**:
   ```bash
   cd "3-live-rollout-app"
   npm run dev
   ```
   * **Lager 1 (Master Plan & Hypotes A/B):** Växla live mellan **Hypotes A (6 vågor à 60)** och **Hypotes B (37 pilotbutiker + Catch-up + 3 vågor à 70–80)** med 3-veckorstrappan (`Pre-care → Cut-over → Hypercare`) samt flikarna för `Master Plan (SO-*)`, `Activity Plan` och `RAID Log`.
   * **Lager 2 (Vågor & 70-butikersplan):** Klicka på `Våg 1 (70)` och tryck på **"Visa endast avvikelser"** – visa hur man direkt hittar de 5 avvikande butikerna (bl.a. måndags-/fredagsbrott och restnoterade terminaler) bland 70 butiker!
   * **Lager 3 (23 Aktiviteter i 4 faser):** Visa de 23 checkpunkterna (`Innan Go-Live`, `Cut-over`, `Hypercare`, `Exit till linjen`) både per butik och som hel vågmatris.
2. **Släpp "Måndag morgon-bomben" (3 min):**
   > *"Piloten i Finland och UAT är 3 veckor försenad, vi har 0 veckors luft mellan våra 70-butikersvågor, vi får inte rulla ut på måndagar eller fredagar, och ingen projektledare överlever att klicka i 1 610 rutor för hand. Vad ska v0.2 klara när vi trycker på knappen?"*
3. **Inspelat prioriteringsmöte runt bordet (12 min) -> Kör `krav-konsoliderare` (8 min):**
   Dra in ljudfilen (eller `exempel-transkript/backup_inspelning_styrgrupp.md`) i Antigravity:
   > `Använd skillen krav-konsoliderare på denna inspelning från vårt prioriteringsmöte och ta fram SPEC_DELTA.md.`
4. **Tryck på "Bygg v0.2!" och gå på fika (15 min):**
   > `Styrgruppen godkänner SPEC_DELTA.md! Använd skillen bygg-v02-fran-spec och implementera v0.2 nu.`
   När v0.2 är byggd gör vi `git commit && git push` – 45 sekunder senare har Connie och alla i rummet den nya appen live på sina egna skärmar via GitHub Pages!
