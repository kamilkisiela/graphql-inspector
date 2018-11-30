import {
  TypeCoverage,
  TypeChildCoverage,
  Location,
  BestMatch,
} from '@graphql-inspector/core';

export interface ResolvedTypeCoverage extends TypeCoverage {
  name: string;
}

export interface ResolvedTypeChildCoverage extends TypeChildCoverage {
  name: string;
}

export interface ResolvedDocumentLocation {
  name: string;
  locations: Location[];
}

export interface ResolvedSimilar extends BestMatch {
  name: string;
}
