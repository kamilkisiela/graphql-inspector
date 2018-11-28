import {TypeCoverage, TypeChildCoverage} from '@graphql-inspector/core';

export interface ResolvedTypeCoverage extends TypeCoverage {
  name: string;
}

export interface ResolvedTypeChildCoverage extends TypeChildCoverage {
  name: string;
}
