import {Report} from '../types';
import {
  OperationModel,
  FieldModel,
  OperationTraceModel,
  FieldTraceModel,
} from './postgresql/models';

export interface AdapterConfig {
  /**
   * Debug mode (default: false)
   */
  debug?: boolean;
}

export interface Adapter {
  init(): Promise<void>;

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
  }): Promise<any[]>;
}
