# Reservtranskript – Inspelat Prioriteringsmöte (Top of Minds Drive)

*Använd denna fil som backup om mikrofonen eller röstinspelningen i konferenslokalen skulle strula!*

---

**[00:00] Projektledare 1 (Moderator):**  
Okej hörni, vi har kikat på v0.1 där vi nu har fått in både Master Plan med `SO`-leverablerna, styrgrupps-slidesen med Hypotes A mot Hypotes B, och Våg 1 med hela 70 butiker och alla 23 checkpunkterna från Pre-care till Exit. Vad behöver vi bygga in i **v0.2** nu under fikapausen för att det här ska lösa vardagen på riktigt när det skiter sig?

**[00:42] Konsult A (Store Rollout PM):**  
Två saker som tar knäcken på mig i PowerPoint och Excel idag! Ett: **Kaskad-omplanering och What-if för styrgruppen**. Om UAT eller piloten i Finland drar över med 3 veckor vill jag kunna trycka på en knapp eller skjuta på vågen och *direkt* se vad som händer med alla efterföljande vågor, frysperioden i slutet av oktober och alla 23 aktivitetsdatum per butik – utan att flytta 500 rutor för hand!

**[01:28] Konsult B (Programledare):**  
Och kopplat till det: **Kalender- och regelvakten**! Vi såg ju i mallen att vi *aldrig* får ha Go-Live på måndagar eller fredagar, och i Våg 1 råkade två butiker (`W1-014` och `W1-042`) hamna på måndag och fredag. Jag vill att systemet varnar rött direkt vid regelbrott eller kampanjfrys – och har en **"Smart Auto-planera (Tis–Tors)"**-knapp som rättar till veckodagarna automatiskt!

**[02:12] Konsult C (Utrullningsledare):**  
Sen måste vi lösa **"70-butikers-problemet"** i Lager 2 och 3! Ingen människa kommer orka bocka i 23 rutor gånger 70 butiker en och en. Vi behöver **Batch-kvittering** för hela vågen eller per land för alla butiker som rullar enligt plan, och sen en **1-klicks "Bryt ut till Catch-up / Rollback"-knapp** för de 2–3 butiker som strular med hårdvara eller röktestet – så att resten av vågens 68 butiker kan gå live utan att stoppas!

**[02:58] Konsult D (Chef / Styrgruppsvana):**  
Snyggt! Kan vi också få en **Styrgrupps-Diff högst upp** som visar ursprungligt slutdatum mot nytt slutdatum, hur många butiker som lagts i Catch-up-vågen och vad en försening kostar i kronor – plus en knapp för att exportera uppdaterad status tillbaka till CSV/Excel? Och på sikt vore det ju drömmen med direkt synk mot Microsoft Co-pilot och skarpa ERP-systemet GL2 med enkel inloggning!

**[03:36] Projektledare 1 (Moderator):**  
Vi lägger skarp ERP/GL2-integration och SSO i backloggen för v0.3 hos kund, men kaskad-omplanering, Måndag/Fredag- & frysvakt med Smart Auto-planering, Batch-kvittering + 1-klicks utbrytning till Catch-up för 70-butikersvågorna samt Styrgrupps-Diff + CSV-export – det kör vi in i v0.2 nu!
