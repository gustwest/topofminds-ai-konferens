---
name: koppla-mcp-och-plugins
description: Interaktiv svensk guide och installationshjälp för att koppla externa verktyg, 1-klicks Plugins och MCP-servrar (Google Kalender, Drive, Docs, Sheets, Gmail, Slack, Jira/Confluence, GitHub samt webbhotell/DNS) i Google Antigravity. Aktivera direkt när användaren skriver "Koppla mina verktyg", "Koppla MCP", "Installera plugin" eller frågar hur man ansluter mejl, kalender, Drive, Slack eller Jira.
---

# MCP- & Plugin-Coachen – Koppla dina verktyg säkert utan krångel

Denna skill hjälper en projektledare eller konsult att steg för steg ge sin agent säkra ”händer och ögon” mot vardagsverktygen – **alltid med minsta möjliga tekniska friktion först**.

## Viktiga säkerhetsprinciper (Gäller ALLTID!)
1. **Be ALDRIG användaren klistra in lösenord i chatten!** Inloggning sker alltid via officiella OAuth-kort i Antigravity eller genom att användaren själv loggar in i den inbyggda webbläsarpanelen.
2. **Mänskligt godkännande före skarpa utskick:** När skrivverktyg (t.ex. mejl, kalenderkallelser eller Slack/Jira) kopplas på ska `AGENTS.md` innehålla spärren: *”Fråga alltid om mitt OK och visa utkastet innan du skickar iväg mejl, kallelser eller ändrar skarpa kontoinställningar.”*
3. **Kunddata & NDA:** Koppla bara privata konton på egen konsultdator – kundens Jira/SharePoint/M365 kopplas endast i kundens godkända miljö.

---

## Arbetsflöde när användaren skriver ”Koppla mina verktyg” / ”Koppla MCP”

### Steg 1: Fråga vad som ger störst nytta direkt
Presentera de **tre snabbspåren** på enkel svenska och fråga vilket eller vilka verktyg användaren vill börja med:

- **Spår A – 1-klicks Plugins i Antigravity 2.0 (0 API-nycklar, klart på 30 sek!):**
  - **Google Kalender (`gcalendar`)** – kolla lediga tider, se dagens schema och boka möten med rätt tidszon (`Europe/Stockholm`).
  - **Google Drive (`gdrive`), Docs (`gdocs`), Sheets (`gsheets`) & Slides (`gslides`)** – hitta, läs och uppdatera dokument och kalkylark direkt.
  - **Design & Projektverktyg** – t.ex. **Figma**, **ClickUp**, **Atlassian (Jira/Confluence)**, **Cloudflare** och **Netlify**.
- **Spår B – Egna MCP-servrar (`mcp_config.json`) för Gmail, Slack, GitHub eller Databaser:**
  - För verktyg där användaren vill sätta upp en dedikerad MCP-server (t.ex. Gmail-sök/utskick, teamets Slack-arbetsyta eller lokal testdatabas).
- **Spår C – Inbyggda webbläsaragenten (`/browser`) för webbhotell, DNS & adminpaneler:**
  - Perfekt för sällan-admin som **Loopia, Oderland, Fortnox-export eller domäninställningar (`SPF`/`DKIM`/`CNAME`)** utan att behöva sätta upp någon API-koppling alls!

---

### Steg 2: Genomför valt spår smidigt åt användaren

#### Om användaren väljer Spår A (1-klicks Plugins i Antigravity):
1. Om du har verktyget `search_marketplace` tillgängligt: sök upp rätt plugin (t.ex. `gcalendar`, `gdrive`, `gdocs`, `gsheets`, `atlassian`, `figma`) och visa **klickbara `<plugin-card>`-kort** direkt i chatten så användaren bara klickar **Add / Sign in**!
2. Om pluginet redan är installerat (eller om användaren vill se alla): guida dem till vänstermenyn i Antigravity 2.0 under **Skills & Customizations → Plugins** där de loggar in med ett klick via vanlig Google-/OAuth-inloggning.
3. När inloggningen är klar: föreslå **ett direkt skarpt minitest** (t.ex. *”Visa mina möten idag och kolla hur de hänger ihop med projekten i min Atlas!”*).

#### Om användaren väljer Spår B (Konfigurera en MCP-server i `~/.gemini/antigravity/mcp_config.json`):
1. Kontrollera först tyst om `node` / `npx` finns på datorn (`node -v`) och om `~/.gemini/antigravity/mcp_config.json` redan existerar (läs filen först så du **aldrig** skriver över befintliga servrar!).
2. Förklara med **max 3 enkla punkter** vad som behövs för just det valda verktyget (t.ex. GitHub Personal Access Token med läsrättighet, Slack App Bot Token eller Google OAuth) och hjälp användaren lägga in serverblocket säkert i `~/.gemini/antigravity/mcp_config.json`.
3. Lägg till en tydlig säkerhetsrad i projektets `AGENTS.md` (t.ex. godkännandekrav före utskick och gräns mellan bolag/projekt) och dokumentera kopplingen kort i `02-bolag-och-topofminds/` så användaren minns hur det sattes upp om ett år!

#### Om användaren väljer Spår C (Webbhotell / Kontoadmin via `/browser`):
1. Be användaren skriva `/browser` och ange adressen (t.ex. `loopia.se` eller `dash.cloudflare.com`).
2. Användaren loggar alltid in själv med BankID/lösenord i webbläsarfönstret – därefter läser du av sidan, förklarar inställningarna på vanlig svenska och ber om klartecken innan något sparas.
