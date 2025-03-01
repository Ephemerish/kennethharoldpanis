export type Vendors = 'aws' | 'azure' | 'gcp';

export interface AutomationSchedule {
  schedule: string; // Required: Unix cron format (e.g., "0 12 1 * *")
  scheduleMacro?: '@endofmonth'; // Optional: Adjusts scheduling behavior
  targetMonth?: '@current'; // Optional: Defaults to previous month if not set
  notificationChannel?: string; // Optional: Email notification channel ID
  force?: boolean; // Optional: Currently unused
  dryRun?: boolean; // Optional: If true, skips actual calculations
}

export interface StoreActions {
  getAutomationDates: (vendor: Vendors) => void;
  setAutomationDates: (
    vendor: Vendors,
    automationSchedule: AutomationSchedule
  ) => void;
  deleteAutomationDates: (vendor: Vendors, id: string) => void;
}

export interface StoreState {
  automationSchedules: Record<Vendors, AutomationSchedule>;
}
