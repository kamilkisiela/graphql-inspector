import {ResponsePath, GraphQLResolveInfo, GraphQLError} from 'graphql';
import {responsePathAsArray} from 'graphql/execution';

import {TraceNode} from '../node';
import {hrTimeToNs} from '../helpers';

export type ErrorTransform = (error: GraphQLError) => GraphQLError | null;

export class Builder {
  time?: Date;
  startTime?: number;
  startHrTime?: [number, number];
  duration?: number;
  parsing?: number;
  validation?: number;
  execution?: number;
  entry = new TraceNode();
  transformError: ErrorTransform;

  private nodeMap = new Map<string, TraceNode>([['', this.entry]]);

  constructor({transformError}: {transformError?: ErrorTransform}) {
    this.transformError = transformError || (error => error);
  }

  start() {
    this.startHrTime = process.hrtime();
    this.startTime = new Date().getTime();
  }

  stop() {
    this.duration = hrTimeToNs(process.hrtime(this.startHrTime));
  }

  parsingDidStart() {
    const start = process.hrtime();

    return () => {
      this.parsing = hrTimeToNs(process.hrtime(start));
    };
  }

  validationDidStart() {
    const start = process.hrtime();

    return () => {
      this.validation = hrTimeToNs(process.hrtime(start));
    };
  }

  executionDidStart() {
    const start = process.hrtime();

    return () => {
      this.execution = hrTimeToNs(process.hrtime(start));
    };
  }

  willResolveField(
    info: GraphQLResolveInfo,
  ): (error: Error | null, result?: any) => void {
    const path = info.path;
    const node = this.createNode(path);

    node.type = info.returnType.toString();
    node.parentType = info.parentType.toString();
    node.startTime = hrTimeToNs(process.hrtime(this.startHrTime));

    if (typeof path.key === 'string' && path.key !== info.fieldName) {
      // aliased
      node.originalField = info.fieldName;
    }

    return () => {
      node.endTime = hrTimeToNs(process.hrtime(this.startHrTime));
    };
  }

  didEncounterErrors(errors: readonly GraphQLError[]) {
    errors.forEach(error => {
      const transformedError = this.transformError(error);

      if (transformedError === null) {
        return;
      }

      const path = transformedError.path;
      let node = this.entry;

      if (Array.isArray(path)) {
        const fieldNode = this.nodeMap.get(path.join('.'));

        if (fieldNode) {
          node = fieldNode;
        }
      }

      node.errors.push({
        message: error.message,
        locations: error.locations,
        json: JSON.stringify(error),
      });
    });
  }

  private createNode(path: ResponsePath): TraceNode {
    const node = new TraceNode();
    const id = path.key;

    if (typeof id === 'number') {
      node.index = id;
    } else {
      node.field = id;
    }

    this.nodeMap.set(this.responsePathAsString(path), node);

    const parentNode = this.ensureParentNode(path);

    parentNode.children.push(node);

    return node;
  }

  private ensureParentNode(path: ResponsePath): TraceNode {
    const parentPath = this.responsePathAsString(path.prev);
    const parentNode = this.nodeMap.get(parentPath);

    if (parentNode) {
      return parentNode;
    }

    return this.createNode(path.prev!);
  }

  private responsePathAsString(path: ResponsePath | undefined) {
    if (path === undefined) {
      return '';
    }

    return responsePathAsArray(path).join('.');
  }
}
