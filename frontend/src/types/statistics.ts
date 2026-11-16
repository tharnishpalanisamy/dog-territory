export interface Statistics {
  dogs_count: number;
  reports_count: number;
  resolved_count: number;
  volunteers_count: number;
}

export type StatIcon = "paw" | "file" | "heart" | "users";



export interface StatCard {
  label: string;
  value: number;
  icon: StatIcon;
}