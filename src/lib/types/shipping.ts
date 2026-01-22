/**
 * Shipping & Fulfillment Types
 *
 * Types for the cohort-based recruitment model where:
 * - Studies can use "recruited" (we ship) or "rebate" (they buy) model
 * - Recruited studies use cohort-based fulfillment with tracking
 * - Window opens → cohort forms → brand ships → all tracking entered → next window opens
 */

// ============================================
// STUDY SHIPPING CONFIGURATION
// ============================================

export type FulfillmentModel = 'recruited' | 'rebate';

export interface StudyShippingConfig {
  /** Whether this study requires product shipping */
  requiresShipping: boolean;
  /** How participants get the product */
  fulfillmentModel: FulfillmentModel;
  /** Fixed at 24 hours for recruited model */
  windowDurationHours: 24;
  /** Description of what's being shipped (e.g., "30-day supply of Sleep Support supplement") */
  productDescription?: string;
}

// ============================================
// COHORT (BATCH OF PARTICIPANTS)
// ============================================

export type CohortStatus =
  | 'recruiting'           // Window is open, participants enrolling
  | 'collecting_addresses' // Window closed, waiting for addresses from mobile app
  | 'pending_shipment'     // Addresses collected, ready for brand to ship
  | 'shipping'             // Brand is entering tracking codes
  | 'complete';            // All tracking entered, cohort done

export interface Cohort {
  id: string;
  studyId: string;
  cohortNumber: number;
  status: CohortStatus;
  /** When the recruitment window opened */
  windowOpenedAt: string;
  /** When the recruitment window closed (24h after open) */
  windowClosedAt?: string;
  /** Participant IDs in this cohort */
  participantIds: string[];
  /** How many addresses have been collected (from mobile app) */
  addressesCollected: number;
  /** How many tracking codes have been entered */
  trackingCodesEntered: number;
  /** True when all participants have tracking codes */
  allTrackingEntered: boolean;
  /** Average time from cohort ready to all shipped (in days) */
  avgShipTimeDays?: number;
  /** How many have been delivered */
  deliveredCount: number;
}

// ============================================
// PARTICIPANT SHIPPING RECORD
// ============================================

export type ParticipantShippingStatus =
  | 'waitlist'        // On waitlist, not yet enrolled
  | 'enrolled'        // Enrolled in cohort, address pending
  | 'address_pending' // Waiting for address from mobile app
  | 'ready_to_ship'   // Address collected, ready for shipment
  | 'shipped'         // Tracking code entered
  | 'delivered'       // Delivery confirmed
  | 'withdrawn';      // Participant withdrew

export interface ShippingAddress {
  fullName: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
}

export interface ParticipantShipping {
  participantId: string;
  studyId: string;
  cohortId: string;
  status: ParticipantShippingStatus;
  /** Shipping address collected via mobile app */
  address?: ShippingAddress;
  /** Tracking number entered by brand */
  trackingNumber?: string;
  /** Auto-detected from tracking format (UPS, USPS, FedEx, etc.) */
  trackingCarrier?: string;
  /** When participant enrolled in the cohort */
  enrolledAt?: string;
  /** When tracking code was entered */
  shippedAt?: string;
  /** When delivery was confirmed */
  deliveredAt?: string;
  /** Display name (e.g., "Sarah M.") */
  displayName: string;
  /** Initials for avatar */
  initials: string;
}

// ============================================
// STUDY RECRUITMENT STATE
// ============================================

export type RecruitmentStatus =
  | 'draft'          // Study not yet launched
  | 'waitlist_only'  // Accepting waitlist signups, no window open yet
  | 'window_open'    // Recruitment window is open
  | 'window_closed'  // Window closed, processing cohort
  | 'ready_to_open'  // All tracking entered, brand decides when to open next window
  | 'complete';      // Study is full

/** Snapshot of waitlist count at a point in time for trend tracking */
export interface WaitlistSnapshot {
  timestamp: string; // ISO timestamp
  count: number;
}

export interface StudyRecruitmentState {
  studyId: string;
  status: RecruitmentStatus;
  /** Current active cohort (if any) */
  currentCohort?: Cohort;
  /** Total participants enrolled across all cohorts */
  totalEnrolled: number;
  /** Target participant count for the study */
  targetParticipants: number;
  /** Number of people on waitlist (from backend) */
  waitlistCount: number;
  /** When current window ends (ISO string) */
  currentWindowEndsAt?: string;
  /** Number of participants enrolled in current window */
  currentWindowEnrolled: number;
  /** All cohorts for history display */
  cohorts: Cohort[];
  /** Historical conversion rate (enrolled / waitlist at window open) */
  conversionRate?: number;
  /** History of window opens for calculating conversion rate */
  windowHistory?: Array<{
    waitlistAtOpen: number;
    enrolled: number;
  }>;
  /** Historical waitlist snapshots for trend tracking */
  waitlistHistory?: WaitlistSnapshot[];
  /** Count of users on waitlist who have existing profiles (returning users) */
  returningUsersCount?: number;
  /** Count of new users on waitlist (no existing profile) */
  newUsersCount?: number;
}

// ============================================
// FULFILLMENT METRICS
// ============================================

export interface FulfillmentMetrics {
  /** Percentage of shipments sent within 48h of cohort ready */
  onTimePercent: number;
  /** Average days from cohort ready to all tracking entered */
  avgShipTimeDays: number;
  /** Total cohorts completed */
  cohortsCompleted: number;
  /** Total participants shipped to */
  totalShipped: number;
}
