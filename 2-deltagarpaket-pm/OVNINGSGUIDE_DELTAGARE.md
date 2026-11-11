# Deltagarguide – Hands-on med Antigravity för Projektledare & Chefer

Välkommen till dagens praktiska labb! Du har just nu tagit över som **Senior Projektledare** för **Projekt OmniPOS** hos kunden *Nordic Retail AB* – en utrullning av ett nytt kassasystem till **42 butiker** i Sverige.

Den tidigare projektledaren lämnade efter sig mappen `projektfiler/` med avtal, mötesprotokoll, mejl och två Excel/CSV-filer (en veckoplan för alla butiker och ett tim-körschema för Go-Live-natten). Nästa styrgruppsmöte är imorgon bitti – och du misstänker att allt inte står rätt till i planeringen!

> **Så öppnar du projektet:** Starta **Antigravity 2.0**, klicka på **Projects -> Open Folder** och välj mappen **`2-deltagarpaket-pm`** (viktigt att du öppnar själva `2-deltagarpaket-pm` som rotmapp så att regler, skills, kunskapsgraf och MCP laddas automatiskt!).

---

## Uppdrag 1: Upplev kraften i Rules (`AGENTS.md`) & Skills (`SKILL.md`) – *Pass 1*

### Steg 1A – Kolla hur agenten styrs
Öppna filen `AGENTS.md` i mappen och läs igenom den på 1 minut. Lägg märke till hur vi förbjuder gissningar, tvingar fram exakta källhänvisningar och kräver ekonomisk konsekvensberäkning i SEK.

### Steg 1B – Kör din första paketerade konsultmetod (Skill)
Titta i `.agents/skills/`. Där ligger två återanvändbara metoder (*SOP:ar*): `go-live-readiness` och `styrgrupps-puls`. Agenten laddar bara in dessa i minnet när de behövs (*Progressive Disclosure*).

Skriv i chatten till Antigravity:
> `Kör en fullständig go-live-readiness granskning av vår nuvarande utrullningsplan utifrån dagens datum (2026-11-04). Missa inga dolda konflikter mellan avtalen, mejlen och CSV-filerna!`

**Reflektera i 2 minuter:** Hur lång tid hade det tagit dig att manuellt korsläsa 6 dokument och 42 rader i Excel för att hitta dubbelbokningarna, Black Week-krockarna, 14-dagarsgaten och den felaktiga 2023-kommentaren i Cutover-schemat?

### Steg 1C – Skapa en egen anpassning i din Skill eller Rule!
Testa att öppna `AGENTS.md` (eller `.agents/skills/styrgrupps-puls/SKILL.md`) och lägg till en egen styrregel som *du* alltid brukar vilja ha i dina uppdrag (t.ex. *"Lägg alltid till ett kort mejlutkast till COO Anna Lindqvist längst ner i varje styrgruppspuls"*). Be sedan agenten:
> `Ta fram en styrgrupps-puls inför morgondagens möte.`

---

## Uppdrag 2: Kunskapsgrafens Röntgenblick (`graphify`) – *Pass 2A*

Vanlig AI-chatt letar efter liknande ord. En **kunskapsgraf** bygger istället en karta av *noder* (butiker, system, personer, avtal, risker) och *relationer* över alla dokument.

1. **Öppna den visuella grafen:** Dubbelklicka på filen `graphify-out/graph.html` i din filhanterare så att den öppnas i din webbläsare! Klicka runt bland klustren (*Communities*) och se hur **Pilotbutik Uppsala (`NR-001`)**, **Adyen**, **TeliaNet** och **Kampanjfrysen** binder ihop hela projektet.
2. **Ställ en flerstegsfråga till agenten via grafen:** Gå tillbaka till Antigravity och skriv:
   > `Utgå från kunskapsgrafen i graphify-out/ (GRAPH_REPORT.md och graph.json): Vilka är projektets absolut farligaste flaskhalsar ("God Nodes"), och vad händer i andra och tredje ledet om Adyen-certifieringen i NR-001 Uppsala försenas med 3 veckor?`

---

## Uppdrag 3: Från ord till handling med MCP (Ärendehantering utan handpåläggning) – *Pass 2B*

I den här mappen ligger en förkonfigurerad lokal **MCP-plugin** (`.agents/plugins/nordic-retail-pmo/`) som simulerar kundens PMO- och ärendesystem (tänk Jira / ServiceNow).

1. **Läs in befintliga ärenden från systemet:** Skriv i chatten:
   > `Kolla i vårt PMO-system (via MCP) vilka öppna ärenden och risker som redan finns registrerade på projektet just nu.`
2. **Låt agenten skapa skarpa eskaleringsärenden åt dig:**
   > `Registrera tre nya kritiska eskaleringsärenden i PMO-systemet (via MCP) för de allvarligaste krockarna vi hittade i vår readiness-revision (Pilot-gate/Adyen, Black Week-frysen för Flagships och TeliaNets ombokningsfönster), inklusive ekonomisk risk i SEK.`
3. **Verifiera att agenten faktiskt ändrade i systemet:** Öppna filen `.agents/plugins/nordic-retail-pmo/pmo_state.json` (eller be agenten lista alla ärenden igen) – dina nya ärenden ligger nu skapade med unika ticket-ID:n!
4. **Bonus (om du vill koppla ett molnverktyg på 1 minut):** Gå till **Plugins / Marketplace** i Antigravity och sök på `Google Docs` eller `Google Calendar` – eller se hur vi strax efter pausen bygger ett helt **3-lagers Utrullningsverktyg** tillsammans live!
