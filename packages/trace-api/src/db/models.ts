export interface OperationModel {
  id: number;
  name: string;
  operation: string;
  signature: string;
}

export interface FieldModel {
  id: number;
  name: string;
  type: string;
}

export interface OperationFieldModel {
  operationId: number;
  fieldId: number;
}

export interface OperationTraceModel {
  id: number;
  operationId: number;
  startTime: number;
  duration: number;
  parsing: number;
  validation: number;
  execution: number;
}

export interface FieldTraceModel {
  id: number;
  path: string;
  fieldId: number;
  operationTraceId: number;
  startTime: number;
  endTime: number;
}

export interface ErrorModel {
  id: number;
  message: string;
  json: string;
  fieldTraceId?: number;
  operationTraceId?: number;
}

export interface FieldUsageModel {
  id: number;
  operation: string;
  count: number;
  percentage: number;
}
