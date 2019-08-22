import {Report} from '../types';

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
  readOperations(): Promise<any[]>;
  readOperationById(operationId: number): Promise<any>;
  readFields(): Promise<any[]>;
  readFieldById(fieldId: number): Promise<any>;
  readOperationTraces(): Promise<any[]>;
  readFieldTracesByOperationTraceId(operationTraceId: number): Promise<any[]>;
}
