import {GraphQLExtension, EndHandler} from 'graphql-extensions';
import {DocumentNode, parse} from 'graphql';

import {Builder, ErrorTransform} from './builder';
import {Trace} from '../types';
import {uuid} from '../helpers';
import {normalizeOperation} from '../normalize/operation';

type FirstParam<K extends keyof GraphQLExtension> = Parameters<
  NonNullable<GraphQLExtension[K]>
>[0];

type Params<K extends keyof GraphQLExtension> = Parameters<
  NonNullable<GraphQLExtension[K]>
>;

export interface InspectorExtensionOptions {
  onTrace: (trace: Trace) => void;
  transformError?: ErrorTransform;
}

export class InspectorExtension implements GraphQLExtension {
  private builder: Builder;
  private operationName!: string;
  private document?: DocumentNode;
  private documentString?: string;
  private onTrace: (trace: Trace) => void;

  constructor({onTrace, transformError}: InspectorExtensionOptions) {
    this.builder = new Builder({transformError});
    this.onTrace = onTrace;
  }

  requestDidStart(o: FirstParam<'requestDidStart'>): EndHandler {
    this.builder.start();

    this.documentString = o.queryString;
    this.document = o.parsedQuery;

    return () => {
      this.builder.stop();
      this.onTrace({
        id: uuid(),
        operationName: this.operationName,
        query: normalizeOperation({
          operationName: this.operationName,
          document: this.document! || parse(this.documentString!),
        }),
        startTime: this.builder.startTime!,
        duration: this.builder.duration!,
        execution: this.builder.execution,
        validation: this.builder.validation,
        parsing: this.builder.parsing,
        entry: this.builder.entry,
      });
    };
  }

  parsingDidStart() {
    return this.builder.parsingDidStart();
  }

  validationDidStart() {
    return this.builder.validationDidStart();
  }

  executionDidStart(o: FirstParam<'executionDidStart'>) {
    if (o.executionArgs.operationName) {
      this.operationName = o.executionArgs.operationName;
    }
    this.document = o.executionArgs.document;

    return this.builder.executionDidStart();
  }

  willResolveField(
    _parent: Params<'willResolveField'>[0],
    _args: Params<'willResolveField'>[1],
    _context: Params<'willResolveField'>[2],
    info: Params<'willResolveField'>[3],
  ) {
    return this.builder.willResolveField(info);
  }

  didEncounterErrors(errors: FirstParam<'didEncounterErrors'>) {
    this.builder.didEncounterErrors(errors);
  }

  // private normalizeQuery(query: string): string {
  //   return query.replace(/\s+/g, ' ');
  // }
}
