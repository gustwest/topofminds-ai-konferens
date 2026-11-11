export type WaveId = 'Pilot' | 'Våg 1' | 'Våg 2' | 'Våg 3' | 'Våg 4';

export type CountryCode = 'SE (Land A)' | 'NO (Land B)' | 'FI (Land C)';

/**
 * Connies butikskategorier från "Tidplan - hypotes och alternativ.pptx":
 * Easy store, Large store, Feeder store.
 * (Vi behåller även StoreFormat som alias för bakåtkompatibilitet i ev. v0.2-skript.)
 */
export type StoreFormat = 'Easy store' | 'Large store' | 'Feeder store';

export type FieldTeam = 'Team SE (Land A)' | 'Team NO (Land B)' | 'Team FI (Land C)';

export type PrepStatus =
  | 'Klar'
  | 'Bokad'
  | 'Levererad'
  | 'Skickad'
  | 'Pågår'
  | 'Planerad'
  | 'Avvikelse'
  | 'Ej bokad'
  | 'Ej startad';

export type ResponsibleParty =
  | 'Kund (Store Ops)'
  | 'Systemleverantör (RetailCore/EG)'
  | 'Gemensam (Kund + Leverantör)';

/**
 * De 4 faserna för varje våg och butik från Connies "Utkast - utrullningsplan.xlsx"
 * (Fliken "List of all activities" -> "2. Aktiviteter per pilot-/utrullningsgrupp")
 */
export type CutoverPhase =
  | '1. Innan Go-Live (Pre-care)'
  | '2. Cut-over (Go-Live)'
  | '3. Hypercare'
  | '4. Exit (Överlämning till linjen)';

export interface RolloutWave {
  id: WaveId;
  title: string;
  subtitle: string;
  focusRegion: string;
  accentColor: string;
  badgeClass: string;
  barClass: string;
  targetGoal: string;
  plannedStoreScale: number; // T.ex. 37 i utökad pilot eller 70 butiker i en full våg
  preCareWeeks: number;      // 1 vecka enligt Connies PPT
  cutOverWeeks: number;      // 1 vecka enligt Connies PPT
  hyperCareWeeks: number;    // 1 vecka enligt Connies PPT
}

export interface StoreRollout {
  id: string;
  name: string;
  city: string;
  country: CountryCode;
  region: 'Mälardalen & Mitt' | 'Väst & Syd' | 'Norge (Öst/Väst)' | 'Finland (Syd/Väst)';
  format: StoreFormat;
  registers: number;
  wave: WaveId;
  goLiveDate: string; // YYYY-MM-DD (Single Source of Truth!)
  baselineGoLiveDate: string; // YYYY-MM-DD (Ursprunglig baslinje för diff/jämförelse i v0.2)
  fieldTeam: FieldTeam;
  sdwanStatus: PrepStatus;     // Verifiera nätverk & infrastruktur
  hardwareStatus: PrepStatus;  // Verifiera hårdvara
  trainingStatus: PrepStatus;  // Utbildning (Super-user / E-learning)
  preCareStatus: PrepStatus;   // Pre-care möte & supportberedskap
  storeManager: string;
  isPilotTrainer?: boolean;    // Pilotbutik som utbildar övriga butiker i sin region
  rolledBackToCatchUp?: boolean; // Om butiken brutits ut till Catch-up-våg vid avvikelse
  note?: string;
}

export interface CutoverStepTemplate {
  id: string;
  phase: CutoverPhase;
  dayOffset: number; // Relativt butikens goLiveDate (t.ex. -7..0..+7)
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  activity: string;
  ownerRole: string;
  responsibleParty: ResponsibleParty;
  systemDependency: string;
  mandatoryGate: boolean;
  ruleNote: string;
}

export interface ComputedCutoverStep extends CutoverStepTemplate {
  calendarDate: string; // Beräknat YYYY-MM-DD utifrån goLiveDate + dayOffset
  relativeLabel: string; // T.ex. "T-7d (Pre-care)", "T-0 (Cut-over)", "T+5d (Exit)"
  completed: boolean;
}

/**
 * Strukturer direkt från Connies "Store Operations - Master Plan.xlsx"
 * (Master Plan -> Activity Plan -> Roadmap + RAID Log)
 */
export type MasterPlanPhase = 'Foundation' | 'Pilot' | 'Rollout';

export type WorkstreamName =
  | 'Store Processes'
  | 'Testing & Quality'
  | 'Store Instructions & Training'
  | 'Pilot Preparation'
  | 'Store Readiness'
  | 'Communication & Change'
  | 'Support & Hypercare'
  | 'Rollout Preparation'
  | 'Rollout Conduction';

export interface ActivityPlanItem {
  id: string;
  masterPlanId: string;
  workstream: WorkstreamName;
  activity: string;
  doneWhen: string;
  owner: string;
  target: string;
  status: 'Klar' | 'Pågår' | 'To validate';
}

export interface MasterPlanDeliverable {
  id: string; // T.ex. SO-BP-001, SO-PILOT-001, SO-READY-001, SO-ROLL-001
  phase: MasterPlanPhase;
  workstream: WorkstreamName;
  deliverable: string;
  doneWhen: string;
  owner: string;
  target: string;
  dateConfidence: 'Confirmed' | 'Working assumption' | 'TBD';
  status: 'Klar' | 'Pågår' | 'To validate';
  rag: 'Green' | 'Amber' | 'Red' | 'Grey';
  nextStep: string;
  relatedRaidId?: string;
}

export interface RaidLogItem {
  id: string;
  type: 'Risk' | 'Assumption' | 'Issue' | 'Dependency';
  title: string;
  impact: string;
  relatedMasterPlanId: string;
  owner: string;
  nextAction: string;
  dueDate: string;
  status: 'Open' | 'Mitigating' | 'Escalated';
  escalateToSteerCo: boolean;
}

/**
 * Strukturer från Connies "Tidplan - hypotes och alternativ.pptx"
 * (Hypotes A: 6 vågor à 60 butiker vs Hypotes B: 37 pilotbutiker + Catch-up + 3 vågor à 70-80 butiker)
 */
export type HypothesisId = 'HYP_A' | 'HYP_B';

export interface HypothesisWaveBlock {
  id: string;
  label: string;
  storeSummary: string;
  storeCount: number;
  preCareStartWeek: number;  // 1..43
  cutOverWeek: number;       // 1..43
  hyperCareEndWeek: number;  // 1..43
  countries: string;
  highlightNote?: string;
}

export interface HypothesisTrainingTrack {
  id: string;
  label: string;
  startWeek: number;
  endWeek: number;
  category: 'Material' | 'Super-User' | 'Store Personnel' | 'Support';
}

export interface RolloutHypothesis {
  id: HypothesisId;
  badge: string;
  title: string;
  subtitle: string;
  pilotSummary: string;
  rolloutSummary: string;
  totalPilotStores: number;
  totalRolloutStores: number;
  waveCount: number;
  hasCatchUpWeek: boolean;
  catchUpWeekNumber?: number;
  keyTakeaways: string[];
  waves: HypothesisWaveBlock[];
  trainingTracks: HypothesisTrainingTrack[];
}

/**
 * Separata spår från Connies "Utkast - utrullningsplan.xlsx"
 * ("3. Lägg till separata spår: sådant som ofta glöms bort")
 */
export interface ForgottenTrackCategory {
  id: string;
  title: string;
  subtitle: string;
  items: string[];
}

/**
 * Styrnings- och spärrregler från Connies ark ("No rollout on Mondays or Fridays!",
 * helgdags-/frysperioder, Train-the-Trainer, samt SOW/SLA-regler).
 */
export interface FreezeWindow {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  restrictedFormats: StoreFormat[];
  sourceDoc: string;
  reason: string;
}

export interface GovernancePolicy {
  referenceToday: string;
  sowTargetEndDate: string;
  weeklyDelayPenaltySek: number;
  pilotStabilizationDays: number;
  maxStoresPerWeekTotal: number;
  maxStoresPerTeamPerWeek: number;
  teliaRescheduleNoticeDays: number;
  teliaLateRescheduleFeeSek: number;
  disallowMondaysAndFridays: boolean; // Från Connies "Overall Rollout Plan" rad 1!
  requirePilotRegionalTrainerBeforeWave1: boolean; // Från Connies "Overall Rollout Plan" rad 26!
  freezeWindows: FreezeWindow[];
}
