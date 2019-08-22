import ms = require('ms');
import {Report} from '@graphql-inspector/trace';
import {
  OperationModel,
  FieldModel,
  OperationTraceModel,
  FieldTraceModel,
  FieldUsageModel,
} from './models';

export function translatePeriod(period: string): number {
  return ms(period);
}

export interface AdapterConfig {
  /**
   * Debug mode (default: false)
   */
  debug?: boolean;
}

export interface Adapter {
  // write
  writeReport(report: Report): Promise<void>;

  // read
  readOperations(): Promise<OperationModel[]>;
  readOperationById(operationId: number): Promise<OperationModel>;
  readFields(): Promise<FieldModel[]>;
  readFieldById(fieldId: number): Promise<FieldModel>;
  readOperationTraces(): Promise<OperationTraceModel[]>;
  readFieldTraces(): Promise<FieldTraceModel[]>;
  readFieldTracesByOperationTraceId(
    operationTraceId: number,
  ): Promise<FieldTraceModel[]>;
  readFieldUsage(input: {
    field: string;
    type: string;
    period?: string;
  }): Promise<FieldUsageModel[]>;
}
