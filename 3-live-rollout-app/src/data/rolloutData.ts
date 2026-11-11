import type {
  ActivityPlanItem,
  CountryCode,
  CutoverStepTemplate,
  FieldTeam,
  ForgottenTrackCategory,
  GovernancePolicy,
  MasterPlanDeliverable,
  PrepStatus,
  RaidLogItem,
  RolloutHypothesis,
  RolloutWave,
  StoreFormat,
  StoreRollout,
  WaveId,
} from '../types/rollout';

/**
 * ============================================================================
 * 1. MASTER PLAN, ACTIVITY PLAN & RAID LOG
 * Direkt baserat på Connies "Store Operations - Master Plan.xlsx" (anonymiserad)
 * ============================================================================
 */
export const MASTER_PLAN_DELIVERABLES: MasterPlanDeliverable[] = [
  {
    id: 'SO-BP-001',
    phase: 'Foundation',
    workstream: 'Store Processes',
    deliverable: 'Validerade butiksprocesser med lösta gap och bekräftat ägarskap',
    doneWhen:
      'Prioriterade butiksprocesser granskade; gap dokumenterade med beslutad lösning; namngiven ägare per Store Operations-modul.',
    owner: 'Process Lead (SE/NO/FI)',
    target: '2027-v14 (Apr)',
    dateConfidence: 'Working assumption',
    status: 'Pågår',
    rag: 'Green',
    nextStep: 'Slutför genomgång av returer & Click-and-Collect för Feeder stores',
  },
  {
    id: 'SO-TEST-001',
    phase: 'Foundation',
    workstream: 'Testing & Quality',
    deliverable: 'Store Operations testberedskap (Testfall, testdata & testare)',
    doneWhen:
      'Godkända testfall täcker prioriterade processer; testare utsedda i SE/NO/FI; åtkomst och representativ testdata på plats.',
    owner: 'QA & Test Lead',
    target: '2027-v18 (Maj)',
    dateConfidence: 'Working assumption',
    status: 'Pågår',
    rag: 'Amber',
    nextStep: 'Säkra ERP/GL2-testdata för norska och finska momssatser',
    relatedRaidId: 'RAID-02',
  },
  {
    id: 'SO-TEST-003',
    phase: 'Pilot',
    workstream: 'Testing & Quality',
    deliverable: 'Genomför Store Operations E2E / UAT inför Pilot',
    doneWhen: 'Kritiska E2E-scenarier exekverade; kritiska defekter lösta eller formellt accepterade.',
    owner: 'QA & Test Lead',
    target: '2027-v21 (Maj)',
    dateConfidence: 'TBD',
    status: 'To validate',
    rag: 'Amber',
    nextStep: 'Lås UAT-fönster mot systemleverantören RetailCore',
    relatedRaidId: 'RAID-01',
  },
  {
    id: 'SO-TRAIN-001',
    phase: 'Pilot',
    workstream: 'Store Instructions & Training',
    deliverable: 'Användarmanualer, utbildningsvideo & Super-User-utbildning klara',
    doneWhen:
      'Format, tränare och intyg överenskommet; Super-Users utbildade vid centrallager/hubb; pilotdeltagare klara före Readiness-gate.',
    owner: 'Training & Change Lead',
    target: '2027-v22 (Maj)',
    dateConfidence: 'Working assumption',
    status: 'Pågår',
    rag: 'Green',
    nextStep: 'Publicera träningsvideo i utbildningsportalen för SE/NO/FI',
  },
  {
    id: 'SO-PILOT-001',
    phase: 'Pilot',
    workstream: 'Pilot Preparation',
    deliverable: 'Butikspilot förberedd, genomförd och utvärderad (Exit-kriterier)',
    doneWhen:
      'Mål, scope och mätbara Go/No-Go-kriterier godkända; pilotbutiker bekräftade (Easy, Large, Feeder); pilot utvärderad med beslut.',
    owner: 'PM Store Rollout',
    target: '2027-v23–v33 (Jun–Aug)',
    dateConfidence: 'Working assumption',
    status: 'Pågår',
    rag: 'Amber',
    nextStep: 'Besluta mellan Hypotes A (5 pilotbutiker) och Hypotes B (37 pilotbutiker)',
    relatedRaidId: 'RAID-03',
  },
  {
    id: 'SO-READY-001',
    phase: 'Pilot',
    workstream: 'Store Readiness',
    deliverable: 'Store Readiness-modell & checklista godkänd och bedömd',
    doneWhen:
      'Kontroller för personal, process, utbildning, behörighet, masterdata, hårdvara och support godkända; kritiska gap stängda.',
    owner: 'PM Store Rollout',
    target: '2027-v22 (Maj)',
    dateConfidence: 'TBD',
    status: 'To validate',
    rag: 'Grey',
    nextStep: 'Validera de 23 checkpunkterna per butik med drift- och fältteam',
  },
  {
    id: 'SO-COMM-001',
    phase: 'Pilot',
    workstream: 'Communication & Change',
    deliverable: 'Kommunikationsplan för pilot och utrullningsvågor',
    doneWhen: 'Målgrupp, budskap, avsändare, kanal och tajming kopplad till alla milstolpar.',
    owner: 'Change & Comm Lead',
    target: '2027-v20 (Maj)',
    dateConfidence: 'TBD',
    status: 'To validate',
    rag: 'Grey',
    nextStep: 'Synka utrullningskommunikation med regionchefer i Land A, B och C',
  },
  {
    id: 'SO-SUP-001',
    phase: 'Pilot',
    workstream: 'Support & Hypercare',
    deliverable: 'Support-, eskalerings- och Hypercare-modell (inkl. Rollback-rutin)',
    doneWhen:
      'Öppettider, kanaler, roller, allvarlighetsgrader, rollback-rutin och eskaleringsvägar fastställda.',
    owner: 'IT Support Lead',
    target: '2027-v22 (Maj)',
    dateConfidence: 'TBD',
    status: 'To validate',
    rag: 'Amber',
    nextStep: 'Säkra Hypercare-bemanning när tre 70-butikersvågor överlappar utan luft!',
    relatedRaidId: 'RAID-04',
  },
  {
    id: 'SO-ROLL-001',
    phase: 'Rollout',
    workstream: 'Rollout Preparation',
    deliverable: 'Utrullningsstrategi & vågindelning beslutad (Länder, sekvens & kapacitet)',
    doneWhen:
      'Länder, sekvensprinciper, vågstorlek (60–80 butiker/våg) och kalenderregler (ej mån/fre) godkända; butiker tilldelade vågor.',
    owner: 'PM Store Rollout',
    target: '2027-v34 (Aug)',
    dateConfidence: 'Working assumption',
    status: 'Pågår',
    rag: 'Amber',
    nextStep: 'Verifiera att inga Go-Live-datum ligger på måndagar, fredagar eller högsäsongsfrys',
    relatedRaidId: 'RAID-03',
  },
  {
    id: 'SO-ROLL-003',
    phase: 'Rollout',
    workstream: 'Rollout Conduction',
    deliverable: 'Orkestrera utrullningsvågor (Pre-care → Cut-over → Hypercare → Exit)',
    doneWhen:
      'Samtliga butiker genomförda enligt 4-fasmodellen och formellt överlämnade till linjeorganisationen.',
    owner: 'PM Store Rollout',
    target: '2027-v35–v41 (Sep–Okt)',
    dateConfidence: 'Working assumption',
    status: 'To validate',
    rag: 'Grey',
    nextStep: 'Etablera avvikelsestyrning och Catch-up-hantering för 70 butiker/våg',
  },
];

export const ACTIVITY_PLAN_ITEMS: ActivityPlanItem[] = [
  {
    id: 'ACT-MP-01',
    masterPlanId: 'SO-BP-001',
    workstream: 'Store Processes',
    activity: 'Validera affärsprocesser för Store Operations',
    doneWhen: 'Prioriterade butiksprocesser granskade; gap och öppna frågor dokumenterade',
    owner: 'Process Lead',
    target: 'v.12',
    status: 'Klar',
  },
  {
    id: 'ACT-MP-02',
    masterPlanId: 'SO-BP-001',
    workstream: 'Store Processes',
    activity: 'Lös processgap och klargöranden mot systemleverantör',
    doneWhen: 'Varje identifierat gap har beslutad lösning eller namngiven ägare',
    owner: 'Process Lead',
    target: 'v.14',
    status: 'Pågår',
  },
  {
    id: 'ACT-MP-03',
    masterPlanId: 'SO-TEST-001',
    workstream: 'Testing & Quality',
    activity: 'Skapa testfall & säkra testdata/åtkomst för SE, NO och FI',
    doneWhen: 'Testare utsedda och representativ masterdata laddad i testmiljön',
    owner: 'QA Lead',
    target: 'v.18',
    status: 'Pågår',
  },
  {
    id: 'ACT-MP-04',
    masterPlanId: 'SO-TRAIN-001',
    workstream: 'Store Instructions & Training',
    activity: 'Ta fram butiksmanualer, träningsvideo & genomför Super-User-utbildning',
    doneWhen: 'Super-Users i SE/NO/FI klara att utbilda butiker i sin egen region (Train-the-Trainer)',
    owner: 'Training Lead',
    target: 'v.21',
    status: 'Pågår',
  },
  {
    id: 'ACT-MP-05',
    masterPlanId: 'SO-PILOT-001',
    workstream: 'Pilot Preparation',
    activity: 'Fastställ pilotmål, exit-kriterier & välj pilotbutiker (Easy / Large / Feeder)',
    doneWhen: 'Mätbara kriterier för Go / Extend / Stop godkända av styrgrupp',
    owner: 'PM Store Rollout',
    target: 'v.22',
    status: 'Pågår',
  },
  {
    id: 'ACT-MP-06',
    masterPlanId: 'SO-READY-001',
    workstream: 'Store Readiness',
    activity: 'Definiera Store Readiness-checklista (23 punkter i 4 faser)',
    doneWhen: 'Checklista för Innan Go-Live, Cut-over, Hypercare och Exit godkänd',
    owner: 'PM Store Rollout',
    target: 'v.22',
    status: 'To validate',
  },
  {
    id: 'ACT-MP-07',
    masterPlanId: 'SO-ROLL-001',
    workstream: 'Rollout Preparation',
    activity: 'Bygg utrullningsvågor med kapacitets-, kalender- och beroendekontroll',
    doneWhen: 'Butiker fördelade i vågor utan måndag/fredag-krockar eller saknad pilotutbildare',
    owner: 'PM Store Rollout',
    target: 'v.34',
    status: 'To validate',
  },
];

export const RAID_LOG_ITEMS: RaidLogItem[] = [
  {
    id: 'RAID-01',
    type: 'Risk',
    title: 'Ingen luft mellan utrullningsvågorna (3 vågor överlappar varje vecka)',
    impact:
      'När Våg 1 är i Hypercare är Våg 2 i Cut-over och Våg 3 i Pre-care samtidigt (~210 aktiva butiker parallellt). En 2-veckors UAT/Pilot-försening trycker in Våg 3 i höst-/kampanjfrysen.',
    relatedMasterPlanId: 'SO-TEST-003',
    owner: 'PM Store Rollout',
    nextAction: 'Simulera konsekvens av +2v/+3v försening och lägg in Catch-up-buffert inför Styrgrupp',
    dueDate: '2027-05-15',
    status: 'Escalated',
    escalateToSteerCo: true,
  },
  {
    id: 'RAID-02',
    type: 'Dependency',
    title: 'Beroende mot ERP (GL2), Masterdata & Systemleverantör (RetailCore)',
    impact:
      'Försenad synk av artikel-/prisfiler eller betalintegration blockerar röktest vid Cut-over för samtliga Feeder & Large stores.',
    relatedMasterPlanId: 'SO-TEST-001',
    owner: 'Integration Lead',
    nextAction: 'Lås frystidpunkt för masterdata T-2 dagar före varje vågs Cut-over',
    dueDate: '2027-05-01',
    status: 'Open',
    escalateToSteerCo: false,
  },
  {
    id: 'RAID-03',
    type: 'Assumption',
    title: 'Pilotbutiker agerar regionala utbildare (Train-the-Trainer) för sin region',
    impact:
      'Om en pilotbutik i Norge (Land B) eller Finland (Land C) försenas hinner de inte utbilda butikspersonalen i Våg 1.',
    relatedMasterPlanId: 'SO-PILOT-001',
    owner: 'Training & Change Lead',
    nextAction: 'Säkerställ minst 2 veckors marginal mellan Pilot Cut-over och Våg 1 i varje land',
    dueDate: '2027-05-20',
    status: 'Mitigating',
    escalateToSteerCo: true,
  },
  {
    id: 'RAID-04',
    type: 'Issue',
    title: 'Manuell Excel-uppföljning skalar ej för 70 butiker × 23 aktiviteter/våg',
    impact:
      '1 610 celler per våg gör att blockerade butiker upptäcks för sent och riskerar att stoppa hela vågen istället för lokal Rollback/Catch-up.',
    relatedMasterPlanId: 'SO-SUP-001',
    owner: 'PM Store Rollout',
    nextAction: 'Inför avvikelsebaserad vågstyrning (Exception-First) + 1-klicks utbrytning till Catch-up',
    dueDate: '2027-06-01',
    status: 'Open',
    escalateToSteerCo: true,
  },
];

/**
 * ============================================================================
 * 2. HYPOTES A vs HYPOTES B (Från Connies "Tidplan - hypotes och alternativ.pptx")
 * ============================================================================
 */
export const ROLLOUT_HYPOTHESES: RolloutHypothesis[] = [
  {
    id: 'HYP_A',
    badge: 'Hypotes A (Slide 1)',
    title: 'Kort Pilot i juni + 6 vågor under aug–okt (60 butiker i Våg 3–6)',
    subtitle: 'Snabb start med 2 små verifieringsvågor följt av 4 tunga 60-butikersvågor utan mellanrum',
    pilotSummary: '1 Easy + 1 Large + 1 Feeder (Land A/SE) i juni, följt av 1 Easy i Land B (NO) & Land C (FI) i aug (5 pilotbutiker)',
    rolloutSummary: '6 vågor × 3 veckor (1v Pre-care, 1v Cut-over, 1v Hyper-care) under v.33–v.40 (248 utrullningsbutiker)',
    totalPilotStores: 5,
    totalRolloutStores: 248,
    waveCount: 6,
    hasCatchUpWeek: false,
    keyTakeaways: [
      'Ingen luft mellan varje våg – 3 vågor rullar alltid omlott samma vecka!',
      'Kräver att Super-User-utbildning för Våg 4, 5 och 6 körs samtidigt som Våg 1–3 går live.',
      'Liten pilot (endast 5 butiker) ger kortare testtid innan de fyra 60-butikersvågorna drar igång.',
    ],
    waves: [
      {
        id: 'A-PILOT',
        label: 'Pilotfas (Jun + Aug)',
        storeSummary: '3 butiker Land A (Easy/Large/Feeder) + 2 Easy (Land B & C)',
        storeCount: 5,
        preCareStartWeek: 23,
        cutOverWeek: 24,
        hyperCareEndWeek: 32,
        countries: 'SE, NO, FI',
        highlightNote: 'Delad över sommaren (v.23–26 i SE, v.31–32 i NO/FI)',
      },
      {
        id: 'A-W1',
        label: 'Wave 1 (Mjukstart)',
        storeSummary: '3 Easy stores',
        storeCount: 3,
        preCareStartWeek: 33,
        cutOverWeek: 34,
        hyperCareEndWeek: 35,
        countries: 'SE (Land A)',
      },
      {
        id: 'A-W2',
        label: 'Wave 2 (Komplexa format)',
        storeSummary: '3 Large stores + 2 Feeder stores',
        storeCount: 5,
        preCareStartWeek: 34,
        cutOverWeek: 35,
        hyperCareEndWeek: 36,
        countries: 'SE, NO',
      },
      {
        id: 'A-W3',
        label: 'Wave 3 (Full skala)',
        storeSummary: '60 stores total',
        storeCount: 60,
        preCareStartWeek: 35,
        cutOverWeek: 36,
        hyperCareEndWeek: 37,
        countries: 'SE, NO, FI',
      },
      {
        id: 'A-W4',
        label: 'Wave 4 (Full skala)',
        storeSummary: '60 stores total',
        storeCount: 60,
        preCareStartWeek: 36,
        cutOverWeek: 37,
        hyperCareEndWeek: 38,
        countries: 'SE, NO, FI',
      },
      {
        id: 'A-W5',
        label: 'Wave 5 (Full skala)',
        storeSummary: '60 stores total',
        storeCount: 60,
        preCareStartWeek: 37,
        cutOverWeek: 38,
        hyperCareEndWeek: 39,
        countries: 'SE, NO, FI',
      },
      {
        id: 'A-W6',
        label: 'Wave 6 (Slutvåg)',
        storeSummary: '60 stores total',
        storeCount: 60,
        preCareStartWeek: 38,
        cutOverWeek: 39,
        hyperCareEndWeek: 40,
        countries: 'SE, NO, FI',
      },
    ],
    trainingTracks: [
      { id: 'TR-A1', label: 'Create training material', startWeek: 4, endWeek: 17, category: 'Material' },
      { id: 'TR-A2', label: 'Super-user training (Hubb)', startWeek: 18, endWeek: 21, category: 'Super-User' },
      { id: 'TR-A3', label: 'Training store personnel (Pilot + Wave 1–3)', startWeek: 21, endWeek: 35, category: 'Store Personnel' },
      { id: 'TR-A4', label: 'Training store personnel (Wave 4–6)', startWeek: 35, endWeek: 38, category: 'Store Personnel' },
      { id: 'TR-A5', label: 'Onboarding & Hypercare Support', startWeek: 23, endWeek: 41, category: 'Support' },
    ],
  },
  {
    id: 'HYP_B',
    badge: 'Hypotes B (Slide 2 – Rekommenderad baslinje)',
    title: 'Utökad stegvis Pilot (37 butiker + Catch-up) + 3 megavågor i sep–okt (70–80 butiker/våg)',
    subtitle: 'Bygger regionala Train-the-Trainer-piloter i alla länder + 1 veckas Catch-up innan tre 70-butikersvågor',
    pilotSummary:
      'Totalt 37 pilotbutiker (jun–aug): 1 Easy + 1 Large + 1 Feeder (SE) → +2 Easy & +2 Large (NO & FI) → +10 + 10 + 10 butiker + Catch-up v.34',
    rolloutSummary: '3 megavågor × 3 veckor (Pre-care, Cut-over, Hyper-care): 70 + 70 + 80 = 220 butiker under sep–okt',
    totalPilotStores: 37,
    totalRolloutStores: 220,
    waveCount: 3,
    hasCatchUpWeek: true,
    catchUpWeekNumber: 34,
    keyTakeaways: [
      'Bred pilot (37 butiker) säkrar att varje region i SE, NO och FI har en live-pilot som kan utbilda Våg 1–3!',
      'Innehåller en dedikerad Catch-up-period (v.34) för att läka defekter före massutrullningen.',
      'Extremt högt tryck i september: 70 + 70 + 80 butiker i tre överlappande vågor kräver strikt avvikelsestyrning!',
    ],
    waves: [
      {
        id: 'B-PILOT-1',
        label: 'Pilot Steg 1–2 (SE, NO, FI)',
        storeSummary: '1 Easy + 1 Large + 1 Feeder (SE) + 2 Easy & 2 Large (NO/FI)',
        storeCount: 7,
        preCareStartWeek: 23,
        cutOverWeek: 25,
        hyperCareEndWeek: 29,
        countries: 'SE, NO, FI',
      },
      {
        id: 'B-PILOT-2',
        label: 'Pilot Expansion (+30 butiker)',
        storeSummary: '+10 + 10 + 10 regionala referensbutiker',
        storeCount: 30,
        preCareStartWeek: 30,
        cutOverWeek: 32,
        hyperCareEndWeek: 33,
        countries: 'SE, NO, FI',
        highlightNote: 'Följs av Catch-up-period i v.34 innan Våg 1 startar!',
      },
      {
        id: 'B-W1',
        label: 'Wave 1 (70 butiker)',
        storeSummary: '70 stores (SE / NO / FI)',
        storeCount: 70,
        preCareStartWeek: 35,
        cutOverWeek: 36,
        hyperCareEndWeek: 37,
        countries: 'SE, NO, FI',
      },
      {
        id: 'B-W2',
        label: 'Wave 2 (70 butiker)',
        storeSummary: '70 stores (SE / NO / FI)',
        storeCount: 70,
        preCareStartWeek: 36,
        cutOverWeek: 37,
        hyperCareEndWeek: 38,
        countries: 'SE, NO, FI',
      },
      {
        id: 'B-W3',
        label: 'Wave 3 (80 butiker)',
        storeSummary: '80 stores (SE / NO / FI)',
        storeCount: 80,
        preCareStartWeek: 37,
        cutOverWeek: 38,
        hyperCareEndWeek: 39,
        countries: 'SE, NO, FI',
      },
    ],
    trainingTracks: [
      { id: 'TR-B1', label: 'Create training material', startWeek: 4, endWeek: 17, category: 'Material' },
      { id: 'TR-B2', label: 'Super-user training 1 (Pilot)', startWeek: 18, endWeek: 21, category: 'Super-User' },
      { id: 'TR-B3', label: 'Training of store personnel (37 Pilot stores)', startWeek: 22, endWeek: 32, category: 'Store Personnel' },
      { id: 'TR-B4', label: 'Super-user training 2 + Regional Train-the-Trainer w.1–3', startWeek: 33, endWeek: 37, category: 'Store Personnel' },
      { id: 'TR-B5', label: 'Onboarding & Hypercare Support', startWeek: 23, endWeek: 40, category: 'Support' },
    ],
  },
];

/**
 * ============================================================================
 * 3. OPERATIVA VÅGOR & STYRNINGSREGLER
 * ============================================================================
 */
export const ROLLOUT_WAVES: RolloutWave[] = [
  {
    id: 'Pilot',
    title: 'Pilot & Regionala Tränarbutiker',
    subtitle: 'Easy, Large & Feeder i SE, NO och FI',
    focusRegion: 'Sverige (Land A), Norge (Land B) & Finland (Land C)',
    accentColor: '#4f46e5',
    badgeClass: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
    barClass: 'bg-indigo-600',
    targetGoal:
      'Verifiera alla 3 butiksformat (Easy, Large, Feeder) och utbilda regionala Super-Users inför Våg 1',
    plannedStoreScale: 37,
    preCareWeeks: 1,
    cutOverWeeks: 1,
    hyperCareWeeks: 1,
  },
  {
    id: 'Våg 1',
    title: 'Våg 1 – Första Massvågen (70 butiker)',
    subtitle: 'Full 70-butikersvåg: Pre-care → Cut-over → Hypercare',
    focusRegion: 'SE (34), NO (20) & FI (16)',
    accentColor: '#0284c7',
    badgeClass: 'bg-sky-50 text-sky-700 ring-sky-600/20',
    barClass: 'bg-sky-600',
    targetGoal:
      'Genomför 70 butiker på tisdag–torsdag utan att enskilda avvikelser stoppar hela vågen (använd Catch-up vid behov)',
    plannedStoreScale: 70,
    preCareWeeks: 1,
    cutOverWeeks: 1,
    hyperCareWeeks: 1,
  },
  {
    id: 'Våg 2',
    title: 'Våg 2 – Andra Massvågen',
    subtitle: 'Överlappar med Våg 1 Hypercare & Våg 3 Pre-care',
    focusRegion: 'Väst/Syd SE, Vestlandet NO & Västra FI',
    accentColor: '#0d9488',
    badgeClass: 'bg-teal-50 text-teal-700 ring-teal-600/20',
    barClass: 'bg-teal-600',
    targetGoal:
      'Håll noll luft mellan vågorna med bibehållen Hypercare-kapacitet för både Large och Feeder stores',
    plannedStoreScale: 70,
    preCareWeeks: 1,
    cutOverWeeks: 1,
    hyperCareWeeks: 1,
  },
  {
    id: 'Våg 3',
    title: 'Våg 3 – Slutvåg inför Höst-/Julfrys',
    subtitle: 'Sista tunga utrullningsvågen före kampanjfrys',
    focusRegion: 'Storstad, Nord & Resterande Feeder-hubbar',
    accentColor: '#7c3aed',
    badgeClass: 'bg-violet-50 text-violet-700 ring-violet-600/20',
    barClass: 'bg-violet-600',
    targetGoal: 'Slutför utrullning och överlämning till linjen (Exit) före höst-/Black Week-frysen',
    plannedStoreScale: 80,
    preCareWeeks: 1,
    cutOverWeeks: 1,
    hyperCareWeeks: 1,
  },
  {
    id: 'Våg 4',
    title: 'Catch-up / Restvåg (Reservfönster)',
    subtitle: 'Uppsamlingsvåg för utbrutna / rollbackade butiker',
    focusRegion: 'SE / NO / FI (Vid avvikelse)',
    accentColor: '#ea580c',
    badgeClass: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    barClass: 'bg-orange-500',
    targetGoal:
      'Fånga upp enskilda butiker som brutits ut ur Våg 1–3 p.g.a. hårdvarubrist eller missat röktest',
    plannedStoreScale: 0,
    preCareWeeks: 1,
    cutOverWeeks: 1,
    hyperCareWeeks: 1,
  },
];

export const GOVERNANCE_POLICY: GovernancePolicy = {
  referenceToday: '2027-08-25',
  sowTargetEndDate: '2027-10-22',
  weeklyDelayPenaltySek: 95_000,
  pilotStabilizationDays: 14,
  maxStoresPerWeekTotal: 75,
  maxStoresPerTeamPerWeek: 35,
  teliaRescheduleNoticeDays: 14,
  teliaLateRescheduleFeeSek: 25_000,
  disallowMondaysAndFridays: true, // Från Connies "Overall Rollout Plan": No rollout on Mondays or Fridays!
  requirePilotRegionalTrainerBeforeWave1: true,
  freezeWindows: [
    {
      id: 'FREEZE-AUTUMN',
      name: 'Höstkampanj & Lönehelg (Large & Feeder-spärr)',
      startDate: '2027-10-25',
      endDate: '2027-11-07',
      restrictedFormats: ['Large store', 'Feeder store'],
      sourceDoc: 'Overall Rollout Plan (High risk / reduced staffing)',
      reason: 'Högriskperiod med reducerad support- och butiksbemanning för Large & Feeder stores.',
    },
    {
      id: 'FREEZE-BW-XMAS',
      name: 'Black Month & Julhandel (Total Utrullningsfrys)',
      startDate: '2027-11-08',
      endDate: '2027-12-31',
      restrictedFormats: ['Easy store', 'Large store', 'Feeder store'],
      sourceDoc: 'Styrgruppsdirektiv & Overall Rollout Plan',
      reason: '100 % Change Freeze i butiksled under årets viktigaste försäljningsperiod.',
    },
  ],
};

/**
 * ============================================================================
 * 4. DE 23 AKTIVITETERNA PER VÅG & BUTIK I 4 FASER
 * Direkt från Connies "Utkast - utrullningsplan.xlsx" -> "List of all activities"
 * ============================================================================
 */
export const CUTOVER_TEMPLATE_STEPS: CutoverStepTemplate[] = [
  // FAS 1: INNAN GO-LIVE (PRE-CARE) – 8 STEG
  {
    id: 'ACT-01',
    phase: '1. Innan Go-Live (Pre-care)',
    dayOffset: -14,
    startTime: '09:00',
    endTime: '10:00',
    activity: 'Bekräfta butik & lokal kontaktperson',
    ownerRole: 'PM Store Rollout & Butikschef',
    responsibleParty: 'Kund (Store Ops)',
    systemDependency: 'Master Plan / Våglista',
    mandatoryGate: true,
    ruleNote: 'Butikschef och lokal Super-User bekräftar mottagande av utrullningspaket.',
  },
  {
    id: 'ACT-02',
    phase: '1. Innan Go-Live (Pre-care)',
    dayOffset: -12,
    startTime: '10:00',
    endTime: '11:00',
    activity: 'Bekräfta Go-Live-datum (Kontrollera ej Måndag/Fredag eller helgdag)',
    ownerRole: 'PM Store Rollout',
    responsibleParty: 'Kund (Store Ops)',
    systemDependency: 'Overall Rollout Plan',
    mandatoryGate: true,
    ruleNote: 'Hård regel: Ingen utrullning på måndagar eller fredagar p.g.a. bemanning och helgrisk!',
  },
  {
    id: 'ACT-03',
    phase: '1. Innan Go-Live (Pre-care)',
    dayOffset: -10,
    startTime: '08:00',
    endTime: '15:00',
    activity: 'Verifiera hårdvara i butik (Kassor, skannrar, kvittoskrivare & betalterminaler)',
    ownerRole: 'Lokal IT & Butikschef',
    responsibleParty: 'Kund (Store Ops)',
    systemDependency: 'Hårdvaruinventering',
    mandatoryGate: true,
    ruleNote: 'Om hårdvara saknas T-5 bryts butiken ut till Catch-up utan att fördröja övriga 69 butiker i vågen.',
  },
  {
    id: 'ACT-04',
    phase: '1. Innan Go-Live (Pre-care)',
    dayOffset: -8,
    startTime: '09:00',
    endTime: '12:00',
    activity: 'Verifiera nätverk, WiFi & brandväggsöppningar',
    ownerRole: 'Infrastruktur / Nätverksteam',
    responsibleParty: 'Kund (Store Ops)',
    systemDependency: 'Butiks-LAN / SD-WAN',
    mandatoryGate: true,
    ruleNote: 'Särskilt kritiskt för Feeder stores med lager-/hubbflöden.',
  },
  {
    id: 'ACT-05',
    phase: '1. Innan Go-Live (Pre-care)',
    dayOffset: -6,
    startTime: '13:00',
    endTime: '15:00',
    activity: 'Verifiera användare, roller & behörigheter i nya butikssystemet',
    ownerRole: 'IAM / Systemleverantör',
    responsibleParty: 'Gemensam (Kund + Leverantör)',
    systemDependency: 'RetailCore IAM / AD',
    mandatoryGate: true,
    ruleNote: 'Alla butiksmedarbetare ska kunna logga in före Pre-care-mötet.',
  },
  {
    id: 'ACT-06',
    phase: '1. Innan Go-Live (Pre-care)',
    dayOffset: -5,
    startTime: '09:00',
    endTime: '16:00',
    activity: 'Säkerställa genomförd utbildning (E-learning + Regional Train-the-Trainer)',
    ownerRole: 'Butikschef & Regional Pilotbutik',
    responsibleParty: 'Kund (Store Ops)',
    systemDependency: 'Utbildningsportal',
    mandatoryGate: true,
    ruleNote: 'Kräver att regionens pilotbutik genomfört sin Train-the-Trainer-session (SO-TRAIN-001).',
  },
  {
    id: 'ACT-07',
    phase: '1. Innan Go-Live (Pre-care)',
    dayOffset: -3,
    startTime: '14:00',
    endTime: '14:45',
    activity: 'Genomföra Pre-care möte med butiken (Go/No-Go inför Cut-over)',
    ownerRole: 'Rollout Koordinator & Butikschef',
    responsibleParty: 'Gemensam (Kund + Leverantör)',
    systemDependency: 'Store Readiness Checklista',
    mandatoryGate: true,
    ruleNote: 'Beslutspunkt: Grön butik går till Cut-over, röd butik flyttas med 1 klick till Catch-up.',
  },
  {
    id: 'ACT-08',
    phase: '1. Innan Go-Live (Pre-care)',
    dayOffset: -1,
    startTime: '15:00',
    endTime: '16:00',
    activity: 'Bekräfta supportberedskap & eskaleringsvägar inför morgondagens skifte',
    ownerRole: 'Supportteam & Systemleverantör',
    responsibleParty: 'Gemensam (Kund + Leverantör)',
    systemDependency: 'Hypercare Desk',
    mandatoryGate: true,
    ruleNote: 'Säkerställ jourschema hos både egen IT och systemleverantör.',
  },

  // FAS 2: CUT-OVER (GO-LIVE) – 6 STEG
  {
    id: 'ACT-09',
    phase: '2. Cut-over (Go-Live)',
    dayOffset: 0,
    startTime: '06:00',
    endTime: '06:45',
    activity: 'Backup & slutverifiering av dagsavslut från befintligt system',
    ownerRole: 'Central IT & Systemleverantör',
    responsibleParty: 'Systemleverantör (RetailCore/EG)',
    systemDependency: 'ERP (GL2) / Legacy POS',
    mandatoryGate: true,
    ruleNote: 'Säkrar återställningspunkt om Rollback skulle krävas före öppning.',
  },
  {
    id: 'ACT-10',
    phase: '2. Cut-over (Go-Live)',
    dayOffset: 0,
    startTime: '06:45',
    endTime: '07:45',
    activity: 'Installation & aktivering av ny kassaklient i butik',
    ownerRole: 'Systemleverantör & Lokal teknik',
    responsibleParty: 'Systemleverantör (RetailCore/EG)',
    systemDependency: 'RetailCore POS',
    mandatoryGate: true,
    ruleNote: 'Utförs parallellt för samtliga butiker i vågens dagsbatch.',
  },
  {
    id: 'ACT-11',
    phase: '2. Cut-over (Go-Live)',
    dayOffset: 0,
    startTime: '07:45',
    endTime: '08:30',
    activity: 'Konfiguration av butiksparametrar, skatteregler (SE/NO/FI) & masterdata',
    ownerRole: 'Systemleverantör & Masterdata-team',
    responsibleParty: 'Systemleverantör (RetailCore/EG)',
    systemDependency: 'Masterdata & Integrationer',
    mandatoryGate: true,
    ruleNote: 'Kontrollera lokal valuta/moms (SEK/NOK/EUR) och lagersaldo.',
  },
  {
    id: 'ACT-12',
    phase: '2. Cut-over (Go-Live)',
    dayOffset: 0,
    startTime: '08:30',
    endTime: '09:15',
    activity: 'Smoke test genomfört (Inloggning, skanning, rabatt, kvitto & retur)',
    ownerRole: 'Butiks-Super-User & Fältsupport',
    responsibleParty: 'Gemensam (Kund + Leverantör)',
    systemDependency: 'RetailCore POS + Betalväxel',
    mandatoryGate: true,
    ruleNote: 'KRITISK ROLLBACK-GATE kl. 09:15! Vid blockerande fel aktiveras Rollback-rutin före öppning.',
  },
  {
    id: 'ACT-13',
    phase: '2. Cut-over (Go-Live)',
    dayOffset: 0,
    startTime: '09:30',
    endTime: '10:15',
    activity: 'Första skarpa försäljning verifierad vid butiksöppning',
    ownerRole: 'Butikschef',
    responsibleParty: 'Kund (Store Ops)',
    systemDependency: 'Kassalinje',
    mandatoryGate: true,
    ruleNote: 'Rapporteras direkt i vågens Go-Live-kanal.',
  },
  {
    id: 'ACT-14',
    phase: '2. Cut-over (Go-Live)',
    dayOffset: 0,
    startTime: '10:15',
    endTime: '11:00',
    activity: 'Första betalning & ERP-transaktion (GL2) verifierad end-to-end',
    ownerRole: 'Ekonomi / Integration & Leverantör',
    responsibleParty: 'Gemensam (Kund + Leverantör)',
    systemDependency: 'Betalväxel & GL2 Integration',
    mandatoryGate: true,
    ruleNote: 'Bekräftar att transaktionen landar korrekt i ekonomisystemet.',
  },

  // FAS 3: HYPERCARE – 5 STEG
  {
    id: 'ACT-15',
    phase: '3. Hypercare',
    dayOffset: 1,
    startTime: '09:00',
    endTime: '09:30',
    activity: 'Daglig uppföljning med butik under Hypercare-veckan',
    ownerRole: 'Hypercare Team',
    responsibleParty: 'Kund (Store Ops)',
    systemDependency: 'Hypercare Puls',
    mandatoryGate: false,
    ruleNote: 'Kort morgonavstämning kring driften under de första 5 dagarna.',
  },
  {
    id: 'ACT-16',
    phase: '3. Hypercare',
    dayOffset: 2,
    startTime: '10:00',
    endTime: '12:00',
    activity: 'Incidenthantering & verifiering av eventuella P1/P2-ärenden',
    ownerRole: 'Supportteam & Systemleverantör',
    responsibleParty: 'Gemensam (Kund + Leverantör)',
    systemDependency: 'ITSM / Ärendelogg',
    mandatoryGate: true,
    ruleNote: 'Inga öppna kritiska incidenter får kvarstå inför Exit.',
  },
  {
    id: 'ACT-17',
    phase: '3. Hypercare',
    dayOffset: 3,
    startTime: '13:30',
    endTime: '14:00',
    activity: 'Gemensamt supportmöte mellan Store Ops och systemleverantör',
    ownerRole: 'IT Support Lead & Leverantör',
    responsibleParty: 'Gemensam (Kund + Leverantör)',
    systemDependency: 'Hypercare Board',
    mandatoryGate: false,
    ruleNote: 'Mönsteranalys över vågens alla 70 butiker så samma fel inte upprepas i nästa våg.',
  },
  {
    id: 'ACT-18',
    phase: '3. Hypercare',
    dayOffset: 4,
    startTime: '11:00',
    endTime: '12:00',
    activity: 'Uppföljning av butiks-KPI:er (Kassatid, dagsavslut & lagerdiff)',
    ownerRole: 'Store Operations Analyst',
    responsibleParty: 'Kund (Store Ops)',
    systemDependency: 'BI / GL2 Avstämning',
    mandatoryGate: true,
    ruleNote: 'Säkerställ stabilitet i kassa- och påfyllnadsflöden (särskilt Feeder stores).',
  },
  {
    id: 'ACT-19',
    phase: '3. Hypercare',
    dayOffset: 5,
    startTime: '10:00',
    endTime: '11:30',
    activity: 'Uppföljning av kompletterande utbildningsbehov i butik',
    ownerRole: 'Training Lead & Super-User',
    responsibleParty: 'Kund (Store Ops)',
    systemDependency: 'Utbildningsportal',
    mandatoryGate: false,
    ruleNote: 'Fånga upp extrapersonal och helgmedarbetare.',
  },

  // FAS 4: EXIT (ÖVERLÄMNING TILL LINJEN) – 4 STEG
  {
    id: 'ACT-20',
    phase: '4. Exit (Överlämning till linjen)',
    dayOffset: 7,
    startTime: '09:00',
    endTime: '10:00',
    activity: 'Hypercare formellt avslutad för butiken',
    ownerRole: 'IT Support Lead',
    responsibleParty: 'Gemensam (Kund + Leverantör)',
    systemDependency: 'Hypercare Sign-off',
    mandatoryGate: true,
    ruleNote: 'Frigör Hypercare-kapacitet till efterföljande 70-butikersvåg!',
  },
  {
    id: 'ACT-21',
    phase: '4. Exit (Överlämning till linjen)',
    dayOffset: 7,
    startTime: '10:30',
    endTime: '11:15',
    activity: 'Lessons Learned genomförd och återmatad till nästa utrullningsvåg',
    ownerRole: 'PM Store Rollout',
    responsibleParty: 'Kund (Store Ops)',
    systemDependency: 'RAID / Förbättringslogg',
    mandatoryGate: false,
    ruleNote: 'Kontinuerlig trimning av mallen mellan vågorna.',
  },
  {
    id: 'ACT-22',
    phase: '4. Exit (Överlämning till linjen)',
    dayOffset: 8,
    startTime: '13:00',
    endTime: '13:30',
    activity: 'Go-live formellt godkänd mot Exit-kriterier',
    ownerRole: 'PM Store Rollout & Regionchef',
    responsibleParty: 'Kund (Store Ops)',
    systemDependency: 'Store Readiness & Exit Gate',
    mandatoryGate: true,
    ruleNote: 'Krävs för slutgodkännande av vågen.',
  },
  {
    id: 'ACT-23',
    phase: '4. Exit (Överlämning till linjen)',
    dayOffset: 8,
    startTime: '14:00',
    endTime: '14:30',
    activity: 'Butik överlämnad till ordinarie linjeorganisation & Service Desk',
    ownerRole: 'Linjechef & Ordinarie Support',
    responsibleParty: 'Kund (Store Ops)',
    systemDependency: 'Linjeförvaltning',
    mandatoryGate: true,
    ruleNote: 'Slutpunkt för butiken i utrullningsprojektet.',
  },
];

/**
 * Separata spår från Connies "Utkast - utrullningsplan.xlsx" (rad 105–135):
 * "Jag skulle även skapa egna kategorier för sådant som ofta glöms bort"
 */
export const FORGOTTEN_TRACKS: ForgottenTrackCategory[] = [
  {
    id: 'TRACK-RES',
    title: 'Resurs & Bemanning',
    subtitle: 'Flaskhals när 3 vågor rullar omlott',
    items: ['Supportteam (1st/2nd line)', 'Pilotteam', 'Lokala butiksresurser', 'Regionala Train-the-Trainer-resurser'],
  },
  {
    id: 'TRACK-DEP',
    title: ' Kritiska Systemberoenden',
    subtitle: 'Måste vara gröna före Pre-care',
    items: ['ERP / Ekonomisystem (GL2)', 'Systemleverantör (RetailCore/EG)', 'Infrastruktur & WiFi', 'Masterdata', 'Integrationer'],
  },
  {
    id: 'TRACK-RISK-DEC',
    title: 'Risker, Beslut & Rollback',
    subtitle: 'Styrning vid avvikelse i en 70-våg',
    items: ['Identifierad risk & ägare', 'Formella Go/No-Go-beslut', 'Rollback-rutin vid missat Smoke test', 'Utbrytning till Catch-up-våg'],
  },
];

/**
 * ============================================================================
 * 5. BUTIKSLISTA – INKLUSIVE EN FULL 70-BUTIKERSVÅG (VÅG 1 = 70 BUTIKER!)
 * Totalt 112 butiker (12 Pilotreferenser + 70 i Våg 1 + 15 nyckelbutiker i Våg 2 + 15 i Våg 3)
 * så att projektledarna på konferensen kan uppleva den riktiga 70-butikersutmaningen!
 * ============================================================================
 */
const SE_CITIES = [
  ['Stockholm City', 'Stockholm'],
  ['Uppsala Gränby', 'Uppsala'],
  ['Västerås Erikslund', 'Västerås'],
  ['Örebro Marieberg', 'Örebro'],
  ['Linköping Tornby', 'Linköping'],
  ['Norrköping Ingelsta', 'Norrköping'],
  ['Göteborg Nordstan', 'Göteborg'],
  ['Göteborg Frölunda', 'Göteborg'],
  ['Malmö Triangeln', 'Malmö'],
  ['Malmö Emporia', 'Malmö'],
  ['Helsingborg Väla', 'Helsingborg'],
  ['Lund Nova', 'Lund'],
  ['Jönköping Asecs', 'Jönköping'],
  ['Borås Knalleland', 'Borås'],
  ['Karlstad Bergvik', 'Karlstad'],
  ['Gävle Valbo', 'Gävle'],
  ['Sundsvall Birsta', 'Sundsvall'],
  ['Umeå Avion', 'Umeå'],
  ['Luleå Storheden', 'Luleå'],
  ['Täby Centrum', 'Stockholm'],
  ['Nacka Forum', 'Stockholm'],
  ['Barkarby Handelsplats', 'Stockholm'],
  ['Kungens Kurva', 'Stockholm'],
  ['Södertälje Kringlan', 'Södertälje'],
  ['Eskilstuna Tuna Park', 'Eskilstuna'],
  ['Halmstad Hallarna', 'Halmstad'],
  ['Växjö Samarkand', 'Växjö'],
  ['Kalmar Hansa City', 'Kalmar'],
  ['Kristianstad C4', 'Kristianstad'],
  ['Skövde Commerce', 'Skövde'],
  ['Uddevalla Torp', 'Uddevalla'],
  ['Kungsbacka Kungsmässan', 'Kungsbacka'],
  ['Falun Gruvan', 'Falun'],
  ['Borlänge Kupolen', 'Borlänge'],
];

const NO_CITIES = [
  ['Oslo Torggata', 'Oslo'],
  ['Oslo Storo', 'Oslo'],
  ['Sandvika Storsenter', 'Bærum'],
  ['Strømmen Storsenter', 'Lillestrøm'],
  ['Drammen Gulskogen', 'Drammen'],
  ['Bergen Lagunen', 'Bergen'],
  ['Bergen Åsane', 'Bergen'],
  ['Stavanger Kvadrat', 'Stavanger'],
  ['Trondheim Tiller', 'Trondheim'],
  ['Trondheim Solsiden', 'Trondheim'],
  ['Kristiansand Sørlandssenteret', 'Kristiansand'],
  ['Tromsø Jekta', 'Tromsø'],
  ['Ålesund Moa', 'Ålesund'],
  ['Fredrikstad Østfoldhallen', 'Fredrikstad'],
  ['Tønsberg Farmandstredet', 'Tønsberg'],
  ['Skien Herkules', 'Skien'],
  ['Bodø City Nord', 'Bodø'],
  ['Hamar CC Stadion', 'Hamar'],
  ['Lillehammer Strandtorget', 'Lillehammer'],
  ['Moss Amfi', 'Moss'],
];

const FI_CITIES = [
  ['Helsinki Kamppi', 'Helsinki'],
  ['Helsinki Itis', 'Helsinki'],
  ['Espoo Iso Omena', 'Espoo'],
  ['Espoo Sello', 'Espoo'],
  ['Vantaa Jumbo', 'Vantaa'],
  ['Tampere Ratina', 'Tampere'],
  ['Tampere Koskikeskus', 'Tampere'],
  ['Turku Hansa', 'Turku'],
  ['Turku Mylly', 'Raisio'],
  ['Oulu Ideapark', 'Oulu'],
  ['Jyväskylä Seppä', 'Jyväskylä'],
  ['Kuopio Matkus', 'Kuopio'],
  ['Lahti Karisma', 'Lahti'],
  ['Vaasa Espen', 'Vaasa'],
  ['Pori Puuvilla', 'Pori'],
  ['Lappeenranta IsoKristiina', 'Lappeenranta'],
];

const MANAGERS = [
  'Elin Lindberg',
  'Johan Kvarnström',
  'Sara Holm',
  'Morten Bakke',
  'Ingrid Solberg',
  'Mikko Korhonen',
  'Sanna Virtanen',
  'Oskar Nyberg',
  'Hanna Sjögren',
  'Kari Haugen',
  'Antti Nieminen',
  'Camilla Lund',
  'Fredrik Wallin',
  'Maja Olsson',
  'Viktor Hedlund',
];

function makeStore(params: {
  id: string;
  name: string;
  city: string;
  country: CountryCode;
  region: StoreRollout['region'];
  format: StoreFormat;
  registers: number;
  wave: WaveId;
  goLiveDate: string;
  sdwanStatus: PrepStatus;
  hardwareStatus: PrepStatus;
  trainingStatus: PrepStatus;
  preCareStatus: PrepStatus;
  storeManager: string;
  isPilotTrainer?: boolean;
  note?: string;
}): StoreRollout {
  const fieldTeam: FieldTeam =
    params.country === 'SE (Land A)'
      ? 'Team SE (Land A)'
      : params.country === 'NO (Land B)'
        ? 'Team NO (Land B)'
        : 'Team FI (Land C)';

  return {
    ...params,
    baselineGoLiveDate: params.goLiveDate,
    fieldTeam,
  };
}

function buildInitialStores(): StoreRollout[] {
  const list: StoreRollout[] = [];

  // 1. PILOTFAS (12 representativa pilotbutiker över Land A, B och C: Easy, Large, Feeder)
  const pilotSeeds: Array<{
    id: string;
    name: string;
    city: string;
    country: CountryCode;
    region: StoreRollout['region'];
    format: StoreFormat;
    registers: number;
    goLiveDate: string;
    isPilotTrainer: boolean;
    trainingStatus: PrepStatus;
    note: string;
  }> = [
    {
      id: 'PIL-001',
      name: 'Dalarna Hubb (Easy)',
      city: 'Borlänge',
      country: 'SE (Land A)',
      region: 'Mälardalen & Mitt',
      format: 'Easy store',
      registers: 3,
      goLiveDate: '2027-06-08', // Tis v.23
      isPilotTrainer: true,
      trainingStatus: 'Klar',
      note: 'Första Easy store i Land A – utbildar SE Mitt',
    },
    {
      id: 'PIL-002',
      name: 'Uppsala Storbutik (Large)',
      city: 'Uppsala',
      country: 'SE (Land A)',
      region: 'Mälardalen & Mitt',
      format: 'Large store',
      registers: 7,
      goLiveDate: '2027-06-15', // Tis v.24
      isPilotTrainer: true,
      trainingStatus: 'Klar',
      note: 'Första Large store i Land A – referens för högvolym',
    },
    {
      id: 'PIL-003',
      name: 'Örebro Regionshubb (Feeder)',
      city: 'Örebro',
      country: 'SE (Land A)',
      region: 'Mälardalen & Mitt',
      format: 'Feeder store',
      registers: 8,
      goLiveDate: '2027-06-22', // Tis v.25
      isPilotTrainer: true,
      trainingStatus: 'Klar',
      note: 'Första Feeder store i Land A – varuförsörjnings- & returflöde',
    },
    {
      id: 'PIL-004',
      name: 'Lillestrøm Easy Pilot',
      city: 'Lillestrøm',
      country: 'NO (Land B)',
      region: 'Norge (Öst/Väst)',
      format: 'Easy store',
      registers: 3,
      goLiveDate: '2027-07-06', // Tis v.27
      isPilotTrainer: true,
      trainingStatus: 'Klar',
      note: 'Första norska pilotbutik (NOK & norska skatteregler)',
    },
    {
      id: 'PIL-005',
      name: 'Oslo Storo Large Pilot',
      city: 'Oslo',
      country: 'NO (Land B)',
      region: 'Norge (Öst/Väst)',
      format: 'Large store',
      registers: 8,
      goLiveDate: '2027-07-08', // Tors v.27
      isPilotTrainer: true,
      trainingStatus: 'Klar',
      note: 'Tränarbutik för norska storbutiker i Våg 1',
    },
    {
      id: 'PIL-006',
      name: 'Espoo Easy Pilot',
      city: 'Espoo',
      country: 'FI (Land C)',
      region: 'Finland (Syd/Väst)',
      format: 'Easy store',
      registers: 3,
      goLiveDate: '2027-07-13', // Tis v.28
      isPilotTrainer: true,
      trainingStatus: 'Klar',
      note: 'Första finska pilotbutik (EUR & finska kvittokrav)',
    },
    {
      id: 'PIL-007',
      name: 'Helsinki Kamppi Large Pilot',
      city: 'Helsinki',
      country: 'FI (Land C)',
      region: 'Finland (Syd/Väst)',
      format: 'Large store',
      registers: 9,
      goLiveDate: '2027-07-15', // Tors v.28
      isPilotTrainer: true,
      trainingStatus: 'Klar',
      note: 'Tränarbutik för finska storbutiker',
    },
    {
      id: 'PIL-008',
      name: 'Göteborg Sisjön Pilot',
      city: 'Göteborg',
      country: 'SE (Land A)',
      region: 'Väst & Syd',
      format: 'Large store',
      registers: 6,
      goLiveDate: '2027-08-10', // Tis v.32
      isPilotTrainer: true,
      trainingStatus: 'Klar',
      note: 'Regional Train-the-Trainer för Västsverige',
    },
    {
      id: 'PIL-009',
      name: 'Malmö Svågertorp Feeder Pilot',
      city: 'Malmö',
      country: 'SE (Land A)',
      region: 'Väst & Syd',
      format: 'Feeder store',
      registers: 7,
      goLiveDate: '2027-08-12', // Tors v.32
      isPilotTrainer: true,
      trainingStatus: 'Klar',
      note: 'Regional Train-the-Trainer för Sydsverige',
    },
    {
      id: 'PIL-010',
      name: 'Bergen Åsane Feeder Pilot',
      city: 'Bergen',
      country: 'NO (Land B)',
      region: 'Norge (Öst/Väst)',
      format: 'Feeder store',
      registers: 6,
      goLiveDate: '2027-08-17', // Tis v.33
      isPilotTrainer: true,
      trainingStatus: 'Pågår',
      note: 'Utbildar Vestlandet inför Våg 1',
    },
    {
      id: 'PIL-011',
      name: 'Tampere Ratina Feeder Pilot',
      city: 'Tampere',
      country: 'FI (Land C)',
      region: 'Finland (Syd/Väst)',
      format: 'Feeder store',
      registers: 6,
      goLiveDate: '2027-08-18', // Ons v.33
      isPilotTrainer: true,
      trainingStatus: 'Avvikelse',
      note: 'OBS: Super-User sjukskriven – försenar regional träning i Västra FI!',
    },
    {
      id: 'PIL-012',
      name: 'Sundsvall Birsta Pilot',
      city: 'Sundsvall',
      country: 'SE (Land A)',
      region: 'Mälardalen & Mitt',
      format: 'Easy store',
      registers: 4,
      goLiveDate: '2027-08-19', // Tors v.33
      isPilotTrainer: true,
      trainingStatus: 'Klar',
      note: 'Regional Train-the-Trainer för Norrland',
    },
  ];

  for (let i = 0; i < pilotSeeds.length; i++) {
    const p = pilotSeeds[i];
    list.push(
      makeStore({
        id: p.id,
        name: p.name,
        city: p.city,
        country: p.country,
        region: p.region,
        format: p.format,
        registers: p.registers,
        wave: 'Pilot',
        goLiveDate: p.goLiveDate,
        sdwanStatus: 'Klar',
        hardwareStatus: 'Klar',
        trainingStatus: p.trainingStatus,
        preCareStatus: p.trainingStatus === 'Avvikelse' ? 'Avvikelse' : 'Klar',
        storeManager: MANAGERS[i % MANAGERS.length],
        isPilotTrainer: p.isPilotTrainer,
        note: p.note,
      })
    );
  }

  // 2. VÅG 1 – FULL 70-BUTIKERSVÅG (W1-001 till W1-070, Cut-over i v.36: tis 7 sep, ons 8 sep, tors 9 sep)
  // Vi planterar 5 realistiska avvikelser/kalenderkonflikter bland de 70 butikerna!
  const wave1ValidDates = ['2027-09-07', '2027-09-08', '2027-09-09']; // Tis, Ons, Tors v.36
  for (let idx = 0; idx < 70; idx++) {
    const num = idx + 1;
    const id = `W1-${String(num).padStart(3, '0')}`;

    let country: CountryCode;
    let region: StoreRollout['region'];
    let cityTuple: string[];

    if (idx < 34) {
      country = 'SE (Land A)';
      region = idx % 2 === 0 ? 'Mälardalen & Mitt' : 'Väst & Syd';
      cityTuple = SE_CITIES[idx % SE_CITIES.length];
    } else if (idx < 54) {
      country = 'NO (Land B)';
      region = 'Norge (Öst/Väst)';
      cityTuple = NO_CITIES[(idx - 34) % NO_CITIES.length];
    } else {
      country = 'FI (Land C)';
      region = 'Finland (Syd/Väst)';
      cityTuple = FI_CITIES[(idx - 54) % FI_CITIES.length];
    }

    const format: StoreFormat =
      idx % 7 === 0 ? 'Feeder store' : idx % 3 === 0 ? 'Large store' : 'Easy store';
    const registers = format === 'Feeder store' ? 7 : format === 'Large store' ? 6 : 3;

    let goLiveDate = wave1ValidDates[idx % 3];
    let sdwanStatus: PrepStatus = 'Klar';
    let hardwareStatus: PrepStatus = 'Levererad';
    let trainingStatus: PrepStatus = 'Klar';
    let preCareStatus: PrepStatus = 'Bokad';
    let note: string | undefined;

    // 5 planterade skarpa avvikelser i 70-butikersvågen (för Exception-First-styrning!)
    if (num === 14) {
      goLiveDate = '2027-09-06'; // MÅNDAG v.36! Bryter mot Connies Måndag/Fredag-regel!
      note = 'REGELBROTT: Råkat läggas på MÅNDAG (No rollout on Mondays or Fridays!)';
    } else if (num === 29) {
      hardwareStatus = 'Avvikelse';
      preCareStatus = 'Avvikelse';
      note = 'AVVIKELSE: 2 betalterminaler restnoterade i tullen – kandidat för Catch-up!';
    } else if (num === 42) {
      goLiveDate = '2027-09-10'; // FREDAG v.36! Bryter mot Connies Måndag/Fredag-regel!
      note = 'REGELBROTT: Inbokad på FREDAG före helghandel!';
    } else if (num === 58) {
      trainingStatus = 'Avvikelse';
      preCareStatus = 'Avvikelse';
      note = 'AVVIKELSE: Saknar regional Train-the-Trainer p.g.a. sjukdom i PIL-011 Tampere!';
    } else if (num === 65) {
      sdwanStatus = 'Avvikelse';
      preCareStatus = 'Avvikelse';
      note = 'AVVIKELSE: WiFi-täckning i utlämningslager ej godkänd vid nätverkstest';
    }

    list.push(
      makeStore({
        id,
        name: cityTuple[0],
        city: cityTuple[1],
        country,
        region,
        format,
        registers,
        wave: 'Våg 1',
        goLiveDate,
        sdwanStatus,
        hardwareStatus,
        trainingStatus,
        preCareStatus,
        storeManager: MANAGERS[idx % MANAGERS.length],
        note,
      })
    );
  }

  // 3. VÅG 2 – 15 REPRESENTATIVA NYCKELBUTIKER (Cut-over v.37: tis 14 sep – tors 16 sep, representerar 70-butikersvåg 2)
  const wave2Dates = ['2027-09-14', '2027-09-15', '2027-09-16'];
  for (let idx = 0; idx < 15; idx++) {
    const num = idx + 1;
    const id = `W2-${String(num).padStart(3, '0')}`;
    const country: CountryCode =
      idx < 7 ? 'SE (Land A)' : idx < 11 ? 'NO (Land B)' : 'FI (Land C)';
    const region: StoreRollout['region'] =
      country === 'SE (Land A)'
        ? 'Väst & Syd'
        : country === 'NO (Land B)'
          ? 'Norge (Öst/Väst)'
          : 'Finland (Syd/Väst)';
    const cityTuple =
      country === 'SE (Land A)'
        ? SE_CITIES[(idx + 10) % SE_CITIES.length]
        : country === 'NO (Land B)'
          ? NO_CITIES[(idx + 5) % NO_CITIES.length]
          : FI_CITIES[(idx + 4) % FI_CITIES.length];
    const format: StoreFormat =
      idx % 4 === 0 ? 'Feeder store' : idx % 2 === 0 ? 'Large store' : 'Easy store';

    list.push(
      makeStore({
        id,
        name: `${cityTuple[0]} II`,
        city: cityTuple[1],
        country,
        region,
        format,
        registers: format === 'Feeder store' ? 8 : format === 'Large store' ? 6 : 3,
        wave: 'Våg 2',
        goLiveDate: wave2Dates[idx % 3],
        sdwanStatus: 'Bokad',
        hardwareStatus: 'Skickad',
        trainingStatus: 'Pågår',
        preCareStatus: 'Planerad',
        storeManager: MANAGERS[(idx + 4) % MANAGERS.length],
        note: idx === 0 ? 'Pre-care startar v.36 samtidigt som Våg 1 gör Cut-over!' : undefined,
      })
    );
  }

  // 4. VÅG 3 – 15 REPRESENTATIVA NYCKELBUTIKER (Cut-over v.38–v.39: 21 sep – 30 sep, representerar 80-butikers slutvåg)
  const wave3Dates = ['2027-09-21', '2027-09-23', '2027-09-28', '2027-09-30'];
  for (let idx = 0; idx < 15; idx++) {
    const num = idx + 1;
    const id = `W3-${String(num).padStart(3, '0')}`;
    const country: CountryCode =
      idx < 7 ? 'SE (Land A)' : idx < 11 ? 'NO (Land B)' : 'FI (Land C)';
    const region: StoreRollout['region'] =
      country === 'SE (Land A)'
        ? 'Mälardalen & Mitt'
        : country === 'NO (Land B)'
          ? 'Norge (Öst/Väst)'
          : 'Finland (Syd/Väst)';
    const cityTuple =
      country === 'SE (Land A)'
        ? SE_CITIES[(idx + 18) % SE_CITIES.length]
        : country === 'NO (Land B)'
          ? NO_CITIES[(idx + 11) % NO_CITIES.length]
          : FI_CITIES[(idx + 9) % FI_CITIES.length];
    const format: StoreFormat =
      idx % 3 === 0 ? 'Feeder store' : idx % 2 === 0 ? 'Large store' : 'Easy store';

    list.push(
      makeStore({
        id,
        name: `${cityTuple[0]} Hub`,
        city: cityTuple[1],
        country,
        region,
        format,
        registers: format === 'Feeder store' ? 9 : format === 'Large store' ? 7 : 4,
        wave: 'Våg 3',
        goLiveDate: wave3Dates[idx % 4],
        sdwanStatus: 'Planerad',
        hardwareStatus: 'Planerad',
        trainingStatus: 'Ej startad',
        preCareStatus: 'Ej bokad',
        storeManager: MANAGERS[(idx + 8) % MANAGERS.length],
        note:
          idx === 14
            ? 'Sista Feeder-hubb före höstkampanjfrysen 25 okt – 0 veckors marginal vid 4v försening!'
            : undefined,
      })
    );
  }

  return list;
}

export const INITIAL_STORES: StoreRollout[] = buildInitialStores();
