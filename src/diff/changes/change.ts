export enum CriticalityLevel {
  Breaking,
  NonBreaking,
  Dangerous,
}

export interface Criticality {
  level: CriticalityLevel;
  reason?: string;
}

export interface Change {
  message: string;
  path?: string;
  criticality: Criticality;
}
