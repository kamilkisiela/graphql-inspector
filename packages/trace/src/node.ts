import {TraceError} from './types';

export class TraceNode {
  /**
   * Index of a ListNode's item
   */
  index?: number;
  /**
   * Name of a field
   */
  field?: string;
  /**
   * Only if alias was used
   */
  originalField?: string;

  /**
   * Before field resolved
   */
  startTime?: number;
  /**
   * After field resolved
   */
  endTime?: number;
  /**
   * Field's type
   */
  type?: string;
  /**
   * Name of a parent type (type that field belongs to)
   */
  parentType?: string;
  /**
   * List of errors
   */
  errors: TraceError[] = [];
  /**
   * List of child elements (so fields...)
   */
  children: TraceNode[] = [];
}
