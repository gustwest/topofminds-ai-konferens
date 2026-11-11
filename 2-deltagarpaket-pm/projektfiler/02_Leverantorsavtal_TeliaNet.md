# Tjänste- och Leveransavtal (SLA) – Nätverksomkoppling Butiks-LAN

**Leverantör:** TeliaNet Enterprise Services AB ("Nätverksleverantör")  
**Kund:** Nordic Retail AB  
**Tjänst:** SD-WAN & Segregerat Betal-VLAN (`VLAN-POS-40`) för Projekt OmniPOS  
**Kontaktperson Leveransledning:** Henrik Sjöberg (`henrik.sjoberg@telianet-example.se`)  
**Dokument-ID:** `SLA-TN-8841`

---

## 1. Leveransomfattning per butik
För att OmniPOS v4.2 och Adyen-kortterminaler ska fungera krävs två moment från TeliaNet per butik:
1. **Förkonfigurering av SD-WAN-profil (`T-21 kalenderdagar` före Go-Live):** Fjärrkonfiguration av butiksroutern och brandväggsöppning mot Adyen Cloud.
2. **Skarp VLAN-omkoppling på Go-Live-morgonen (`T-0 kl. 05:30–06:15`):** Dedikerad jourtekniker från TeliaNet kopplar om kassapunkterna till `VLAN-POS-40` innan fältteamet startar kassaterminalerna kl. 06:15.

---

## 2. Bokningsfönster, Ombokningsregler och Straffavgifter

### § 2.1 Framförhållning vid nybokning och omplanering
Eftersom skarp VLAN-omkoppling sker nattetid/tidig morgon (`05:30`) med schemalagd jourpersonal gäller strikta ledtider:
* **Låst bokningsfönster:** Ändring eller flytt av bokat Go-Live-datum för en enskild butik måste meddelas TeliaNet skriftligen **senast 15 arbetsdagar (21 kalenderdagar / 3 hela veckor) före det ursprungligen bokade Go-Live-datumet**.
* **Försenings-/Ombokningsavgift vid sen flytt:** Vid avbokning eller flytt av Go-Live-datum med **kortare framförhållning än 15 arbetsdagar** debiterar TeliaNet en fast ombokningsavgift om **35 000 SEK per berörd butik**.
* **Maxkapacitet nattjour:** TeliaNet garanterar jourtekniker för högst **5 butiker per kalendervecka** (och högst 2 butiker samma kalenderdag).

---

## 3. Tekniska beroenden
VLAN-omkoppling (`VLAN-POS-40`) bryter bakåtkompatibiliteten med det gamla systemet *LegacyCash 2014*. Om Go/No-Go kl. 08:45 på Go-Live-morgonen resulterar i **Rollback (No-Go)** måste TeliaNets jourtekniker finnas kvar i beredskap till kl. 09:15 för att rulla tillbaka portkonfigurationen innan butiken öppnar kl. 10:00.
